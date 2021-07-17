/* eslint-disable no-param-reassign */
const socketIO = require('socket.io');
const randomString = require('crypto-random-string');
const { InMemoryStore, InMemoryGameControllerStore } = require('./store');
const { GameController } = require('./gameController');

const gameStore = new InMemoryGameControllerStore();
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
                gameStore.save(roomName, gc);

                // Informing sender
                client.join(roomName);
                io.to(client.id).emit('gameCreated', { roomName, allPlayers: [{ id: client.userID, username }] });
                // Informing all clients
                client.broadcast.emit('newGameCreated');
                console.log('joined new player');
            };

            const handleJoinGame = ({ roomName, username }) => {
                // Updating gc in store
                const gc = gameStore.find(roomName);
                gc.addUser(client.userID, username);
                gameStore.save(roomName, gc);

                const allPlayers = gc.getAllPlayers();

                // Join room and inform users
                client.join(roomName);
                io.to(client.id).emit('gameJoined', { roomName, allPlayers });
                client.in(roomName).emit('playerJoined', { id: client.userID, username });
            };

            const handleLeaveGame = ({ roomName }) => {
                const gc = gameStore.find(roomName);
                gc.removeUser(client.userID);
                gameStore.save(roomName, gc);

                // Leave room and inform users
                client.leave(roomName);
                io.to(client.id).emit('gameLeft', { roomName });
                client.in(roomName).emit('playerLeft', client.userID);

                // Finish game if not players left
                if (gc.getAllPlayers().length <= 0) {
                    gc.updateStatus(GameController.phases.finished);
                    gameStore.save(roomName, gc);
                    client.emit('playerLeft', client.userID);
                }
            };

            const handleConnect = () => {
                // Add or update session in db
                sessionStore.save(client.sessionID, {
                    userID: client.userID,
                    connected: true
                });

                // Send session data to user
                client.emit('session', {
                    sessionID: client.sessionID,
                    userID: client.userID
                });

                client.emit('rooms', gameStore.findNotFinished().length);
                console.log('connected!');
            };

            const handleDisconnect = () => {
                // TODO: add cron to remove room after last player disconnected

                sessionStore.save(client.sessionID, {
                    userID: client.userID,
                    connected: false
                });
            };

            handleConnect();

            client.on('newGame', handleNewGame);
            client.on('joinGame', handleJoinGame);
            client.on('leaveGame', handleLeaveGame);
            client.on('disconnect', handleDisconnect);
        });
    }
};
