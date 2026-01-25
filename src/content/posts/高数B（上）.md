---
title: 高数B（上）
published: 2026-01-19
description: ''
image: ''
tags: [数学，高数]
category: '高数'
draft: false 
lang: ''
---

## 1. 极限

### 1.1 函数极限与无穷大

**定义**：  
若当 $x \to x_0$ 时，$f(x)$ 的值无限增大（或减小），记为
$$
\lim_{x \to x_0} f(x) = \infty \quad \text{或} \quad -\infty
$$

⚠️ **易错点**：  

- 无穷大是极限的一种**发散形式**

---

### 1.2 无穷小量等价替换

当 $x \to 0$ 时，有以下常用等价无穷小：

$$
\begin{aligned}
&\sin x \sim \tan x \sim \arcsin x \sim \arctan x \\
&x \sim \ln(1 + x) \sim e^x - 1 \\
&\log_a(1 + x) \sim \frac{x}{\ln a} \\
&a^x - 1 \sim (\ln a)x \\
&1 - \cos x \sim \frac{1}{2}x^2 \\
&(1 + x)^n - 1 \sim nx
\end{aligned}
$$

⚠️ **易错点**：  

- 只能用于 **乘除**，不能随意用于加减

---

## 2. 连续性与间断点

### 2.1 间断点分类

| 类型 | 判定条件 |
| --- | --- |
| 可去间断点 | 左右极限存在且相等，但不等于函数值或函数值不存在 |
| 跳跃间断点 | 左右极限都存在但不相等 |
| 第二类间断点 | 左右极限至少有一个不存在 |

---

## 3. 导数与微分

### 3.0 参数方程的导数公式

$$
\frac d {dx} (\frac {dy} {dx}) = \frac d {dt} (\frac {dy} {dx} / \frac {dx} {dt}) / \frac {dx} {dt}
$$

### 3.1 基本恒等式

$$
\tan^2 x = \sec^2 x - 1
$$

---

### 3.2 驻点与拐点

- **驻点**：  
  $f'(x)=0$ 的点，指的是 **自变量 $x$**

- **拐点**：  
  $f''(x_0)=0$ 且凹凸性发生改变，对应点为 $(x_0,f(x_0))$

⚠️ **易错点**：  

- $f''(x)=0$ 不一定是拐点（需凹凸性改变）

---

### 3.3 函数凹凸性

$$
\begin{cases}
f''(x) > 0 \Rightarrow \text{凹函数} \\
f''(x) < 0 \Rightarrow \text{凸函数}
\end{cases}
$$
---

### 3.4 拉格朗日中值定理

**定理**：  
若 $f(x)$ 在 $[a,b]$ 上连续，在 $(a,b)$ 内可导，则存在 $\xi\in(a,b)$ 使得
$$
f(b)-f(a)=f'(\xi)(b-a)
$$

---

### 3.5 常见构造函数（中值定理 / 求导）

$$
\begin{aligned}
f(x)+C &\Rightarrow f'(x)\\
xf(x)+C &\Rightarrow f(x)+xf'(x)\\
\frac{f(x)}{x}+C &\Rightarrow \frac{xf'(x)-f(x)}{x^2}\\
e^x f(x)+C &\Rightarrow e^x(f+f')\\
e^{-x} f(x)+C &\Rightarrow e^{-x}(f'-f)\\
x^k f(x)+C &\Rightarrow kx^{k-1}f+x^k f'\\
\sin x f(x)+C &\Rightarrow \cos x f+\sin x f'\\
\cos x f(x)+C &\Rightarrow -\sin x f+\cos x f'
\end{aligned}
$$

---

## 4. 曲线的几何应用

### 4.1 弧长公式

直角坐标系：
$$
s=\int_a^b \sqrt{1+[f'(x)]^2}\,dx
$$

参数方程：
$$
s=\int_\alpha^\beta \sqrt{(x')^2+(y')^2}\,dt
$$

---

### 4.2 曲率与曲率半径

$$
k=\left|\frac{y''}{(1+y'^2)^{3/2}}\right|,\qquad R=\frac1k
$$

参数形式：
$$
k=\frac{|y''x'-y'x''|}{(x'^2+y'^2)^{3/2}}
$$

---

## 5. 积分常用结论

### 5.1 常见换元

$$
\sin x=\frac{2t}{1+t^2},\quad
\cos x=\frac{1-t^2}{1+t^2},\quad
dx=\frac{2}{1+t^2}dt
$$

---

### 5.2 极坐标下的面积公式

极坐标方程：
$$
\begin{cases}
x = r(\theta)\cos\theta \\
y = r(\theta)\sin\theta
\end{cases}
$$

由曲线围成的面积为
$$
A = \frac{1}{2}\int_{\alpha}^{\beta} r^2(\theta)\,d\theta
$$

---

### 5.3 常见不定积分

$$
\begin{aligned}
\int \frac1{x^2\pm a^2}dx &= \ln\left|x+\sqrt{x^2\pm a^2}\right|+C\\
\int \sec x\,dx &= \ln|\sec x+\tan x|+C\\
\int \csc x\,dx &= \ln|\csc x-\cot x|+C
\end{aligned}
$$

---

## 6. 微分方程

### 6.1 一阶齐次微分方程的换元

形如
$$
\frac{dy}{dx} = F\!\left(\frac{y}{x}\right)
$$

令
$$
u = \frac{y}{x}
$$

则
$$
\frac{dy}{dx} = u + x\frac{du}{dx}
$$

从而将原方程化为关于 $u,x$ 的可分离变量方程。

### 6.2 二阶微分方程的降阶法

当微分方程形如
$$
y'' = f(y,y')
$$

设
$$
P = y'
$$

则
$$
y'' = \frac{dP}{dx}
     = \frac{dP}{dy}\frac{dy}{dx}
     = P\frac{dP}{dy}
$$

原方程可化为
$$
P\frac{dP}{dy} = f(y,P)
$$

### 6.3 一阶线性微分方程

$$
\frac{dy}{dx}+P(x)y=Q(x)
$$

通解：
$$
y=e^{-\int P(x)dx}\left[C+\int Q(x)e^{\int P(x)dx}dx\right]
$$

---

### 6.4二阶常系数线性微分方程

#### 0. 常系数线性微分方程的一般形式

$n$ 阶常系数线性微分方程：
$$
a_n \frac{d^n y}{dx^n}
+ a_{n-1} \frac{d^{n-1} y}{dx^{n-1}}
+ \cdots
+ a_1 \frac{dy}{dx}
+ a_0 y
= f(x)
$$

其中 $a_0,a_1,\dots,a_n$ 为常数，$f(x)$ 为已知函数。

---

#### 1. 微分算子表示法

记微分算子
$$
D = \frac{d}{dx}
$$

则有
$$
\frac{dy}{dx} = Dy,\quad
\frac{d^2 y}{dx^2} = D^2 y,\ \dots
$$

定义算子多项式
$$
L(D) = a_n D^n + a_{n-1} D^{n-1} + \cdots + a_1 D + a_0
$$

原方程可简写为
$$
L(D)(y) = f(x)
$$
---

#### 2. 二阶常系数齐次线性微分方程

本课程中仅讨论二阶常系数线性微分方程：
$$
y'' + p y' + q y = f(x)
$$

齐次方程：
$$
y'' + p y' + q y = 0
$$

设特征方程：
$$
L(r) = r^2 + pr + q = 0
$$

根据特征根情况，通解为：

| 特征根情况 | 通解 |
| --- | --- |
| $r_1 \neq r_2$（两实根） | $y=C_1 e^{r_1 x}+C_2 e^{r_2 x}$ |
| $r_1=r_2$（重根） | $y=(C_1+C_2 x)e^{r_1 x}$ |
| $r_{1,2}=\alpha\pm\beta i$ | $y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)$ |

记该通解为 **齐次通解** $y_0$。

---

#### 3. 二阶常系数非齐次线性微分方程

非齐次方程：
$$
y'' + p y' + q y = f(x)
$$

**基本结论**：
$$
\text{非齐通} = \text{齐通} + \text{非齐特}
\qquad\Rightarrow\qquad
y = y_0 + y_p
$$

---

#### 4. 常见右端形式与特解设法（待定系数法）

##### （1）指数 × 多项式型

$$
f(x) = e^{\lambda x} C_n(x)
$$
其中 $C_n(x)$ 为 $n$ 阶多项式。

设
$$
y_p = x^k e^{\lambda x} Q_n(x)
$$

- $Q_n(x)$：$n$ 阶多项式  
- $k$ 的取值规则：
  - 若 $L(\lambda)\neq 0$，则 $k=0$
  - 若 $L(\lambda)=0$，则 $k=1$
  - 若 $\lambda$ 是**重根**，则 $k=2$

---

##### （2）指数 × 三角函数型

$$
f(x)=e^{\lambda x}\bigl(P_n(x)\cos\beta x+P_m(x)\sin\beta x\bigr)
$$

设
$$
y_p=x^k e^{\lambda x}\bigl(R_c(x)\cos\beta x+S_c(x)\sin\beta x\bigr)
$$

其中：

- $c=\max\{n,m\}$
- $k=0$ 或 $1$，由 $L(\lambda\pm i\beta)=0$ 是否成立决定

#### **微分算子法（Differential Operator）——线性微分方程的利器**

---
记  
$$
Dy = D(y) = y'
\qquad
\frac{1}{D} = \int \, dx
$$

---

##### 性质

- 若 $F(b)\neq 0$，则  $\frac{1}{F(D)} e^{bx} = \frac{1}{F(b)} e^{bx}$

- 若 $F(D) = (D-a)(D-b)$，则  $\frac{1}{F(D)} f(x) = \frac{1}{D-a}\,\frac{1}{D-b}\,f(x)$

- 指数平移性质：
  $$
  \frac{1}{F(D)}\bigl(u(x)e^{kx}\bigr)
  = e^{kx}\,\frac{1}{F(D+k)}u(x)
  $$

- 线性性质：
  $$
  \frac{1}{F(D)}[f_1(x)+f_2(x)]
  = \frac{1}{F(D)}f_1(x)
  + \frac{1}{F(D)}f_2(x)
  $$

- 当
  $$
  F(D)=D-k
  $$
  时，有展开式
  $$
  \frac{1}{F(D)}x^a
  = \sum_{i=0}^{+\infty}\frac{-D^i}{k^{i+1}}\,x^a
  = \left(
  -\frac{1}{k}
  -\frac{D}{k^2}
  -\cdots
  -\frac{D^a}{k^{a+1}}
  \right)x^a
  $$
