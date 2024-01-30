# Fiber架构

### 新老架构对比
- Stack 架构（不可中断同步递归更新）
    - 组成
        - 协调器 Reconciler：负责找出变化的组件
        - 渲染器 Renderer：负责将变化的组件渲染到页面上
        - 【PS：】协调器和渲染器交替执行，即协调器找出更新，renderer就会进行更新；整个更新同步执行期间不可中断
    - 更新流程：
        - 调用组件函数（class组件render函数）将JSX转为VDOM
        - 进行新老VDOM对比
        - 通过对比找出更新部分的组件
        - 通知renderer将变化的VDOM渲染到页面上 
    - 缺点
        - 同步更新策略，若组件嵌套结构负责，则会产生明显的卡顿现象。
            - 递归遍历更新，一旦开始无法中断，若组件的嵌套层次过深，则递归更新的时间就会超过16ms

- Fiber 架构（可中断异步更新）
    - 组成
        - 调度器 Scheduler（requestIdleCallback polyfill：负责调度任务的优先级，优先级高的任务优先进入Reconciler阶段
            - 计算浏览器在每一帧的剩余空闲时间
            - 进行优先级任务调度
        - 协调器 Reconciler：负责找出变化的组件
            - 可中断的循环实现，每次执行都会通过shouldYield获知是否还有剩余时间
        - 渲染器 Renderer：负责将变化的组件渲染到页面上
    - 更新流程：
        - 大致
            - Scheduler接收到更新通知，进行任务优先级调度，后交给Reconciler
            - Reconciler接收到会对需要更新的VDOM进行操作标记（新增、删除、修改等）
            - 以上两部都在内存中处理，因此在此阶段可以循环中断，而页面上无任何表现
            - 通知Renderer进行组件更新操作
        - mount阶段
            - 首次渲染 react会创建fiberRootNode、rootFiber，fiberRootNode对应整个应用的根节点，而rootFiber对应调用render创建的容器节点；fiberRootNode的current会指向当前页面渲染的fiber树，第一次渲染时为null
            - 执行render阶段，react会在内存里面构建一个workInProgress树，其会尝试复用对应fiber树上的节点信息，并在此次更新构造完成之后，在commit阶段，将workInProgress树变为current。
        - update阶段
            - 触发render，构建workInProgress树，并根据diff结果决定是否复用对应current fiber（alternate指向）上的节点信息
            - 进入commit阶段，进行组件渲染，并将workInProgress树变为current。
    - 优点：
        - 异步可中断
        - 任务优先级调度
        - concurrent模式提供了在长渲染环境下更为良好的交互性能
    - 状态更新机制
        - 支持不同优先级任务，可中断、恢复，且恢复后可复用中断之前的状态
    - “双缓存”
        - 在内存中构建并直接替换的技术
        - react中：current、workInProgress    

    - Fiber 下 render流程（总）
        - 整体流程为一个可中断的循环流程，通过shouldYield判断是否还有剩余时间，若有则继续执行，若没有则放到下一帧继续处理
        - 整体采用深度优先的遍历方式，整体fiber树的构建分为“递”和“归”两个阶段：
            - “递”阶段：向下遍历子节点，并依次调用beginWork，即创建子节点，并进行节点关联，当遇到叶子节点时则进入“归”阶段
                - beginWork(current, workInProgress, renderLanes)
                    - 根据current是否有值判断是否为第一次渲染即mount阶段还是update阶段；若是mount阶段则会根据fiber.tag创建子fiber，若为update阶段则会根据fiber的diff结果判断是否直接使用current.child作为workInProgress.child还是重新创建新的子fiber
                    - react会根据Fiber操作的类型打上EffectTag标签，标记Effect。
            - “归”阶段：依次调用completeWork处理节点，当执行完成后会先判断是否有兄弟节点sibling，若有则继续进行兄弟节点的“递”操作，若没有则进入父节点的“归”阶段，直到根节点，render阶段执行完成
                - completeWork
                    - 将当前节点以及子节点的effect形成effect List 传递给父组件
    - Fiber下 commit流程
        - react会把在commit阶段收集到的effectList顺序执行，即操作DOM进行渲染等

### Concurrent模式
- 任务如何按照时间分片，分片后如何中止与恢复
- 任务的优先级如何设定
- 如何让高优先级任务“插队”先执行       