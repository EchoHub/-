### 简述 CSS Specificity （CSS权重）
- CSS的选择器包含：
    - id选择器
    - 类选择器、属性选择器、伪类选择器
    - 标签选择器、伪类选择器
，其优先级为：ID选择器 > 类选择器、属性选择器、伪类选择器 > 标签选择器、伪元素选择器
（其中通配符选择器*、组合选择器[+、~、>]、否定伪类选择器并不影响优先级）
- 此外 内联样式以及!important具有更高的权重级别
- !important > 内联 > id选择器 > 类选择器、属性选择器、伪类选择器 > 标签选择器、伪元素选择器 > 兄弟选择器、子选择器、后代选择器 > 通配符选择器

### “+”与“~”选择器的区别
- “+”： 匹配所有的兄弟选择器
- “~”： 匹配随后的所有兄弟选择器

### 简述CSS盒子模型
- CSS盒子模型分为标准盒子模型、IE盒子模型；
- 标准盒子模型的宽高只包含内容高度（Content Height），而IE盒子模型的宽高包含内容高度、内边距以及边宽；
- 我们可以通过设置box-sizing来进行两种盒子模型的转换，border-box则表示IE盒子模型，content-box则表示标准盒子模型；
- 公式：
    - 标准盒子模型（cotent-box）： height = Content Height；width = Content Width；
    - IE盒子模型（border-box）：height = Content Height + Padding + Border； width = Content Width + Padding + Border；

### 清除元素间空白的方式
- 设置父元素的font-size为0
- 设置父元素的word-spacing为负值

### z-index与层叠上下文
- 层叠上下文：假设用户正对浏览器视窗，html元素相对用户形成的一条虚拟的z轴排列的内容即为层叠上下文
- z-index可用来改变元素在当前层叠上下文中的层叠水平
- 层叠上下文的作用在于其子元素按照一定的优先级顺序进行层叠排列：
    - 如何形成层叠上下文
        - 1）设置position为relative、absolute
        - 2）设置position为fixed、sticky
        - 3）设置flex、grid，且z-index不为auto
        - 4）其他
    - 如何设置层叠元素优先级：可通过设置z-index设置子元素的层叠顺序
    - 层叠上下文的特点
        - 1）层叠上下文可包含在其他层叠上下文中
        - 2）每个层叠上下文独立于其兄弟元素，即只影响其子元素
        - 3）层叠上下文发生变化时，其在父级上下文中会按照层叠顺序重新层叠
- 通过层叠上下文进行分组，再通过z-index来设置元素的堆叠的优先级

### 水平垂直居中实现
- flex布局
- grid布局
- position + translate

### 左侧固定、右侧自适应
- flex布局：
    - 左侧元素 flex-basis：固定宽度
    - 右侧元素 flex-grow：1；flex-shrink：0；
- grid布局
    - grid-template-columns: 200px 1fr;

### 三栏均分布局
- flex：1;
- flex-basis：calc(100% / 3);
- grid-template-column: 1fr 1fr 1fr;

### CSS 如何避免样式冲突问题
- BEM规范约束
- css scoped
- css module

### CSS变量作用
- 样式复用，统一管理
- 用法
 ```
    :root {
        --bgColor: #f0f0f0;
    }
    .bg {
        background-color: var(--bgColor);
    }
 ```

 ### 谈谈Styled-Component
 - 一种“css in js”的方案
 - 优点：
    - 新增css作用域，即实现组件级样式隔离
    - 动态样式
    - 可维护、可扩展、可抽象、可继承
 - 缺点：
    - 增加运行时开销

### display: inline 的元素设置 margin 和 padding 会生效吗
- margin 左右生效、上下不生效
- padding 左右上下都生效，但在上下只会覆盖不会影响其他元素进行挤压

### 如何实现动态高度动画
- 通过max-height 替换height实现
 ```
    .p {
        max-height: 0;
        transition: max-height linear .3s;
    }
    .p.active {
        max-height: 1000px;
    }
 ```

 ### CSS动画与js动画对比
 - CSS动画性能更优，可进行浏览器硬件加速，但动画控制不够灵活、兼容性不够，更适合进行预知轨迹的、简单的过渡动画效果
 - js动画控制更灵活，兼容性强，但性能相较略低，更适合进行复杂的、具有动态交互的动画效果

 ### 样式抖动产生的原因以及处理方式
 - 原因：
    - 因内容变化产生的元素空间变化从而导致样式抖动
 - 解决方式：
    - 固定元素宽高

### 什么是重排、什么是重绘
- 内容渲染过程中元素的几何属性发生变化就会产生重排，从而导致其父元素以及后续元素进行重排，性能消耗大；
- 而内容渲染过程中样式发生变化但几何属性未发生变化则产生重绘，并不会导致其他元素触发重排，性能消耗相对较小；

### 如何进行多主题配置
- 定义样式表
- 通过js控制实现样式表的切换

### 首行缩进实现
- text-indent


### 多行超出省略号
```
oveflow:hidden;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
```

### 块级格式化上下文（BFC）
- 定义：页面布局过程中产生的块级盒子区域，且区域内元素不受外界元素影响。
- 创建：
    - 根元素
    - 浮动元素
    - 设置position为absolute或fixed，脱离文档流
    - 设置display为inline-block、flex、inline-flex、table、table-cell等
    - 设置overflow不为visible
- 特点：
    - 独立的容器，内部元素不受外界元素影响
    - BFC内浮动元素参与容器高度计算
    - 相邻BFC元素垂直方向距离由margin决定，margin不做重叠
    - 同一个BFC内，垂直方向元素margin会产生重叠，距离由大的margin决定
    - BFC不会和浮动元素重叠
- 作用：
    - 解决高度崩塌问题，清除浮动

### 清楚浮动的方式
- 在浮动元素后添加元素，并设置clear:both 以清除浮动
- 在浮动元素后设置伪元素，并设置clear:both 以清除浮动
- 将所在父元素转为BFC

### position的值
- static 无定位，即top、left、bottom、right无效果
- relative 相对布局
- absolute 绝对布局，脱离文档流，定位相对于最近的非static父元素
- fixed 浮动布局，脱离文档流，定位相对于视口的左上角
- sticky 粘连布局，relative与fixed的结合

### 使用样式预处理的优缺
- 优点：
    - 实现css的模块化管理，便于样式的维护、扩展，且提升整体复用性
    - 提升css的编程能力，例如嵌套、条件、函数、变量等
    - 自动化添加语法前缀，提升浏览器的兼容性
- 缺点：
    - 增加代码复杂度
    - 需要编译或增加额外的解析函数
    - 调试成本增加

### link与import区别
- link是html标签，import为css3语法
- link不存在兼容性问题，而import存在，且link的执行在import之前

### 前端自适应的实现方案
- flexible
- postcss-px2rem

