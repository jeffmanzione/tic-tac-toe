export class Mutator {
  /**
   * @param {!Mutable} mutableServer
   * @param {Mutable=} mutableApp
   */
  constructor(mutableServer, mutableApp = new Mutable()) {
    /** @const {!Mutable} */
    this.server = mutableServer;
    /** @type {!Mutable} */
    this.app = mutableApp;
  }
}

export class Mutable {
  /** @param {!Object<string,!Function<Object,void>} consumers */
  constructor(consumers = {}) {
    /** @private @const {!Object<string,!Function<Object,void>} */
    this._consumers = consumers;
  }
  mutate(key, value) {
    if (this._consumers[key] == null) {
      console.log(`Missing mutator for '${key}'.`);
      return;
    }
    return this._consumers[key](value);
  }
}