---
title: 如何在 React 组件中编写 switch 语句
authors: RainbowTalaxy
---

如何优雅地在 React 组件中编写 switch 语句。

<!--truncate-->

## 内嵌渲染函数

Stack Overflow 高赞写法：

```js
const renderSwitchCases = (value) => {
    switch (value) {
        case Case.One:
            return <div>Case One</div>;
        case Case.Two:
            return <div>Case Two</div>;
        default:
            return <div>...</div>;
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

```js
const Component = ({ value }) => {
    const renderSwitchCases = useCallback((value) => {
        switch (value) {
            case Case.One:
                return <div>Case One</div>;
            case Case.Two:
                return <div>Case Two</div>;
            default:
                return <div>...</div>;
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

```js
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
            ||  (<div>Default case</div>)
            }
            <div>...</div>
        </div>
    );
};
```

https://stackoverflow.com/questions/46592833/how-to-use-switch-statement-inside-a-react-component
