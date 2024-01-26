### type 与 interface 的异同
- 都可描述一个对象或函数
- 都可扩展
- type 可以定义基本类型、联合类型、元组等；interface可以进行声明合并

### 泛型
使用泛型，可以实现组件的复用，可以通过自己的类型来使用组件

### 什么是泛型约束
在使用泛型时，若想通过某些限制条件限制泛型的设计，则可以通过泛型约束实现，即通过继承的方式 约定该类泛型需要满足哪些条件
```
interface Limit {
    length: number
}
T extends Limit
```

### 泛型工具有哪些
- keyof
- typeof 
- in
- Partial
- Record
- Omit
- Pick
- Extract
- Exclude