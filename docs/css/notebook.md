# 记事本

## 最简单的进度条动画

```less
@keyframes progress {
    from {
        background-size: 0;
    }
    to {
        background-size: 100%;
    }
}

width: 400px;
height: 16px;
border-radius: 8px;
border: 1px solid #000;
background: linear-gradient(#21ba9b, #21ba9b) left/0 no-repeat;
animation: 2s ease-in-out 1s forwards progress;
```
