/* eslint-disable no-param-reassign */
const socketIO = require('socket.io');
const randomString = require('crypto-random-string');

const { User } = require('../models/User');
const { Game, STATUSES: gameStatuses } = require('../models/Game');
const { sanitizeModel } = require('./database');

module.exports = {
    socket: (server) => {
        const io = socketIO(server, {
            cors: {
                origin: 'http://localhost:3000'
            }
        });

        io.use(async (client, next) => {
            const { sessionId = undefined } = client.handshake.auth;

            // Return saved session
            if (sessionId) {
                let user;
                try {
                    user = await User.findOne({ sessionId }).exec();
                } catch (e) {
                    console.log(e);
                }

                if (user) {
                    client.userId = user.id;
                    client.sessionId = user.sessionId;
                    return next();
                }
            }

            const newUser = new User({
                id: randomString(8),
                sessionId: randomString(8),
                connected: false
            });

            try {
                newUser.save();
            } catch (e) {
                console.error(e);
            }

            // Create new session and user if sessionId doesn't exist
            client.userId = newUser.id;
            client.sessionId = newUser.sessionId;

            // Send session data to user
            client.emit('session', {
                userId: newUser.id,
                sessionId: newUser.sessionId
            });

            return next();
        });

        io.on('connection', (client) => {
            const handleCreateGame = async ({ id, username }) => {
                let user;
                try {
                    user = await User.findOne({ id }).exec();
                } catch (e) {
                    console.error(e);
                    io.to(client.id).emit('userNotFound');
                    return;
                }

                const newGameDoc = new Game({
                    id: randomString(8),
                    roomId: randomString(5),
                    players: [{
                        // eslint-disable-next-line no-underscore-dangle
                        _id: user['_id'],
                        id: user.id,
                        username
                    }],
                    status: gameStatuses.pending
                });

                try {
                    newGameDoc.save();
                } catch (e) {
                    console.error(e);
                }

                const newGameObject = newGameDoc.toObject();

                // Informing sender
                client.join(newGameObject.roomId);

                io.to(client.id).emit('gameCreated', {
                    gameId: newGameObject.id,
                    roomId: newGameObject.roomId,
                    allPlayers: newGameObject.players.map((el) => sanitizeModel(el))
                });

                // Informing all users
                client.broadcast.emit('GameCreated');
            };

            const handleJoinGame = async ({ roomId, id, username }) => {
                let userDoc;
                let gameDoc;
                try {
                    userDoc = await User.findOne({ id }).exec();
                    gameDoc = await Game.findOne({ roomId }).exec();
                } catch (e) {
                    console.error(e);
                    io.to(client.id).emit('userNotFound');
                    return;
                }

                gameDoc.players.push({
                    // eslint-disable-next-line no-underscore-dangle
                    _id: userDoc['_id'],
                    id: userDoc.id,
                    username
                });

                try {
                    gameDoc.save();
                } catch (e) {
                    console.error(e);
                }

                const foundGameObject = gameDoc.toObject();

                // Join room and inform users
                client.join(foundGameObject.roomId);
                io.to(client.id).emit('playerJoined', {
                    gameId: foundGameObject.id,
                    roomId: foundGameObject.roomId,
                    allPlayers: foundGameObject.players.map((el) => sanitizeModel(el))
                });
                client.in(foundGameObject.roomId).emit('PlayerJoined', { id: client.userId, username });
            };

            const handleLeaveGame = async ({ gameId, userId }) => {
                let gameDoc;
                try {
                    gameDoc = await Game.findOne({ id: gameId }).exec();
                } catch (e) {
                    console.error(e);
                    io.to(client.id).emit('userNotFound');
                    return;
                }

                let updatedGameDoc;
                try {
                    // TODO: rework removePlayer
                    await gameDoc.removePlayer(userId);
                    updatedGameDoc = await Game.findOne({ id: gameId }).exec();
                } catch (e) {
                    console.error(e);
                    io.to(client.id).emit('failedToRemove');
                    return;
                }

                // Leave room and inform users
                client.leave(updatedGameDoc.roomId);
                io.to(client.id).emit('playerLeft');
                client.in(updatedGameDoc.roomId).emit('PlayerLeft', client.userId);

                // Finish game if no players left
                if (updatedGameDoc.players.length <= 0) {
                    try {
                        updatedGameDoc.status = gameStatuses.finished;
                        updatedGameDoc.save();
                    } catch (e) {
                        console.error(e);
                        io.to(client.id).emit('somethingFailed');
                        return;
                    }
                    io.emit('GameEnded');
                }
            };

            const handleConnect = async () => {
                // Add or update session in db
                try {
                    await User.updateOne({ id: client.userId }, { connected: true });
                } catch (e) {
                    console.error(e);
                    io.to(client.id).emit('somethingFailed');
                }
            };

            const handleDisconnect = async () => {
                try {
                    await User.updateOne({ id: client.userId }, { connected: false });
                } catch (e) {
                    console.error(e);
                    io.to(client.id).emit('somethingFailed');
                }
            };

            handleConnect();

            client.on('createGame', handleCreateGame);
            client.on('joinGame', handleJoinGame);
            client.on('leaveGame', handleLeaveGame);
            client.on('disconnect', handleDisconnect);
        });
    }
};
