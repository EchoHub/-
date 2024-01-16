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
    if (a === b) {
        return true
    }
    if (
        typeof a === 'object'
        && a !== null
        && typeof b === 'object'
        && b !== null
    ) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        for (const key of aKeys) {
            if (!isEqual(a[key], b[key])) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

```

### 5. get
```
function get(source, path, defaultValue) {
    const paths = path
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/\[\'(\w+)\'\]/g, '.$1')
        .replace(/\[\"(\w+)\"\]/g, '.$1')
        .split('.')
    let result = source;
    for (const p of paths) {
        result = result[p];
    }
    return result !== undefined ? result : defaultValue;
}

var a = {a: [1, 2, [{a: {b: [1,2, {c:1}]}}]]}
console.log(get(a, "a[2][0]['a']['b'][2]['c']"));

```

### 6. compose
```
function compose(...fns) {
    return fns.reduce((a, b) => (...args) => a(b(...args)))
}

```

### 7. shuffle
```
function shuffle(array) {
    // return array.sort(item => Math.random() - .5);

    for (let i = 0, len = array.length; i < len; i++) {
        const index = Math.floor(Math.random() * len);
        const item = array[index];
        array[index] = array[len - index - 1];
        array[len - index - 1] = item;
    }
    return array;
}

const a = [1,2,3,4,5,6,7,8,9,0];
console.log(shuffle(a))
```

### 8. sample
```
function sample(array) {
    return array[Math.floor(Math.random() * array.length)]
}
const a = [1,2,3,4,5,6,7,8,9,0];
console.log(sample(a))
```

### 9. sampleSize
```
function sampleSize(array, count) {
    const indexCache = new Set();
    let current = 0;
    const len = array.length;
    let result = [];
    while(current < count) {
        let random = Math.floor(Math.random() * len);
        while(indexCache.has(random)) {
            random = Math.floor(Math.random() * len);
        }
        indexCache.add(random);
        result.push(array[random])
        current ++;
    }
    return result;
}
const a = [1,2,3,4,5,6,7,8,9,0];
console.log(sampleSize(a, 3))

```

### 10. maxBy 根据给定条件输出最大的数组项
```
function maxBy(array, keyBy) {
    return array.reduce((a, b) => {
        if (b.value > a[0].value) return  [b]
        else if (b.value === a[0].value) {
            return [b, ...a]
        } else {
            return a
        }
    }, array)
}

const array = [
    { value: 1},
    { value: 11},
    { value: 2},
    { value: 22},
];
const result = maxBy(array, x => x.value)
console.log(result)
```

### 11. keyBy 利用对象的键都是有序的，把类数组转成了对象
``` 
function keyBy(array, by) {
    return array.reduce((a, b) => {
        a[by(b)] = b;
        return a;
    }, {});
}
const array = [{ id: 1, desc: '哈哈哈'}, { id: 2, desc: '哈哈哈2'}]
console.log(keyBy(array, item => item.id))
```

### 12. groupBy 将数组按照指定键进行分组
```
function groupBy(array, iteratee) {
    return array.reduce((a, b) => {
        const key = typeof iteratee === 'function' ? iteratee(b) : b[iteratee];
        if (!key) return a;
        if (!a[key]) a[key] = [];
        a[key].push(b);
        return a;
    }, Object.create(null))
}

const array = [{ age: 18, name: '张三' }, { age: 22, name: '李四'}, { age: 18, name: '王五'}, { age: 20, name: '赵二'}, { name: '麻子'}]
console.log(groupBy(array, 'age'))
```

### 13. chunk 将数组（array）拆分红多个 size 长度的区块，并将这些区块组成一个新数组。
```
function chunk(array, size) {
    const len = Math.ceil(array.length / size);
    const result = new Array(len);
    let current = 0;
    while(current < len) {
        const temp = [];
        for (let i = 0; i < size; i++) {
            temp[i] = array[current * size + i];
        }
        result[current ++] = temp;
    }
    return result;
}
const array = [1,2,3,4,5,6,7,8,9,0];
console.log(chunk(array, 3));
```

### 14. once 实现一个 once 函数，记忆返回结果只执行一次
```
function once(fn) {
    let result;
    let revoked = false;
    return function(...args) {
        if (revoked) return result;
        result = fn(...args);
        done = true;
        return result;
    }
}

```

### 15. template 实现一个 render/template 函数，可以用以渲染模板
```
const template = '{{ user["name"] }}，今天你又学习了吗 - 用户ID: {{ user.id }}';
const data = {
  user: {
    id: 10086,
    name: "山月",
  },
};
function get(source, path) {
    const paths = path
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/\[\'(\w+)\'\]/g, '.$1')
        .replace(/\[\"(\w+)\"\]/g, '.$1')
        .split('.');
    let result = source;
    for (const p of paths) {
        result = result[p];
    }
    return result;
}
function render(template, data) {
    return template.replace(/{{\s+([^\s]+)\s+}}/g, (capture, key) => {
        console.log(capture, key)
        return get(data, key)
    })
}
console.log(render(template, data));
```

### 16. pick/pickBy/omit/omitBy
```
// 提取对象中的属性
function pick(target, keys) {
    const obj = Object.create(null);
    for (const key of keys) {
        obj[key] = target[key]
    }
    return obj;
}

// 提取对象中符合筛选器规则的属性
function pickBy(target, fn) {
    const obj = Object.create(null);
    for(const k in target) {
       if(fn(target[k], k)) obj[k] = target[k]
    }
    return obj;
}
const demo = { a: 1, b: '2', c: 3 };
console.log(pick(demo, ['b', 'c']));
console.log(pickBy(demo, (value, key) => key === 'a' || typeof value === 'number'));

// 剔除指定属性
function omit(target, keys) {
    return  Object.keys(target).reduce((a, b) => {
        if (!keys.includes(b)) a[b] = target[b]
        return a
    }, {});
}
const demo = { a: 1, b: '2', c: 3 };
console.log(omit(demo, ['b', 'c']));

// 根据筛选器规则剔除属性
function omitBy(target, fn) {
    const obj = Object.create(null);
    for (const k in target) {
        if (!fn(target[k], k)) obj[k] = target[k]
    }
    return obj;
}
const demo = { a: 1, b: '2', c: 3 };
console.log(omitBy(demo, (value, key) => key === 'a'));
```

### 17. camelCase
```
function camelCase(str) {
    return str.replace(/-([a-zA-Z])/g, (all, i) => i.toUpperCase())
}
const case1 = 'get-element-by-id';
console.log(camelCase(case1))
```

### 18. intersection 获取数组交集
```
function intersection(...list) {
    return list.reduce((a, b) => a.filter(i => b.includes(i)))
}
const a = [1,2,3,4,5,6];
const b = [0,9,8,7,6,5];
console.log(intersection(a, b));

```

### 19. cookie操作
```

```