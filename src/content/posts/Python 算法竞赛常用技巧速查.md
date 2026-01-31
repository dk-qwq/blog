---
title: Python 算法竞赛常用技巧速查
published: 2026-02-01
description: '随机与数据生成、格式化输出、效率与精度'
image: ''
tags: [Python, OI]
category: 'OI'
draft: false 
lang: ''
---

## 对拍板子

```python
import os

os.system("g++ -std=c++23 std.cpp -o std.exe")
os.system("g++ -std=c++23 A.cpp -o A.exe")

kase = 0
while True:
  os.system("python gen.py > A.in")
  os.system("type A.in | std.exe > A.ans")
  os.system("type A.in | A.exe > A.out")
  if os.system("fc A.ans A.out > nul") != 0:
    print("Wrong Answer on Case:", kase)
    break

  if kase % 100 == 0:
    print(kase, "pass !!!")

  kase = kase + 1
```

## 数据生成

```python
import random

random.randint(l, r)
random.choice(list)    # 随机选一个
random.sample(list, k) # 随机不重复选k个
random.shuffle(list)
```

## 全排列

```python
import itertools
def generate_permutations(n):
  return itertools.permutations(range(1, n + 1))

for p in generate_permutations(n):
  v = list(p)
  if check(v):
    print(' '.join(map(str, p)))
```

## pow(x, k)

python中可以直接使用 `pow(x, k)` / `pow(x, k, mod)` ，不需要导入任何库

## 二分

* `bisect_left(a, x)`：在**有序数组** `a` 中找第一个 `>= x` 的位置

```python
from bisect import bisect_left

i = bisect_left(a, x)
```


## 浮点数格式化输出

```python
print('%.4f' % a)  # 保留 4 位小数，四舍五入
```

`'%.4f' % a` **等价写法**

* `format(a, '.4f')`
* `f'{a:.4f}'`

## float 无穷大

* 正无穷：`float('inf')`
* 负无穷：`float('-inf')`
* Python 中可参与比较、加减（但注意精度问题）


