/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const socketIO = require('socket.io');
const randomString = require('crypto-random-string');
const { InMemoryStore } = require('./store');
const { GameController } = require('./gameController');

const roomStore = new InMemoryStore();
const sessionStore = new InMemoryStore();

module.exports = {
    socket: (server) => {
        const io = socketIO(server, {
            cors: {
                origin: 'http://localhost:3000'
            }
        });

        io.use((client, next) => {
            const { sessionID = undefined } = client.handshake.auth;

            // Return saved session
            if (sessionID) {
                const session = sessionStore.find(sessionID);
                if (session) {
                    client.sessionID = sessionID;
                    client.userID = session.userID;
                    return next();
                }
            }

            // Create new session and user if sessionID doesn't exist
            client.sessionID = randomString(8);
            client.userID = randomString(8);
            return next();
        });

        io.on('connection', (client) => {
            const handleNewGame = ({ username }) => {
                const roomName = randomString(5);
                const gc = new GameController(roomName);

                gc.addUser(client.userID, username);
                roomStore.save(roomName, gc);

                // Informing sender
                client.join(roomName);
                io.to(client.id).emit('gameCreated', { roomName, allPlayers: [{ id: client.userID, username }] });
                // Informing all clients
                client.broadcast.emit('newGameCreated');
                console.log('joined new player');
            };

            const handleJoinGame = ({ roomName, username }) => {
                // Updating gc in store
                const gc = roomStore.find(roomName);
                gc.addUser(client.userID, username);
                roomStore.save(roomName, gc);

                const allPlayers = Array.from(
                    gc.getAllPlayers(),
                    ([name, value]) => ({ id: name, username: value })
                );

                // Joining room and informing users
                client.join(roomName);
                io.to(client.id).emit('gameJoined', { roomName, allPlayers });
                client.in(roomName).emit('playerJoined', { id: client.userID, username });
            };

            // console.log(sessionStore);

            sessionStore.save(client.sessionID, {
                userID: client.userID,
                connected: true
            });

            client.emit('session', {
                sessionID: client.sessionID,
                userID: client.userID
            });

            client.on('newGame', handleNewGame);
            client.on('joinGame', handleJoinGame);

            console.log('connected!');

            // socket.emit('users', users);

            // notify existing users
            client.broadcast.emit('userConnected', {
                userID: client.userID,
                username: client.username
            });

            // notify users upon disconnection
            client.on('disconnect', () => {
                client.broadcast.emit('userDisconnected', client.id);
            });
        });
    }
};
