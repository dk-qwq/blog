---
title: 高数B - 常用积分表及 trick
published: 2026-09-02
description: ''
image: ''
tags: [数学, 高数]
category: '高数'
draft: false 
lang: ''
---

:::CAUTION
这部分内容大量使用 ai 完成，只验证了部分内容
:::

## 一、 常用基本积分表

> **说明**：以下不定积分公式均已默认省略任意常数 $+ C$。

### 1. 幂函数与有理分式

| 序号 | 被积函数 $f(x)$ | 不定积分 $\int f(x)\,\mathrm{d}x$ | 补充说明 |
| :---: | :--- | :--- | :--- |
| 1 | $x^a$ | $\dfrac{1}{a+1}x^{a+1}$ | $a \neq -1$ |
| 2 | $\dfrac{1}{x}$ | $\ln\lvert x \rvert$ | $x \neq 0$ |
| 3 | $\dfrac{1}{a^2 + x^2}$ | $\dfrac{1}{a}\arctan\left(\dfrac{x}{a}\right)$ | $a > 0$ |
| 4 | $\dfrac{1}{x^2 - a^2}$ | $\dfrac{1}{2a}\ln\left\lvert\dfrac{x-a}{x+a}\right\rvert$ | 裂项积分常用 |
| 5 | $\dfrac{1}{a^2 - x^2}$ | $\dfrac{1}{2a}\ln\left\lvert\dfrac{a+x}{a-x}\right\rvert$ | 注意正负号区分 |
| 6 | $\dfrac{x}{a^2 \pm x^2}$ | $\pm \dfrac{1}{2}\ln\lvert a^2 \pm x^2 \rvert$ | 凑微分法 $x\,\mathrm{d}x = \frac{1}{2}\mathrm{d}(x^2)$ |

---

### 2. 含有二次根式的无理函数

| 序号 | 被积函数 $f(x)$ | 不定积分 $\int f(x)\,\mathrm{d}x$ | 常用换元思路 |
| :---: | :--- | :--- | :--- |
| 1 | $\dfrac{1}{\sqrt{a^2 - x^2}}$ | $\arcsin\left(\dfrac{x}{a}\right)$ | 令 $x = a\sin\theta$ |
| 2 | $\dfrac{1}{\sqrt{x^2 + a^2}}$ | $\ln\left(x + \sqrt{x^2 + a^2}\right)$ | 令 $x = a\tan\theta$ 或双曲代换 |
| 3 | $\dfrac{1}{\sqrt{x^2 - a^2}}$ | $\ln\left\lvert x + \sqrt{x^2 - a^2}\right\rvert$ | 令 $x = a\sec\theta$ |
| 4 | $\sqrt{a^2 - x^2}$ | $\dfrac{x}{2}\sqrt{a^2 - x^2} + \dfrac{a^2}{2}\arcsin\left(\dfrac{x}{a}\right)$ | 几何意义为圆的扇形与三角形面积 |
| 5 | $\sqrt{x^2 \pm a^2}$ | $\dfrac{x}{2}\sqrt{x^2 \pm a^2} \pm \dfrac{a^2}{2}\ln\left\lvert x + \sqrt{x^2 \pm a^2}\right\rvert$ | 分部积分法推导 |

---

### 3. 三角函数与反三角函数

| 序号 | 被积函数 $f(x)$ | 不定积分 $\int f(x)\,\mathrm{d}x$ | 等价形式 / 技巧 |
| :---: | :--- | :--- | :--- |
| 1 | $\sin x$ | $-\cos x$ | 基础公式 |
| 2 | $\cos x$ | $\sin x$ | 基础公式 |
| 3 | $\tan x$ | $-\ln\lvert\cos x\rvert = \ln\lvert\sec x\rvert$ | 凑微分 $\frac{\sin x}{\cos x}$ |
| 4 | $\cot x$ | $\ln\lvert\sin x\rvert$ | 凑微分 $\frac{\cos x}{\sin x}$ |
| 5 | $\sec x$ | $\ln\lvert\sec x + \tan x\rvert$ | 等价于 $\ln\left\lvert\tan\left(\frac{x}{2} + \frac{\pi}{4}\right)\right\rvert$ |
| 6 | $\csc x$ | $\ln\lvert\csc x - \cot x\rvert$ | 等价于 $\ln\left\lvert\tan\left(\frac{x}{2}\right)\right\rvert$ |
| 7 | $\sec^2 x$ | $\tan x$ | 基础导数逆运算 |
| 8 | $\csc^2 x$ | $-\cot x$ | 基础导数逆运算 |
| 9 | $\sec x \tan x$ | $\sec x$ | 基础导数逆运算 |
| 10 | $\csc x \cot x$ | $-\csc x$ | 基础导数逆运算 |
| 11 | $\sec^3 x$ | $\dfrac{1}{2}\sec x \tan x + \dfrac{1}{2}\ln\lvert\sec x + \tan x\rvert$ | 分部积分经典循环项 |
| 12 | $\arcsin x$ | $x\arcsin x + \sqrt{1 - x^2}$ | 分部积分法 |
| 13 | $\arctan x$ | $x\arctan x - \dfrac{1}{2}\ln(1 + x^2)$ | 分部积分法 |

---

### 4. 指数与对数函数

| 序号 | 被积函数 $f(x)$ | 不定积分 $\int f(x)\,\mathrm{d}x$ | 备注 |
| :---: | :--- | :--- | :--- |
| 1 | $e^x$ | $e^x$ | 自然指数 |
| 2 | $a^x$ | $\dfrac{a^x}{\ln a}$ | $a > 0, a \neq 1$ |
| 3 | $\ln x$ | $x\ln x - x$ | 分部积分：$\int \ln x\,\mathrm{d}x = x\ln x - \int x\cdot\frac{1}{x}\,\mathrm{d}x$ |
| 4 | $x e^{ax}$ | $\dfrac{e^{ax}}{a^2}(ax - 1)$ | 表格分部积分典型算例 |

---

### 5. 常用定积分速算公式（Wallis / 点火公式）

设 $I_n = \int_0^{\pi/2} \sin^n x\,\mathrm{d}x = \int_0^{\pi/2} \cos^n x\,\mathrm{d}x$：

$$
I_n = \begin{cases}
\dfrac{n-1}{n} \cdot \dfrac{n-3}{n-2} \cdots \dfrac{1}{2} \cdot \dfrac{\pi}{2}, & n \text{ 为正偶数} \\[2ex]
\dfrac{n-1}{n} \cdot \dfrac{n-3}{n-2} \cdots \dfrac{2}{3} \cdot 1, & n \text{ 为大于 1 的奇数}
\end{cases}
$$

**对称区间推广**：
* $\int_0^{\pi} \sin^n x\,\mathrm{d}x = 2 I_n$
* $\int_0^{2\pi} \lvert\sin^n x\rvert\,\mathrm{d}x = 4 I_n$

---

## 二、 常用积分技巧（Tricks）

### 1. 三角代换（Trig Substitution）
遇到二次根式时消去根号的设定：
* **$\sqrt{a^2 - x^2}$**：令 $x = a\sin\theta$（利用 $1 - \sin^2\theta = \cos^2\theta$）
* **$\sqrt{a^2 + x^2}$**：令 $x = a\tan\theta$（利用 $1 + \tan^2\theta = \sec^2\theta$）
* **$\sqrt{x^2 - a^2}$**：令 $x = a\sec\theta$（利用 $\sec^2\theta - 1 = \tan^2\theta$）

---

### 2. 倒代换（Reciprocal Substitution）
* **适用场景**：分母次数明显高于分子，或根号外部含有 $x^k$ 高次项（例如 $\int \frac{\mathrm{d}x}{x^4\sqrt{1+x^2}}$）。
* **操作**：令 $x = \dfrac{1}{t}$，则 $\mathrm{d}x = -\dfrac{1}{t^2}\,\mathrm{d}t$。可将根式内部的 $x$ 提至分子，大幅降低分母次数。

---

### 3. 区间反折法（King's Property）
定积分极强性质，基于变量代换 $x \to a + b - x$：
$$
I = \int_a^b f(x)\,\mathrm{d}x = \int_a^b f(a + b - x)\,\mathrm{d}x
$$
两式相加：
$$
2I = \int_a^b \Big[ f(x) + f(a + b - x) \Big]\,\mathrm{d}x
$$
* **经典对称模型**：
  $$
  \int_a^b \frac{g(x)}{g(x) + g(a+b-x)}\,\mathrm{d}x = \frac{b - a}{2}
  $$
* **奇偶化简推论**：
  $$
  \int_0^\pi x f(\sin x)\,\mathrm{d}x = \frac{\pi}{2} \int_0^\pi f(\sin x)\,\mathrm{d}x
  $$

---

### 4. 表格分部积分法（Tabular Integration）
适用于 $\int P(x) g(x)\,\mathrm{d}x$，其中 $P(x)$ 为多项式，$g(x)$ 为易于连续积分的函数（如 $e^{ax}, \sin ax, \cos ax$）：

| 符号 | 对 $P(x)$ 连续求导 (D) | 对 $g(x)$ 连续积分 (I) |
| :---: | :--- | :--- |
| $+$ | $P(x)$ | $g(x)$ |
| $-$ | $P'(x)$ | $\int g(x)\,\mathrm{d}x$ |
| $+$ | $P''(x)$ | $\iint g(x)\,\mathrm{d}x^2$ |
| $\dots$ | $\dots$ 直至导数为 0 | $\dots$ |

* **求和规则**：沿对角线交叉相乘（$\text{符号} \times D_k \times I_{k+1}$）求和即可直接得出结果，省去繁琐的多步书写。

---

### 5. 配对系统法（Pairing Trick）
当单个积分难以独立求解时，构造对称伴随积分联立求解：

* **例**：求 $I = \int \frac{\sin x}{\sin x + \cos x}\,\mathrm{d}x$ 与 $J = \int \frac{\cos x}{\sin x + \cos x}\,\mathrm{d}x$：
  $$
  \begin{cases}
  I + J = \int 1\,\mathrm{d}x = x + C_1 \\[1.5ex]
  J - I = \int \frac{\cos x - \sin x}{\sin x + \cos x}\,\mathrm{d}x = \ln\lvert\sin x + \cos x\rvert + C_2
  \end{cases}
  $$
  联立相加减即可直接解出 $I$ 与 $J$。

---

### 6. 万能代换与对称简化（Weierstrass Substitution）
* **标准万能代换**：
  令 $t = \tan\left(\dfrac{x}{2}\right)$，则：
  $$
  \sin x = \frac{2t}{1 + t^2}, \quad \cos x = \frac{1 - t^2}{1 + t^2}, \quad \mathrm{d}x = \frac{2}{1 + t^2}\,\mathrm{d}t
  $$
* **降次优化**：若被积函数满足 $R(-\sin x, -\cos x) = R(\sin x, \cos x)$（偶次同号），改用 **$t = \tan x$** 可直接省去半角降次过程：
  $$
  \sin^2 x = \frac{t^2}{1 + t^2}, \quad \cos^2 x = \frac{1}{1 + t^2}, \quad \mathrm{d}x = \frac{\mathrm{d}t}{1 + t^2}
  $$

---

### 7. 遮蔽法（Heaviside Cover-up Method）
用于真分式部分分式分解时的系数秒杀。对于无重根分母：
$$
\frac{P(x)}{(x - x_1)(x - x_2)\cdots(x - x_k)} = \frac{A_1}{x - x_1} + \frac{A_2}{x - x_2} + \dots + \frac{A_k}{x - x_k}
$$
求系数 $A_i$ 时，在原式左侧**遮住因子 $(x - x_i)$**，其余项代入 $x = x_i$：
$$
A_i = \lim_{x \to x_i} \frac{P(x)}{\prod_{j \neq i}(x - x_j)}
$$

---

### 8. 费曼积分法（含参变量积分号下求导）
处理带有阻碍项（如分母有 $x$）的定积分：

1. **引入参数**：构造含参积分 $I(\alpha) = \int_a^b f(x, \alpha)\,\mathrm{d}x$。
2. **求导消项**：
   $$
   I'(\alpha) = \int_a^b \frac{\partial}{\partial \alpha} f(x, \alpha)\,\mathrm{d}x
   $$
   利用对参数 $\alpha$ 求导对消分母中的奇异项 $x$。
3. **完成求积**：求出 $I'(\alpha)$ 的初等表达式。
4. **积分还原**：对 $\alpha$ 积分得到 $I(\alpha) + C$，代入初值 $\alpha_0$ 确定积分常数。

## 复指数函数求解含三角函数的积分

### 基本原理

实部 $\Re$ 和虚部 $\Im$ 算子是**实线性映射**。要让求虚部与积分交换次序，即：

$$
\int_a^b \Im\big(f(x)\big) \, dx = \Im\left(\int_a^b f(x) \, dx\right)
$$

本质上是**线性算子与积分（极限）能否交换次序**的问题。满足以下任一条件即可：

* **有限区间上的常规黎曼积分**：
只要复值函数 $f(x) = u(x) + i v(x)$ 在有界闭区间 $[a, b]$ 上黎曼可积，其本质定义就是：

$$
\int_a^b f(x) \, dx = \int_a^b u(x) \, dx + i \int_a^b v(x) \, dx
$$



根据定义，直接恒等成立。
* **无穷区间或瑕积分（反常积分）**：
因为反常积分本质是取极限（如 $\lim_{A \to \infty} \int_0^A$），若复积分 $\int_a^\infty f(x) \, dx$ **收敛**（最稳妥的是**绝对收敛**，即 $\int_a^\infty \vert{}f(x)\vert{} \, dx < \infty$），则极限与连续映射 $\Im$ 可以交换：

$$
\int_a^\infty \Im(f) \, dx = \lim_{A \to \infty} \int_a^A \Im(f) \, dx = \lim_{A \to \infty} \Im\left(\int_a^A f \, dx\right) = \Im\left(\lim_{A \to \infty}\int_a^A f \, dx\right) = \Im\left(\int_a^\infty f \, dx\right)
$$


* **测度论与勒贝格积分视角**：
若 $f \in L^1([a, \infty))$（即模长勒贝格可积），直接由勒贝格积分对实部、虚部分解的线性定义即可交换。

**反例（不可直接交换的情况）**：

若复积分本身**发散**，或者虚部、实部的反常积分仅在**柯西主值**意义下存在，极限不满足收敛性条件时不可随意交换。例如当 $\alpha \le 0$ 时，$\int_0^\infty e^{(i-\alpha)x} dx$ 发散，此步骤不再成立。

### 例题

设实数 $\alpha > 0$，计算积分：

$$
I = \int_0^{\infty} \sin x e^{- \alpha x}\,\mathrm{d} x
$$

利用欧拉公式 $sin x = \Im \left( e^{ix} \right)$（$\Im$ 表示取复数的虚部）：

$$
\begin{align*}
I = \int_0^{\infty} \sin x e^{- \alpha x}\,\mathrm{d} x
= \int_0^{\infty} \Im(e^{ix}) e^{- \alpha x}\,\mathrm{d} x
\end{align*}
$$

- $\Im$ 的含义：表示取复数的虚部（$\text{Im}$，LaTeX 中记作 \Im）。

由于虚部运算与对实变量 $x$ 的积分可交换次序（假设实数 $\alpha > 0$）：

$$
I = \Im \left( \int_0^{\infty} e^{(i - \alpha)x}\,\mathrm{d} x \right) = \Im \left( \left[ \frac {e^{(i - \alpha)x}} {i - \alpha} \right]_{x = 0}^{\infty} \right)
$$

计算积分

$$
\begin{align*}
\left[ \frac {e^{(i - \alpha)x}} {i - \alpha} \right]_{x = 0}^{\infty} 
&= \lim_{x \to \infty} \frac {e ^ {ix} e ^ {- \alpha x} } {i - \alpha} - \frac {e^{(i - \alpha) \cdot 0}} {i - \alpha} \\
&= 0 - \frac {1} {i - \alpha} = -\frac {1} {i - \alpha}    
\end{align*}
$$

$$
I = \Im \left( \frac 1 {\alpha - i} \right) = \Im \left( \frac {\alpha + i} {\alpha^2 + 1} \right) = \frac{1}{\alpha^2 + 1}
$$

## 费曼积分法

### 莱布尼茨积分法则

$$
F(x, a(x), b(x)) = \int_{a(x)}^{b(x)} f(t, x)\,\mathrm{d}t
$$

$$
\begin{aligned} \frac{d}{dx} F(x, a(x), b(x)) 
&= \left( \frac{\partial F}{\partial b} \right) \frac{db}{dx} + \left( \frac{\partial F}{\partial a} \right) \frac{da}{dx} + \frac{\partial F}{\partial x} \\ 
&= f(x, b(x)) b'(x) - f(x, a(x)) a'(x) + \int_{a(x)}^{b(x)} \frac{\partial}{\partial x} f(x, t) \, dt \end{aligned}
$$

若积分上下限均为常数，则可以直接简化为直接交换积分和求导顺序：

$$
\frac{d}{dx} \int_a^b f(t, x)\,\mathrm{d}t = \int_a^b \frac{\partial}{\partial x} f(t, x)\,\mathrm{d}t
$$

### 核心思想

1. 构造含参积分 $I(\alpha)$，使得目标积分为某个特定参数值（如 $\alpha = 0$ 或 $\alpha = 1$），且存在一个极易计算的基准初值，用于确定积分常数（通常为 $I(0) = 0$ 或 $\lim_{\alpha \to \infty} I(\alpha) = 0$）。

2. 在积分号下对参数 $\alpha$ 求导，消去原积分中难以处理的项（如分母中的 $x$ 或根号），得到一个更易计算的积分。

3. 完成简化后的单变量积分，得到导函数 $I'(\alpha)$ 的闭式表达式。

4. 对 $\alpha$ 积分得到 $I(\alpha)$ 的表达式，并代入初值确定积分常数，最终得到原积分的结果。

### 示例

计算积分：

$$
\int_0^\infty \frac{\sin x} {x} \, dx
$$


构造收敛因子 $e^{-\alpha x}$：

$$
I(\alpha) = \int_0^\infty \frac{\sin x}{x} e^{-\alpha x} \, dx
$$

原式等价于 $I(0)$。

$$
I'(\alpha) = \int_0^\infty \frac{\partial}{\partial \alpha} \left( \frac{\sin x}{x} e^{-\alpha x} \right) \, dx = -\int_0^\infty \sin x e^{-\alpha x} \, dx
$$

由 复指数函数求解含三角函数的积分处 例题可知：

$$
I'(\alpha) = -\frac{1}{\alpha^2 + 1}\\
$$

对其积分得

$$
I(\alpha) = \int -\frac{1}{\alpha^2 + 1} \, d\alpha = -\arctan(\alpha) + C
$$

为了确定常数 $C$，考虑 $\alpha \to \infty$ 时，积分 $I(\alpha)$的取值：

* 从定义：
    $$
    \lim_{\alpha \to \infty} I(\alpha) = \lim_{\alpha \to \infty} \int_0^\infty \frac{\sin x}{x} e^{-\alpha x} \, dx = 0
    $$

* 从积分表达式：
    $$
    \lim_{\alpha \to \infty} I(\alpha) = \lim_{\alpha \to \infty} \left( -\arctan(\alpha) + C \right) = -\frac{\pi}{2} + C
    $$

故 $C = \dfrac \pi 2$

$$
\text{原式} = I(0) = -\arctan(0) + \frac{\pi}{2} = \frac{\pi}{2}
$$