### DOCTYPE作用
DOCTYPE用来声明文档类型，告诉浏览器如何解析文档。
- 文档解析分为两种：标准模式（即基于W3C标准进行文档解析）；快速模式（即向后兼容的文档解析，兼容老浏览器）
- 不同解析模式对于文档的解析结果不同

### 常用的meta标签有哪些
- charset 设置文档编码类型
- keywords 设置关键词
- description 设置描述
- refresh 设置重定向
- viewport 设置移动端
    - width （device-width等）
    - height（device-height等）
    - initial-scale
    - maximum-scale
    - minimum-scale
    - user-scalable

### 资源预加载 prefetch、preload区别
- prefetch、preload都是资源预加载的一种方式
- prefetch 利用浏览器空闲时间下载即将用到的资源，优先级低
- preload  告诉浏览器当前页面加载完成之后立即需要加载的资源，优先级高
```
<link src="xx/xx.x" rel="preload">
```

### 如何通过link加载script文件
```
// 设置 as = 'script'
<link ref="xx/x.js" as="script">
```

### script异步加载 async、defer区别
- defer 在脚本加载完成后不会立即执行 从而不会阻断DOM的解析
- async  在脚本加载完成之后立即执行，从而会阻断DOM的解析
- 多个async加载不保证执行顺序，多个defer加载顺序执行



### 如何找到当前页面出现的所有标签
- document.querySelectAll('*')
- document.getElementsByTagName('*')
- $$('*')

### 如何实现图片的懒加载
- 思路：图片位置计算 + 滚动监听 / getBoundingClientRect + 滚动监听/ IntersectionObserver

### MutationObserver / IntersectionObserver 区别
- MutationObserver 监听指定元素变化
- IntersectionObserver 异步监听指定元素对于组件元素或者顶级文档视口的交叉信息变化

### 如何判断当前环境为移动端还是pc端
- 通过navigator.userAgent 判断Android/iPhone
```
function isMobile() {
    var userAgentInfo = navigator.userAgent;
    
    // 手机端常见的关键词有"Android", "iPhone", "Windows Phone"等
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgentInfo)) {
        return true;   // 返回true表示当前环境为移动端
    } else {
        return false;  // 返回false表示当前环境为PC端
    }
}
```

### load与domContentLoaded区别
- 初始的页面加载、解析完成就会触发DomContentLoaded事件
- 页面加载且依赖的资源加载均完成才会触发load事件

### 事件捕获、事件冒泡、事件流、事件委托
- 事件捕获：从外向内，从最外层document向内捕获至目标元素触发
- 事件冒泡：从内向外，从目标元素向上不断冒泡至最外层document触发
- 事件流： 捕获阶段、当前目标、冒泡阶段
- 事件委托：通过在元素的父级元素上添加一个事件处理函数统一处理子元素的事件，利用事件的冒泡机制，当事件冒泡到父级元素上时再根据注册的事件进行处理

### 通过requestAnimationFrame与定时器执行动画的区别
- requestAnimation称为请求帧动画，即浏览器会在下一次重绘前调用
- 区别
    - 使用requestAnimationFrame执行动画时 当页面被隐藏时会停止，当页面重新激活时，会从上一次中断的地方继续执行；而定时器在后台也会继续执行
    - 使用requestAnimationFrame执行动画时 可以保证触发的频率，不会出现多次重绘的现象
    - 使用requestAnimationFrame 可减少DOM操作，每一次执行会收集到所有的DOM元素
    - 使用定时器，由于受到主线程执行影响，更容易出现掉帧现象

### requestIdleCallback
在当前帧还有剩余时间的情况下执行

### 页面渲染的流程
