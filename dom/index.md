### 1. 如何找到当前页面出现的所有标签
- document.querySelectAll('*')
- document.getElementsByTagName('*')
- $$('*')

### 2. 如何找到当前出现次数最多的标签

### 3. 如何实现图片的懒加载
- 思路：图片位置计算 + 滚动监听 / getBoundingClientRect + 滚动监听/ IntersectionObserver

### 4. MutationObserver / IntersectionObserver 区别
- MutationObserver 监听指定元素变化
- IntersectionObserver 异步监听指定元素对于组件元素或者顶级文档视口的交叉信息变化

### 5. 如何设置/删除一个cookie，设计一个cookie管理工具
- document.cookie = '[key]=[value]'

### 6. 如何判断当前环境为移动端还是pc端
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

### 7. prefetch、preload区别
- prefetch、preload都是资源预加载的一种方式
- prefetch 告诉浏览器下一个页面可能需要加载的资源，优先级低
- preload  告诉浏览器当前页面加载完成之后立即需要加载的资源，优先级高

### 8. async、defer区别
- defer 在脚本加载完成后不会立即执行 从而不会阻断DOM的解析
- async  在脚本加载完成之后立即执行，从而会阻断DOM的解析

### 9. load与domContentLoaded区别
- 初始的页面加载、解析完成就会触发DomContentLoaded事件
- 页面加载且依赖的资源加载均完成才会触发load事件

### 10. 事件捕获、事件冒泡、事件流、事件委托
- 事件捕获：从外向内，从最外层document向内捕获至目标元素触发
- 事件冒泡：从内向外，从目标元素向上不断冒泡至最外层document触发
- 事件流： 捕获阶段、当前目标、冒泡阶段
- 事件委托：通过在元素的父级元素上添加一个事件处理函数统一处理子元素的事件，利用事件的冒泡机制，当事件冒泡到父级元素上时再根据注册的事件进行处理

### 11. router设计原理
- hash模式：通过location.hash进行路由路径切换，通过hashchange监听路由变化
- history模式：通过history.pushState/history.replaceState切换路由路径，通过popstate监听路由变化，pushState/replaceState不会触发popstate事件，但用户操作浏览器的前进后退时会触发
