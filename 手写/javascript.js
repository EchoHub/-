/**
 *@name Object.create
 */
function fakeCreate(obj) {
    function f() {}
    f.prototype = obj;
    return new f();
}

/**
 * @name instanceof
 */
function fakeInstanceof(obj, fn) {
    const proto = fn.prototype;
    let __proto__ = Object.getPrototypeOf(obj);
    while(true) {
        if (!__proto__) return false;
        if (__proto__ === proto) return true;
        __proto__ = Object.getPrototypeOf(__proto__);
    }
}


/**
 * @name new
 */
function fakeNew(fn, ...args) {
    const obj = Object.create(null);
    Object.setPrototypeOf(obj, fn.prototype);
    const result = fn.apply(obj, args)
    return typeof reuslt === 'object' && result !== null ? result : obj;
}

/**
 * @name promise
 */
const PENDING = 'PENDING';
const FULLFILLED = 'FULLFILLED';
const REJECTED = 'REJECTED';
function MyPromise(fn) {
    if (typeof fn !== 'function') {
        throw new Error('....')
    }

    this.resolveStack = [];
    this.rejectStack = [];
    this._status = PENDING;
    this._value = null;
    this._reason = null;
    const resolve_ = (val) => {

        const runResolve = val => {
            let cb;
            while(cb = this.resolveStack.shift()) {
                cb(val)
            }
        }

        const runReject = err => {
            let cb;
            while(cb = this.rejectStack.shift()) {
                cb(err)
            }
        }

        const run = () => {
            if(this._status !== PENDING) return;
            this._status = FULLFILLED;
            if (val instanceof MyPromise) {
                val.then(
                    v => {
                        this._value = v;
                        runResolve(v)
                    },
                    e => {
                        this._reason = e;
                        runReject(e)
                    }
                )
            } else {
                this._value = val;
                runResolve(val);
            }
        }

        setTimeout(run, 0)
    }

    const reject_ = (err) => {
        const run = () => {
            if (this._status !== PENDING) return;
            this._status = REJECTED;
            this._reason = err;
            let cb;
            while(cb = this.rejectStack.shift()) {
                cb(err);
            }
        }
        setTimeout(run, 0);
    }

    try {
        fn(resolve_.bind(this), reject_.bind(this))
    } catch (error) {
        reject_(error)
    }
}
MyPromise.prototype.then = function(onResolve, onReject) {
    const value = this._value;
    const reason = this._reason;
    const status = this._status;
    const self = this;
    return new MyPromise((onNextResolve, onNextReject) => {
        const resolve = val => {
            try {
                if (typeof onResolve === 'function') {
                    const result = onResolve(val);
                    if (result instanceof MyPromise) {
                        result.then(onNextResolve, onNextReject)
                    } else {
                        onNextResolve(val)
                    }
                } else {
                    onNextResolve(val);
                }
            } catch (error) {
                onNextReject(error);
            }
        }

        const reject = err => {
            try {
                if (typeof onReject === 'function') {
                    const result = onReject(err);
                    if (result instanceof MyPromise) {
                        result.then(onNextResolve, onNextReject)
                    } else {
                        onNextResolve(result);
                    }
                } else {
                    onNextReject(err);
                }
            } catch (error) {
                onNextReject(error)
            }
        }
        switch(status) {
            case PENDING:
                self.resolveStack.push(resolve);
                self.rejectStack.push(reject);
                break;
            case FULLFILLED:
                resolve(value);
                break;
            case REJECTED:
                reject(reason);
                break;
        }
    });
}
MyPromise.prototype.catch = function(onReject) {
    return this.then(undefined, onReject);
}
MyPromise.prototype.finally = function(onFinally) {
    return this.then(
        (value) => MyPromise.resolve(onFinally()).then(() => value),
        (err) => MyPromise.resolve(onFinally()).then(() => {
            throw err;
        })
    )
}
MyPromise.resolve = function(value) {
    if(value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value))
}
MyPromise.reject = function(error) {
    return new MyPromise((resolve, reject) => reject(error))
}
MyPromise.all = function(list) {
    return new MyPromise((resolve, reject) => {
        let count = 0, result = [];
        const total = list.length;
        Array.from(list).forEach((item, index) => {
            MyPromise.resolve(item).then(
                val => {
                    result[index] = val;
                    if (++count === total) resolve(result);
                },
                err => reject(err)
            )
        });
    })
}
MyPromise.allSettled = function(list) {
    return new MyPromise((resolve, reject) => {
        let count = 0, result = [];
        const total = list.length;
        Array.from(list).forEach((item, index) => {
            MyPromise.resolve(item).then(
                val => {
                    result[index] = { status: FULLFILLED, value: val };
                    if (++count === total) resolve(result)
                },
                err => {
                    result[index] = { status: REJECTED, reason: err };
                    if (++count === total) resolve(result)
                }
            )
        })
    })
}
MyPromise.race = function(list) {
    return new MyPromise((resolve, reject) => {
        Array.from(list).forEach(item => {
            MyPromise.resolve(item).then(
                v => resolve(v),
                e => reject(e)
            )
        })
    })
}
MyPromise.any = function(list) {
    return new MyPromise((resolve, reject) => {
        let count = 0;
        const total = list.length;
        Array.from(list).forEach((item, index) => {
            MyPromise.resolve(item).then(
                v => resolve(v),
                e => {
                    if (++ count === total) reject()
                }
            )
        })
    })
}

// const p1 = new MyPromise(resolve => resolve(1));
// const p2 = new MyPromise((resolve, reject) => reject(1));
// const p3 = new MyPromise((resolve, reject) => setTimeout(() => resolve(3), 2000));
// const p4 = new MyPromise((resolve, reject) => setTimeout(() => resolve(4), 2000));
// MyPromise.all([p1]).then(resp => console.log(resp))
// MyPromise.allSettled([p1, p2]).then(resp => console.log(resp))
// MyPromise.any([p2, p3]).then(resp => console.log(resp))
// MyPromise.race([p2, p4]).then(resp => console.log(resp), err => console.log(err))

/**
 * @name debounce
 */
function debounce(fn, wait, { immediate = false }) {
    let timer;
    return function (...args) {
        const invoke = () => {
            if (immediate) fn.apply(this, args);
            timer = setTimeout(() => {
                if (!immediate) fn.apply(this, args);
                clearTimeout(timer);
                timer = null;
            }, wait);
        }
        if (immediate) {
            if (timer) return;
            invoke()
            return;
        }
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        invoke();
    }
}

/**
 * @name throttle
 */
function throttle(fn, delay) {
    let curTime = Date.now();
    return function() {
        let context = this,
            args = arguments,
            nowTime = Date.now();

        // 如果两次时间间隔超过了指定时间，则执行函数。
        if (nowTime - curTime >= delay) {
        curTime = Date.now();
        return fn.apply(context, args);
        }
    };
}

/**
 * @name call
 */
Function.prototype.fakeCall = function (thisArg, ...args) {
    const ctx = thisArg || window;
    ctx['fn'] = this;
    const result = ctx['fn'](...args);
    delete ctx['fn'];
    return result;
}

/**
 * @name apply
 */
Function.prototype.fakeApply = function(thisArg, args) {
    const ctx = thisArg || window;
    ctx['fn'] = this;
    const result = ctx['fn'](...args);
    delete ctx['fn'];
    return result;
}

/**
 * @name bind
 */
Function.prototype.fakeBind = function(thisArg, ...args) {
    const fn = this;
    return function (...args2) {
        const ctx = thisArg || window;
        return fn.apply(ctx, args.concat(args2))
    }
}

// function say(age) {
//     console.log(this.name, age);
// }
// const s = say.fakeBind({ name: 'demo' }, 11);
// s();

/**
 * @name 柯里化
 */
function curry(fn, ...args) {
    const argLen = fn.length;
    return function (...args2) {
        const arguments_ = args.concat(args2);
        const len = arguments_.length;
        if (len >= argLen) return fn(...arguments_);
        return curry(fn, ...arguments_)
    }
}

// function sum(a,b,c) {
//     return a + b + c;
// }
// const fn = curry(sum);
// console.log(fn(1, 2, 3))
// console.log(fn(1)(2,3))
// console.log(fn(1, 2)(3))
// console.log(fn(1)(2)(3))

/**
 * @name ajax
 * 基于Promise封装ajax
 */
function ajax(url, params, options) {
    
}

/**
 * @name 浅拷贝
 */
function shallowCopy(obj) {
    if (!obj || typeof obj !== 'object') return;
    let newObject = Array.isArray(obj) ? [] : {};
    for(let k in obj) {
        newObject[k] = obj[k]
    }
    return newObject;
}

// const obj = { a: 1, b: { a: 2}};
// const obj2 = shallowCopy(obj);
// obj2.b.a = 3;
// console.log(obj, obj2);

/**
 * @name 深拷贝
 */
function deepClone(obj, memory) {
    memory = memory || new WeakMap();
    const type = Object.prototype.toString.call(obj).replace(/^\[object\s(\w+)\]$/, '$1').toLowerCase();
    switch(type) {
        case 'number':
        case 'string':
        case 'null':
        case 'undefined':
        case 'string':
        case 'symbol':
        case 'function':
            return obj;
        case 'date':
            return new Date(obj);
        case 'regexp':
            return new RegExp(obj);
        case 'set':
            const s = new Set();
            for (const ite of obj.entries()) {
                s.add(ite);
            }
            return s;
        case 'map':
            const m = new Map();
            for (const [k, v] of obj.entries()) {
                m.set(k, v)
            }
            return m;
        case 'array':
            let array = [];
            for (const item of obj) {
                array.push(deepClone(item, memory))
            }
            return array;
        default:
            let obj2;
            if (memory.has(obj)) {
                obj2 = memory.get(obj);
            } else {
                obj2 = {};
                memory.set(obj, obj2);
                for (let k2 in obj) {
                    obj2[k2] = deepClone(obj[k2], memory);
                }
            }
            return obj2;
    }
}
// const a = { a: 1, b: [1,2,3, {d: 4}], c: { a: 1, b: function(){}, c: new Date(), d: /\d/ }};
// const a2 = deepClone(a);
// a2.b[3].d = 3;
// console.log(a, a2);   

/**
 * @name 日期格式化
 * @param {*} date 
 * @param {*} formatStr 
 */
function dateFormat(date, formatStr) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return formatStr
        .replace(/yyyy/, year)
        .replace(/MM/, month)
        .replace(/dd/, day);
}
// console.log(dateFormat(new Date(), 'yyyy-MM-dd'))
// console.log(dateFormat(new Date(), 'yyyy/MM/dd'))
// console.log(dateFormat(new Date(), 'yyyy年MM月dd日'))

/**
 * @name 数组乱序
 * @param {*} array 
 */
function randomArray(array) {
    const len = array.length;
    for (let i = 0; i < len; i ++) {
        const index = Math.floor(Math.random() * len);
        [array[i], array[index]] = [array[index], array[i]]
    }
    return array;
}
// const array = [1,2,3,4,5,6,7,8,9]
// console.log(randomArray(array));
// console.log(randomArray(array));
// console.log(randomArray(array));

/**
 * @name 数组求和   
 * @param {*} array 
 */
function sum(array) {
    return array.reduce((a, b) => a +b,  0)
}
// console.log(sum([1,2,3]))
// console.log(sum([4,5,6]))
// console.log(sum([1,2,3,4,5,6]))

/**
 * @name Array.prototype.flat
 * @param {*} array 
 */
function flat(array, depth = 1) {
    if (depth === 0) return array;
    return array.reduce((a, b) => (a.concat(Array.isArray(b) ? flat(b, depth - 1) : b)), [])
}
// const array = [1,2, [3], [[4]], [5,6, [7], [[8, [9]]]]];
// console.log(flat(array))
// console.log(flat(array, 2))
// console.log(flat(array, 3))
// console.log(flat(array, 4))
// console.log(flat(array, 5))

/**
 * @name 数组去重
 * @param {*} array 
 */
function unique(array) {
    return new Set(array);
}
// const array = [1,1,2,2,3,3,4,4];
// console.log(unique(array))

/**
 * @name Array.prototype.push
 */
Array.prototype.fakePush = function(...args) {
    for(const item of args) {
        this[this.length] = item;    
    }
    return this.length;
}

/**
 * @name Array.prototype.filter
 * @param {*} filter 
 */
Array.prototype.fakeFilter = function(filter) {
    let newArray = [];
    this.forEach(item => {
        if (filter(item)) newArray.push(item);
    })
    return newArray;
}
// const array = [1,2,3,4,5,6,7];
// console.log(array.fakeFilter(item => (item % 2 === 0)))

Array.prototype.fakeMap = function(fn) {
    const newArray = [];
    this.forEach((item, index) => {
        newArray[index] = fn(item, index)
    })
    return newArray;
}
// const array = [1,2,3,4,5,6];
// console.log(array.map(item => item * 2))

/**
 * @name String.prototype.repeat
 * @param {*} count 
 */
function fakeRepeat(s, count) {
    let result = '';
    while(count) {
        count --;
        result += s;
    }
    return result;
}
// const str = 'abc';
// console.log(str, fakeRepeat(str, 3))

/**
 * @name 字符串翻转
 * @param {*} str 
 */
function reverse(str) {
    const strArray = str.split('');
    const len = strArray.length;
    for(let i = 0; i < Math.floor(len / 2); i ++) {
        [strArray[i], strArray[len - i]] = [strArray[len - i], strArray[i]]
    }
    return strArray.join('')
}
// console.log(reverse('1234567890'))

/**
 * @name 数字千分位分割
 * @param {*} number 
 * @param {*} format 
 */
function numberFormat(number, format) {
    return String(number).replace(/(?<!(\.\d+))(\d)(?=(\d\d\d)+(?!\d))/g, function(str) { return str + format })
}
// console.log(numberFormat(100000000, ','))
// console.log(numberFormat(100000000.123123, ','))

/**
 * @name json转树型结构
 * @param {*} json 
 */
function jsonToTree(array) {
    function node({ id, pid, name }) {
        return {
            id,
            parentId: pid,
            name,
            children: []
        }
    }
    const m = Object.create(null);
    for(const item of array) {
        if (!m[item.id]) {
            m[item.id] = node(item);
        }
        if (m[item.pid]) {
            m[item.pid].children.push(m[item.id])
        }
    }
    for(const k in m) {
        if(!m[k].pid) return m[k]
    }
}
// const array = [
//     {
//         id: 1,
//         pid: 0,
//         name: 'html'
//     },
//     {
//         id: 2,
//         pid: 1,
//         name: 'body'
//     },
//     {
//         id: 3,
//         pid: 2,
//         name: 'div1'
//     },
//     {
//         id: 4,
//         pid: 2,
//         name: 'div2'
//     }
// ]
// console.log(jsonToTree(array))

/**
 * @name 解析url params
 */
function urlParser(url) {
    const queryRegExp = /.+\?(.+)$/;
    if(!queryRegExp.exec(url)) return null;
    const paramsStr = queryRegExp.exec(url)[1];
    const paramsStrs = paramsStr.split('&');
    let params = Object.create(null);
    for (const item of paramsStrs) {
        const [k, v] = item.split('=')
        params[k] = decodeURIComponent(v);
    }
    return params;
}

// console.log(urlParser('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/repeat'))
// console.log(urlParser('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E6%AD%A3%E5%88%99%20.%2B&fenlei=256&oq=%25E6%259F%25A5%25E8%25AF%25A2&rsv_pq=d17d5ad7004c30e2&rsv_t=6a05XJdlSLS3VZ8kzKHgFlitb%2BnuesJQB9Ppqd7qo%2B4CBH4IstkXGC8O2ns&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_btype=t&inputT=6474&rsv_sug3=27&rsv_sug1=22&rsv_sug7=101&rsv_sug2=0&rsv_sug4=7026'))

/**
 * @name 场景题 分割线 #################################
 */


/**
 * @name 循环打印红绿灯
 * @description 红灯 3s 亮一次，绿灯 1s 亮一次，黄灯 2s 亮一次；如何让三个灯不断交替重复亮灯？
 */
async function trafficLightLoop(list) {
    let isLoop = true;
    const sleep = function(time) {
        return new Promise(resolve => {
            setTimeout(resolve, time * 1000)
        })
    }
    while(isLoop) {
        console.log(1)
        for (const item of list) {
            const [fn, time] = item;
            fn();
            await sleep(time)      
        }
    }
}
function red() { console.log('red') }
function green() { console.log('green') }
function yellow() { console.log('yellow') }
// trafficLightLoop([[red, 3], [green, 2], [yellow, 1]])

/**
 * @name 小孩报数
 * @description 有30个小孩儿，编号从1-30，围成一圈依此报数，1、2、3 数到 3 的小孩儿退出这个圈， 然后下一个小孩 重新报数 1、2、3，问最后剩下的那个小孩儿的编号是多少?
 */
function childNum(num) {
    let children = [];
    for(let i = 1; i <= num; i ++) {
        children.push(i)
    };
    let i = 0, j = 0;
    while(children.length > 1) {
        i ++;
        if (i === 3) {
            children.splice(j, 1);
            j --;
            i = 0;
        }
        j ++;
        if (j === children.length) j = 0;
    }
    return children[0]
}
// console.log(childNum(30))

/**
 * @name 查找文章中出现频率最高的单词
 */
function findMostWord(str) {
    const words = str.match(/([a-zA-Z])+/g);
    let counts = {}
    for(const word_ of words) {
        if (!counts[word_]) counts[word_] = 1
        else {
            counts[word_] += 1
        }
    } 
    return Object.keys(counts).reduce((a, b) => {
        if (!a) return b
        else return (counts[b] > counts[a] ? b : a)
    }, null);
}
// console.log(findMostWord("hi, my name is Happy, Yeap, I'm Happy"))

/**
 * @name 实现双向绑定
 */
function dataBind(obj) {
    Object.definedProperty(obj, {

    })
}
// const obj1 = dataBind(obj);
// obj1.a = 1;
// obj1.a;


/**
 * @name 字符串出现的不重复最长长度
 */
function maxNoRepeatStr(str) {
    const len = str.length;
    let i = 0, temp = '', max = '';
    while(i < len) {
        for (let j = i; j < len; j ++) {
            if (temp.indexOf(str[j]) === -1) {
                temp += str[j];
            } else {
                max = max.length > temp.length ? max : temp;
                temp = '';
                break;
            }
        }
        i ++;
    }
    max = max.length > temp.length ? max : temp;
    return [max, max.length]
}
// console.log(maxNoRepeatStr('123123134asdfadfasktw4toiwgoiwgf'))
// console.log(maxNoRepeatStr('123123134asdfadfask1234567890asdf'))

/**
 * @name 判断对象是否存在循环引用
 */
function isCycleObject(obj, memory) {
    if (typeof obj !== 'object' || !obj) return false;
    memory = memory || new WeakMap()
    memory.set(obj, obj)
    for (let k in obj) {
        const item = obj[k];
        if (memory.has(item)) return true;
        else {
            if (typeof item !== 'object' || !item) continue;
            const isCycle = isCycleObject(item, memory);
            if (isCycle) return true;
            else {
                memory.set(item, item);
            }
        }
    }
    return false;
}
// let a = 1, o = {};
// const b = {a};
// const c = {b};
// o.c = c;
// console.log(isCycleObject(o));
