const express = require('express');

const { Game } = require('../models/Game');

const router = express.Router();

router.get('/active-games', async (req, res) => {
    try {
        // const g = new Game();s
        const activeGames = await Game.getActiveNumber();
        console.log(activeGames);
        res.send({ activeGames });
    } catch (e) {
        res.status(500).send('Something went wrong');
    }
});

router.get('/user-in-game/:id', (req, res) => {
    // const game = gameStore.isUserInGame(req.params.id);
    // console.log(req.params.id);
    // res.send({ room: game ? game.room : null });
});

module.exports = router;
