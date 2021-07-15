/* eslint-disable max-classes-per-file */
class Store {
    find(id) { }

    save(id, storeObject) {}

    findAll() {}
}

class InMemoryStore extends Store {
    constructor() {
        super();
        this.elements = this.createStorage();
    }

    // eslint-disable-next-line class-methods-use-this
    createStorage() {
        return new Map();
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
}

module.exports = {
    InMemoryStore
};
