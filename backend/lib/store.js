/* eslint-disable max-classes-per-file */
const { GameController } = require('./gameController');

class Store {
    find(id) { }

    save(id, storeObject) {}

    findAll() {}
}

class InMemoryStore extends Store {
    constructor() {
        super();
        this.elements = new Map();
    }

    find(id) {
        return this.elements.get(id);
    }

    save(id, element) {
        this.elements.set(id, element);
    }

    findAll() {
        return [...this.elements.values()];
    }

    delete(id) {
        this.elements.delete(id);
    }
}

class InMemoryGameControllerStore extends InMemoryStore {
    findWithStatus(status) {
        return this.findAll().filter((gc) => gc.status !== status);
    }

    findNotFinished() {
        return [
            ...this.findWithStatus(GameController.phases.pending),
            ...this.findWithStatus(GameController.phases.active)
        ];
    }
}

module.exports = {
    InMemoryStore,
    InMemoryGameControllerStore
};
