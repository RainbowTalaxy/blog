# if 语句

## 布尔表达式

布尔值有 True 和 False 两种，可以用来判断条件是否成立，或者单纯记录条件：

```python
is_active = True
```

### 判等

可以用 `==` 或 `!=` 来判断字符串或数字等值之间是否相等：

```python
car = 'Audi'
car.lower() == 'audi'   # => True
car != 'Audi'           # => False
```

### 检查多个条件

可以用 and 或 or 关键字检查多个条件：

```python
age_0, age_1 = 18, 21
age_0 >= 21 and age_1 >= 21     # => False
age_0 >= 21 or age_1 >= 21      # => True
```

### 列表检查

可以用 `in` 或 `not in` 来检查列表中是否包含某个值：

```python
fruits = ['apple', 'banana', 'orange', 'pear']
'apple' in fruits      # => True
'peach' not in fruits  # => True
```

列表直接当作 if 语句的条件，当列表为空时，条件为 False：

```python
fruits = []
if fruits:
    print('fruits is not empty')
else:
    print('fruits is empty')    # => fruits is empty
```

## if 语句

if 语句有很多种，最简单的：

```python
if 条件:
    # 条件成立时执行的代码
```

if-else 语句：

```python
if 条件:
    # 条件成立时执行的代码
else:
    # 条件不成立时执行的代码
```

if-elif-else 语句：

```python
if 条件:
    # 条件成立时执行的代码
elif 条件:
    # 条件成立时执行的代码
else:
    # 条件不成立时执行的代码
```

elif 可以有多个，同时 else 也是可选的。
