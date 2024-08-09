class ModelHandler {
    constructor(model) {
        this.model = model;
        this.hasFieldUpdated = false;
    }

    async update(props, keys) {
        for (const key of keys) {
            if (props[key] !== undefined) {
                this.model[key] = props[key];
                this.hasFieldUpdated = true;
            }
        }
        return this.hasFieldUpdated;
    }
}

module.exports = ModelHandler;
