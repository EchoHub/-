# React性能优化相关

### React性能优化的核心是什么？引起的主要因素是什么？
- 优化核心：减少不必要的render

- 引起的主要因素：
    - setState
    - props变更
    - forceUpdate

### 优化手段有哪些？
- shouldComponentUpdate
    - 使用场景：组件更新控制
    - 原理：通过比对更新前后的props、state变化，来判断是否需要进行组件更新

- PureComponent
    - 使用场景：用于减少组件嵌套产生的额外渲染
    - 原理：通过对props、state进行浅比较，来判断是否更新组件

- Memo
    - 使用场景：用于减少函数式组件不必要的渲染
    - 原理：对props进行浅比较或通过传入到的compare函数进行比较

- 正确的使用key
    - 使用场景：列表渲染等
    - 原理：React在diff阶段会优先根据key来判断是否复用组件
    - 注意事项：避免直接使用索引做key

- Hook使用（useCallback、useMemo）
    - 使用场景：函数、值记忆场景

- 懒加载