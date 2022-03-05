---
tags:
  - css
---

# Box 模型

​​CSS 所有东西都是基于盒子（ box ）的。

## 内部大小调整 & 外部大小调整

可以用基本的 [外部大小调整 - Extrinsic sizing](https://www.w3.org/TR/css-sizing-3/#extrinsic) 来实现盒子的大小设置。也可以使用 [内部大小调整 - Intrinsic sizing](https://www.w3.org/TR/css-sizing-3/#intrinsic) ，即让浏览器根据盒子内容决定大小，不容易发生溢出。内部大小调整有很大的灵活性。

​`width: min-content` 允许内部 box 按内容设定 width 。

## 盒子模型组成

由外到内为：

1. Margin 外边距

2. Border 边框

3. Padding 内边距

4. Content 内容

### Padding box 内边距

内边距是在盒子内部，所以内边距会显示盒子的 `background` 。

如果设置了 `overflow: auto` 或 `overflow: scroll` ，滚动条也会占据这片空间。

内边距的粗细可以由 `padding-top`、`padding-right`、`padding-bottom`、`padding-left`，或简写属性 `padding` 控制。

### Border box 边框

边框的粗细由 `border-width` 或简写的 `border` 属性控制。

### Margin box 外边距

盒子外的空间，由 `margin` 值决定。`outline` 和 `box-shadow` 等属性会占用这部分空间，同时盒子的大小是不会受到这些属性影响的。

外边距区域的大小由 `margin-top`、`margin-right`、`margin-bottom`、`margin-left`，或简写属性 `margin` 控制。在发生外边距合并的情况下，由于盒子之间存在共享外边距，实际外边距不容易弄清楚。

> ​​除可替换元素外，对于行内元素来说，尽管内容周围存在内边距与边框，但其占用空间（每一行文字的高度）则由 `line-height` 属性决定，即使边框和内边距仍会显示在内容周围。

### `box-sizing`

​​`box-sizing` 属性会告诉盒子如何计算盒子大小。

默认为 `box-sizing: content-box` ，它代表 `width` 和 `height` 会被应用在内容大小上，同时 `padding` 和 `border` 会计算在元素大小上。

如果设定为 `border-box` ，则 `width` 值会包含 `border` 和 `padding` 。

> 块的上 `margin-top` 和 `margin-bottom` 有时合并为单个边距，其大小为单个外边距的最大值，这种行为称为 [外边距重叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing) 。
> 
> 设定 `float` 和 `position: absolute` 的元素不会产生外边距重叠行为。

---

### 参考

[Box Model，Learn CSS - web.dev](https://web.dev/learn/css/box-model)

[CSS的inline、block与inline-block，GISChen - SegmentFault](https://segmentfault.com/a/1190000015202771)

[CSS 基础框盒模型介绍 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)

[外边距重叠 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)
