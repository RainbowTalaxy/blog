---
tags:
  - css
---

# Z-index 和堆叠上下文

## 三维坐标系

横轴是 X 轴，纵轴是 Y 轴，除此还有垂直于页面的 Z 轴。

可以用 `z-index` 属性设置元素在 Z 轴上的位置，大的在上，可以为负数。

> 有的时候如果 `z-index` 不生效，大部分情况是因为你的 `position` 属性依然为 `static` ，你可以设置为 `relative` ，但是在 flexbox 和 grid 中不需要对物品设置这一属性。

## 堆叠上下文

`z-index` 默认值为 `auto` ，这代表和其父元素的堆叠层级相同。如果一个父元素设置了`z-index` 为一个整数，则会创建一个堆叠上下文，其子元素将永远在父元素的前面，且所有子元素的 `z-index` 仅限于父元素下比较。

> 更多关于如何创建一个堆叠上下文的条件，可以见 [层叠上下文 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) 。

---

### 参考

[Z-index and stacking contexts，Learn CSS - web.dev](https://web.dev/learn/css/z-index/)

[z-index - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index)

[层叠上下文 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)

[Layers and how to force them，Surma - surma.dev](https://surma.dev/things/forcing-layers/)

[Understanding Z-Index in CSS，Ahmad Shadeed - ishadeed](https://ishadeed.com/article/understanding-z-index/)