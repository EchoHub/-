### 1. 防抖
```
function debounce(fn, delay, { immediate: true }) {
    return function(...args) {
        function clear() {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }
        let timer;
        if (immediate) {
            if (timer) return;
            fn(...args);
            timer = setTimeout(() => {
                clear();
            }, delay)
        } else {
            clear();
            timer = setTimeout(() => {
                fn(...args);
                clear();
            }, delay)
        }
    }
}
```

### 2. 截流
```
function throttle(fn, time, { immediate: true }) {
    return function(...args) {
        function clear() {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }
        let timer;
        if (timer) return;
        if (immediate) {
            fn(...args);
            timer = setTimeout(() => {
                clear();
            }, time)
        } else {
            timer = setTimeout(() => {
                fn(...args);
                clear();
            }, time)
        }
    }
}
```

### 3. deepClone
```
const demo = {
    a: 1,
    b: '1',
    c: [1, 2, {a:1, b: [1,2,3], c: true, d: () => console.log(1)}, true, () => console.log(2), [1,2,3]],
    d: {a : 1, b: [1, 2, [3, [4, {a : 1, b: () => console.log(3)}]]]},
    e: true,
    f: Symbol(1),
    g: new Map([[Symbol(1), 1], [2, 3]]),
    h: new Set([1,1,2,3,3,4,5,6,6,7,7])
}
function deepClone(target, memory) {
    const objectType = Object.prototype.toString.call(target).replace(/^\[object\s(\S+)\]$/, '$1');
    memory || (memory = new WeakMap());
    console.log('objectType >>>', objectType)
    switch(objectType) {
        case 'Number':
        case 'String':
        case 'Symbol':
        case 'Boolean':
        case 'BigInt':
        case 'Null':
        case 'Undefined':
        case 'Function':
            return target;
        case 'RegExp':
            return new RegExp(target);
        case 'Date':
            return new Date(target);
        case 'Array':
            return target.map(item => deepClone(item, memory));
        case 'Set':
            const newSet = new Set();
            for(const item of target) {
                newSet.add(deepClone(item, memory))
            }
            return newSet;
        case 'Map':
            const newMap = new Map();
            for(const [k, v] of target) {
                newMap.set(k, deepClone(v, memory))
            }
            return newMap;
        default:
            // 引用类型
            if (memory.has(target)) {
                return memory.get(target);
            } else {
                let newObject = Object.create(null);
                memory.set(target, newObject);
                Object.keys(target).forEach(key => {
                    const val = target[key];
                    newObject[key] = deepClone(val, memory);
                })
                return newObject;
            }
    }
}
const b = deepClone(demo);
console.log(b);
```

### 4. isEqual 深度比较函数
```
function isEqual(a, b) {
    
}

```

### 5. get
```

```

### 6. compose
```

```

### 7. shuffle
```

```

### 8. sample
```

```

### 9. sampleSize
```

```

### 10. maxBy
```

```

### 11. keyBy
```

```

### 12. groupBy
```

```

### 13. chunk
```

```


### 14. template
```

```

### 15. pickBy/omitBy
```

```

### 16. camelCase
```

```

### 17. difference
```

```


### 18. url解析
```

```

### 19. cookie操作
```

```