class ModelHandler {
    constructor(model) {
        this.model = model;
    }

    async update(props, keys) {
        let hasFieldUpdated = false;
        for (const key of keys) {
            if (props[key] !== undefined) {
                this.model[key] = props[key];
                hasFieldUpdated = true;
            }
        }
        return hasFieldUpdated;
    }
}

module.exports = ModelHandler;
