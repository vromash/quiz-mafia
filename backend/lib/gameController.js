/* eslint-disable max-classes-per-file */
// /* abstract */ class GameController {
//     addUser(userId) {}

//     removeUser(userId) {}

//     updateStatus(status) {}
// }

class GameController {
    constructor(room) {
        this.room = room;
        this.players = new Map();
        this.status = '';
    }

    addUser(id, username) {
        this.players.set(id, username);
        return this.players.size;
    }

    getAllPlayers() {
        return this.players;
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
