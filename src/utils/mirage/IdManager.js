import faker from "faker";

export default class {
  constructor() {
    this.ids = new Set();
  }

  // Returns a new unused unique identifier.
  fetch() {
    let uuid = faker.random.alphaNumeric(24);
    while (this.ids.has(uuid)) {
      uuid = faker.random.alphaNumeric(24);
    }

    this.ids.add(uuid);

    return uuid;
  }

  // Registers an identifier as used. Must throw if identifier is already used.
  set(id) {
    if (this.ids.has(id)) {
      throw new Error(`ID ${id} has already been used.`);
    }

    this.ids.add(id);
  }

  // Resets all used identifiers to unused.
  reset() {
    this.ids.clear();
  }
}
