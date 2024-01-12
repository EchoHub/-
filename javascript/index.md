### 1. 数据结构
- 基础数据结构
    - Number
    - String
    - BigInt
    - Undefined
    - Null
    - Symbol
    - Boolean
- 复杂数据结构
    - Array
    - Object
    - Set
    - Map
    - WeakSet
    - WeakMap
    - Function
- Map与Object区别、Set与Array区别、WeakMap与Map区别、WeakSet与Set区别
    - Map与Object区别

    - Set与Array区别

    - WeakMap与Map区别

    - WeakSet与Set区别


### 2. 作用域、作用域链

### 3. 原型、原型链

### 4. 继承
- 几种继承
- extends实现

### 5. new运算符
- 原理
    - 创建空对象
    - 指向原型
    - this绑定，并执行函数
    - 处理函数返回值，若有显示对象结果则返回该返回值，否则则返回该对象
- 实现
    - ./script/myNew.js

### 6. createClass



### 7. 列出常用的Number、String、Array、Object Api
- Number：isNaN、isInteger、isInfinite、isSafeInteger、Number.prototype.toFixed
- String：
 - prototype： concat、startsWith、endsWith、includes、indexOf、trim、repeat、replace、slice、split、match
- Array：
 - isArray、from、of
 - prototype：slice、splice、indexOf、includes、some、every、push、pop、unshift、shift、reduce、filter、flat、flatMap...
- Object:
 - create、assign、defineProperty、defineProperties、keys、values、entries、fromEntries

### 8. call、apply、bind
- 区别
    - 都是绑定this的方式
    - call、apply立即执行，bind返回函数
    - call、bind入参为单个，apply为数组
- 实现：
    - ./script/call&apply&bind.js

### 9. typeof、instanceof区别
- typeof只可以判断基础类型（null除外）
- instanceof借助原型链判断类型


### 10. 异步解决方案 
- Promise
    - API
    - Promise.all 所有promise兑现
    - Promise.allSettled 所有promise都已敲定（兑现或者失败）
    - Promise.any 任何一个promise兑现
    - Promise.race 任何一个promise兑现
    - Promise.resolve 将输入值转为promise，并其结果值以兑现结束
    - Promise.reject  返回一个拒绝的promise
    - Promise.prototype.then 用于处理promise兑现、拒绝后的回调，可进行链式调用
    - Promise.prototype.catch 用于捕获promise的拒绝调用，可进行链式调用其他promise
    - Promise.prototype.finally 在promise被敲定后调用
    - 实现
        - ./script/promise.js
- Async/Await
- Generator

### 11. 什么是Iterable对象，与Array的区别
- Iterable对象：实现了[Symbol.iterator]接口定义的对象，可通过for...of实现对象值得遍历
```
var a = [1,2,3,4,5,6];
a[Symbol.iterator] = function() {
    const self = this;
    const keys = Object.keys(self);
    const len = keys.length;
    let count = 0;
    return {
        next() {
            return {
                value: `[${count}]` + self[keys[count]],
                done: count ++ >= len
            }
        }
    }
}
for(const item of a) {
    console.log(item)
}
```

### 12. Proxy、Reflect

### 13. 简述Event Loop
由于浏览器的限制，js执行是单线程的，即所有任务均需要顺序执行，上一个执行完成才会执行下一个，因此JS分为同步任务、异步任务，同步任务在主线程中顺序执行，异步任务会交由对应的线程处理并将运行结果以回调函数的形式依次放入到任务队列中等待主线程调用，主线程在执行完同步任务之后会依次从任务队列中获取任务回调到执行栈内执行。

### 14. 简述垃圾回收机制


### 15. V8如何执行一段代码

### 16.什么是闭包以及闭包的应用
- 闭包是一种可访问其他函数内部的变量、方法的技术，其产生原因在于内部函数访问外部函数的局部变量、函数，而内部函数又被引用，这是外部函数中的局部变量由于被引用而无法被回收从而一直保存在内存之中
- 应用：1）访问内部变量；2）保存在内存中不被释放
- 场景：
    - 封装私有变量、函数等
    - 定时器、事件处理 用于保存临时状态
    - 缓存结果
    - 函数式编程：柯里化、高阶函数、延迟执行（防抖、截流等）等
    - 模块封装，以避免全局污染
