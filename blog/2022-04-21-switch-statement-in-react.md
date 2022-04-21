---
title: 在 React 组件中写 switch 语句
authors: RainbowTalaxy
---

如何优雅地在 React 组件中编写 switch 语句。

<!--truncate-->

## 内嵌渲染函数

Stack Overflow 高赞写法：

```jsx
const renderSwitchCases = (value) => {
    switch (value) {
        case Case.One:
            return <div>Case One</div>;
        case Case.Two:
            return <div>Case Two</div>;
        default:
            return <div>other cases</div>;
    }
};

const Component = ({ value }) => {
    return (
        <div>
            <div>...</div>
            {renderSwitchCases(value)}
            <div>...</div>
        </div>
    );
};
```

或者通过 `useCallback` 放在组件内部：

```jsx
const Component = ({ value }) => {
    // value 写在参数里，而不是直接在函数中使用
    const renderSwitchCases = useCallback((value) => {
        switch (value) {
            case Case.One:
                return <div>Case One</div>;
            case Case.Two:
                return <div>Case Two</div>;
            default:
                return <div>other cases</div>;
        }
    }, []);

    return (
        <div>
            <div>...</div>
            {renderSwitchCases(value)}
            <div>...</div>
        </div>
    );
};
```

## 平铺为条件语句

```jsx
const Component = ({ value }) => {
    return (
        <div>
            <div>...</div>
            {value === Case.One && <div>Case One</div>}
            {value === Case.Two && <div>Case Two</div>}
            {(value === Case.Three || value === Case.Four) && (
                <div>Case Three or Four</div>
            )}
            {[Case.Five, Case.Six, Case.Seven].includes(value) && (
                <div>Case Five, Six, or Seven</div>
            )}
            {/* other cases */}
            <div>...</div>
        </div>
    );
};
```

上面的写法有个缺点，即无法为 `default` 情况定义组件。可以用复杂一点的条件语句解决这个问题：

```
const Component = ({ value }) => {
    return (
        <div>
            <div>...</div>
            {
                (value === Case.One && <div>Case One</div>)
            ||  (value === Case.Two && <div>Case Two</div>)
            ||  (value === Case.Three && <div>Case Three</div>)
            ||  (<div>other cases</div>)
            }
            <div>...</div>
        </div>
    );
};
```

## 还有一些...

还有一些有趣的写法，但是可能都不利于性能。

### 自己写一个 Switch 组件

这种写法既导致了所有情况的组件都被加载，又较难实现 `default` 情况：

```jsx
const Switch = ({ value, children }) => {
    return children.find((child) => {
        return child.props.value === test;
    });
};

const Component = ({ value }) => {
    return (
        <div>
            <div>...</div>
            <Switch value={value}>
                <div value={Case.One}>Case One</div>
                <div value={Case.Two}>Case Two</div>
                <div value={Case.Three}>Case Three</div>
            </Switch>
            <div>...</div>
        </div>
    );
};
```

### 使用字典

这种写法同样会导致所有情况的组件都被加载：

```jsx
const Component = ({ value }) => {
    return (
        <div>
            <div>...</div>
            {{
                [Case.One]: <div>Case One</div>,
                [Case.Two]: <div>Case Two</div>,
                [Case.Three]: <div>Case Three</div>,
            }[value] || <div>other Cases</div>}
            <div>...</div>
        </div>
    );
};
```

## 参考

[How to use switch statement inside a React component? - Stack Overflow](https://stackoverflow.com/questions/46592833/how-to-use-switch-statement-inside-a-react-component)
