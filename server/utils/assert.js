class Assert {
    /** 检查值 */
    static expect(value, expected) {
        if (value !== expected)
            Assert.throw(`value not match: ${value} !== ${expected}`);
    }

    /** 检查对象属性 */
    static prop(obj, props) {
        if (!Array.isArray(props)) throw new Error('props must be an array');
        if (Object.keys(obj).length !== props.length)
            Assert.throw('props count not match');
        props.forEach((prop) => {
            if (!(prop in obj)) Assert.throw(`prop "${prop}" not found`);
        });
    }

    /** 检查对象是否为数组 */
    static array(obj, length) {
        if (!Array.isArray(obj)) Assert.throw('not an array');
        if (length !== undefined && obj.length !== length)
            Assert.throw(`length not match: ${obj.length} !== ${length}`);
    }

    /** 报错 */
    static throw(message) {
        throw new Error(`Assert: ${message}`);
    }
}

module.exports = Assert;
