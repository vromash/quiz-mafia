/* eslint-disable max-classes-per-file */
// /* abstract */ class GameController {
//     addUser(userId) {}

//     removeUser(userId) {}

//     updateStatus(status) {}
// }

class GameController {
    static phases = {
        pending: 0,
        active: 1,
        finished: 2
    };

    constructor(room) {
        this.room = room;
        this.players = new Map();
        this.status = GameController.phases.pending;
    }

    addUser(id, username) {
        this.players.set(id, username);
        return this.players.size;
    }

    getAllPlayers() {
        return Array.from(
            this.players,
            ([name, value]) => ({ id: name, username: value })
        );
    }

    removeUser(id) {
        this.players.delete(id);
        return this.players.size;
    }

    updateStatus(status) {
        this.status = status;
        return this.status;
    }
}

module.exports = {
    GameController
};
