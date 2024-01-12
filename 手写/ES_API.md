### 1. call、apply、bind
```
Function.prototype.myCall = function(ctx, ...args) {
   const self = ctx || window;
   const fn = Symbol('fn');
   self[fn] = this;
   const result = self[fn](...args);
   delete this[fn];
   return result;
}

Function.prototype.myApply = function(ctx, args) {
   const self = ctx || window;
   const fn = Symbol('fn');
   self[fn] = this;
   const result = self[fn](...args);
   delete this[fn];
   return result;
}

Function.prototype.myBind = function(ctx, ...args) {
    return (...args2) => this.myCall(ctx, ...args, ...args2);
}
```

### 2. sleep、delay函数
```
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

function delay(fn, time, ...args) {
    return new Promise(resolve => {
        sleep(time).then(Promise.resolve(fn(...args))).then(resolve)
    })
}
```

### 3. Promise.all
```
Promise.fakeAll = function(list) {
    return new Promise((resolve, reject) => {
        let len = list.length;
        let count = 0, result = [];
        list.forEach((item, index) => {
            Promise.resolve(item).then(resp => {
                result[index] = resp;
                if (++count === len) resolve(result)
            }, reject)
        })
    })
}
```

### 4. 根据PromiseA+ 实现Promise
```
./../javascript/promise.js
```

###  5. Array.isArray
```
Array.isArray2 = function(target) {
    return Object.prototype.toString.call(target) === '[object Array]'    
}
```

### 6. Array.prototype.flat 数组扁平化
```
function fakeFlat(array, depth = 1) {
    if (depth === 0) return array;
    return array.reduce((a, b) => a.concat(Array.isArray(b) ? fakeFlat(b, depth - 1) : b), [])
}

```

### 7. Array.prototype.flatMap 数组执行map后进行一次扁平，即map + flat(1)
```
function fakeFlatMap(array, callbackFn) {
    return array.map(item => callbackFn(item)).flat()
}
```

### 8. Array.prototype.reduce
```
Array.prototype.fakeReduce = function(callbackFn, initialValue) {
    let initialValue_ = initialValue;
    for (let i = 0, len = this.length;i < len; i ++) {
        const item = this[i];
        initialValue_ = callbackFn(initialValue_, item, i);
    }
    return initialValue_;
}
```

### 9. String.prototype.trim
```
String.prototype.fakeTrim = function() {
    return this.replace(/(^\s+)|(\s+$)/g, '')
}
```