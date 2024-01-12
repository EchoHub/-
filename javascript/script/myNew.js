function myNew(fn, ...args) {
    const instance = Object.create(fn.prototype);
    const ret = fn.apply(instance, args);
    return typeof ret === 'object' && ret !== null ? ret: instance
}