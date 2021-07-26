const express = require('express');

const { Game } = require('../models/Game');

const router = express.Router();

router.get('/active-games', async (req, res) => {
    try {
        const activeGames = await Game.getActiveNumber();
        res.send({ activeGames });
    } catch (e) {
        res.status(500).send('Failed to get active games');
    }
});

router.get('/user-in-game/:id', async (req, res) => {
    try {
        const game = await Game.isUserInGame(req.params.id);
        const data = {
            inGame: !!game,
            gameId: game ? game.id : null,
            roomId: game ? game.roomId : null
        };

        res.send(data);
    } catch (e) {
        res.status(500).send('Failed to find user in game');
    }
});

module.exports = router;
