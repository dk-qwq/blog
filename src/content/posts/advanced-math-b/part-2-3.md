---
title: 高数B（下）- 3
published: 2026-09-02
description: ''
image: ''
tags: [数学, 高数]
category: '高数'
draft: false    
lang: ''
---

## 常见级数及其敛散性

### 等比级数

$$
\sum_{n=0}^{\infty} ar^n = a + ar + ar^2 + \cdots
$$

- $|r| < 1$ 时收敛，和为 $\dfrac{a}{1-r}$；$|r| \geq 1$ 时发散。


### 调和级数

$$
\sum_{n=1}^{\infty} \frac{1}{n} = 1 + \frac{1}{2} + \frac{1}{3} + \cdots
$$

- 发散

### $p$ 级数

$$
\sum_{n=1}^{\infty} \frac{1}{n^p}
$$

- 当 $p > 1$ 时收敛，当 $p \leq 1$ 时发散。

## 收敛的基本准则

### 收敛必要条件

若级数 $\sum a_n$ 收敛，则 $\lim_{n \to \infty} a_n = 0$。

### 柯西收敛准则

级数 $\sum_{n=1}^{\infty} u_n$ 收敛的充分必要条件为：$\forall \varepsilon > 0$，总存在自然数 $N$，使得当 $n > N$ 时，对于任意的自然数 $p$，都有

$$
|u_{n+1} + u_{n+2} + \cdots + u_{n+p}| < \varepsilon
$$

成立。

## 正项级数判别法

### 极限比较判别法

设 $\sum_{n=1}^\infty u_n$ 和 $\sum_{n=1}^\infty v_n$ 都是正项级数，且

$$
\lim_{n \to \infty} \frac{u_n}{v_n} = k \quad (0 \leqslant k \leqslant +\infty, v_n \ne 0),
$$

则

1. 若 $0 < k < +\infty$，则级数 $\sum_{n=1}^\infty u_n$ 与 $\sum_{n=1}^\infty v_n$ 同时收敛或同时发散；

2. 若 $k = 0$，则当 $\sum_{n=1}^\infty v_n$ 收敛时，$\sum_{n=1}^\infty u_n$ 收敛；

3. 若 $k = +\infty$，则当 $\sum_{n=1}^\infty v_n$ 发散时，$\sum_{n=1}^\infty u_n$ 发散。

### 比值判别法

若对正项级数 $\sum\limits_{n=1}^\infty u_n$ 有

$$
\lim_{n \to \infty} \frac{u_{n+1}}{u_n} = \rho,
$$

则

1. 当 $\rho < 1$ 时，级数收敛；

2. 当 $\rho > 1 \left( \text{或} \lim\limits_{n \to \infty} \dfrac{u_{n+1}}{u_n} = +\infty \right)$ 时，级数发散；

3. 当 $\rho = 1$ 时，级数可能收敛，也可能发散。

### 根值判别法

若对正项级数 $\sum\limits_{n=1}^\infty u_n$ 有

$$
\lim_{n \to \infty} \sqrt[n]{u_n} = \rho,
$$

则

1. 当 $\rho < 1$ 时，级数收敛；

2. 当 $\rho > 1 \left( \text{或} \lim\limits_{n \to \infty} \sqrt[n]{u_n} = +\infty \right)$ 时，级数发散；

3. 当 $\rho = 1$ 时，级数可能收敛，也可能发散。

### 积分判别法

设 $f(x)$ 为定义在 $[1, +\infty)$ 上的非负单调递减函数，那么正项级数 $\sum\limits_{n=1}^\infty f(n)$ 与反常积分 $\int_1^{+\infty} f(x) \, \mathrm{d}x$ 具有相同的敛散性。

## 交错级数与任意项级数

### Leibniz's rule

设 $u_n > 0\ (n = 1, 2, 3, \cdots)$，如果交错级数 $\sum\limits_{n=1}^\infty (-1)^{n-1} u_n$ 满足条件：

1. $u_n \geqslant u_{n+1} \quad (n = 1, 2, 3, \cdots)$；

2. $\lim\limits_{n \to \infty} u_n = 0$，

则交错级数收敛，且其和 $s \leqslant u_1$，其余项 $r_n$ 的绝对值 $|r_n| \leqslant u_{n+1}$。

### 绝对收敛与条件收敛

如果级数 $\sum\limits_{n=1}^\infty |u_n|$ 收敛，则称级数 $\sum\limits_{n=1}^\infty u_n$ 绝对收敛；如果级数 $\sum\limits_{n=1}^\infty u_n$ 收敛，而级数 $\sum\limits_{n=1}^\infty |u_n|$ 发散，则称级数 $\sum\limits_{n=1}^\infty u_n$ 条件收敛。

如果级数 $\sum\limits_{n=1}^\infty |u_n|$ 收敛，则级数 $\sum\limits_{n=1}^\infty u_n$ 必定收敛。

## 柯西乘积

设级数 $\sum\limits_{n=1}^\infty u_n$ 和 $\sum\limits_{n=1}^\infty v_n$ 都绝对收敛，其和分别为 $u$ 和 $v$，则它们的柯西乘积

$$
u_1 v_1 + (u_1 v_2 + u_2 v_1) + \cdots + (u_1 v_n + u_2 v_{n-1} + \cdots + u_n v_1) + \cdots
$$

也是绝对收敛的，且其和为 $uv$。

## 幂级数

### 阿贝尔定理（收敛域性质）

若幂级数 $\sum\limits_{n=0}^\infty a_n x^n$ 在 $x = x_0\ (x_0 \ne 0)$ 处收敛，则对满足 $|x| < |x_0|$ 的一切 $x$，该级数绝对收敛；反之，若级数 $\sum\limits_{n=0}^\infty a_n x^n$ 在 $x = x_0$ 处发散，则对满足 $|x| > |x_0|$ 的一切 $x$，该级数也发散。

### 收敛半径计算

若 $\lim\limits_{n \to \infty} \left| \dfrac{a_{n+1}}{a_n} \right| = \rho$，则幂级数 $\sum\limits_{n=0}^\infty a_n x^n$ 的收敛半径

$$
R = \begin{cases}
\dfrac{1}{\rho}, & \rho \ne 0, \\[2ex]
+\infty, & \rho = 0, \\[1.5ex]
0, & \rho = +\infty.
\end{cases}
$$

### 和函数的分析性质

设幂级数 $\sum\limits_{n=0}^\infty a_n x^n$ 在收敛区间 $(-R, R)$ 上的和函数为 $s(x)$，若 $x$ 为 $(-R, R)$ 内任意一点，则

1. $s(x)$ 在 $x$ 可导，且
    $$
    s'(x) = \sum_{n=1}^\infty n a_n x^{n-1};
    $$

2. $s(x)$ 在 $0$ 与 $x$ 构成的区间上可积，且
    $$
    \int_0^x s(t) \, \mathrm{d}t = \sum_{n=0}^\infty \frac{a_n}{n + 1} x^{n+1}.
    $$

## 常用函数展开

1. 指数函数
    $$
    e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots \quad (-\infty < x < +\infty)
    $$

2. 正弦函数
    $$
    \sin x = \sum_{n=0}^{\infty} \frac{(-1)^n}{(2n+1)!} x^{2n+1} = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots \quad (-\infty < x < +\infty)
    $$

3. 余弦函数
    $$
    \cos x = \sum_{n=0}^{\infty} \frac{(-1)^n}{(2n)!} x^{2n} = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots \quad (-\infty < x < +\infty)
    $$

4. 对数函数
    $$
    \ln(1+x) = \sum_{n=1}^{\infty} \frac{(-1)^{n-1}}{n} x^n = x - \frac{x^2}{2} + \frac{x^3}{3} - \cdots \quad (-1 < x \leqslant 1)
    $$

5. 几何级数
    $$
    \frac{1}{1-x} = \sum_{n=0}^{\infty} x^n = 1 + x + x^2 + x^3 + \cdots \quad (-1 < x < 1)
    $$

6. 二项式展开
    $$
    (1+x)^\alpha = 1 + \alpha x + \frac{\alpha(\alpha-1)}{2!}x^2 + \cdots + \frac{\alpha(\alpha-1)\cdots(\alpha-n+1)}{n!}x^n + \cdots \quad (-1 < x < 1)
    $$