---
title: 高数B（下）- 1
published: 2026-09-01
description: ''
image: ''
tags: [数学, 高数]
category: '高数'
draft: false 
lang: ''
---

## 向量与空间解析几何

统一使用右手直角坐标系，红色箭头代表绕 $z$ 轴的正旋转方向

![左手坐标系与右手坐标系](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Cartesian_coordinate_system_handedness.svg/250px-Cartesian_coordinate_system_handedness.svg.png?utm_source=zh.wikipedia.org&utm_campaign=parser&utm_content=thumbnail)

### 向量代数基础

$$
\theta = (\widehat{\boldsymbol{a}, \boldsymbol{b}}), \quad 0 \leq \theta \leq \pi
$$

向量 $\overrightarrow{AB}$ 在 $x$ 轴上的投影等于向量 $\overrightarrow{AB}$ 的模乘以 $x$ 轴与向量 $\overrightarrow{AB}$ 的夹角 $\alpha$ 的余弦，即

$$
\mathrm{Prj}_x \overrightarrow{AB} = |\overrightarrow{AB}| \cos\alpha.
$$


$$
\mathrm{Prj}_x (\boldsymbol{a}_1 + \boldsymbol{a}_2) = \mathrm{Prj}_x \boldsymbol{a}_1 + \mathrm{Prj}_x \boldsymbol{a}_2.
$$

$$
\boldsymbol{a} = |\boldsymbol{a}| (\cos \alpha \boldsymbol{i} + \cos \beta \boldsymbol{j} + \cos \gamma \boldsymbol{k})

\tag{7-2-2}
$$

$$
|\boldsymbol{a}| = \sqrt{a_x^2 + a_y^2 + a_z^2}

\tag{7-2-3}
$$

$$
\begin{cases}
\cos\alpha = \dfrac{a_x}{\sqrt{a_x^2 + a_y^2 + a_z^2}}, \\
\cos\beta = \dfrac{a_y}{\sqrt{a_x^2 + a_y^2 + a_z^2}}, \\
\cos\gamma = \dfrac{a_z}{\sqrt{a_x^2 + a_y^2 + a_z^2}}.
\end{cases}

\tag{7-2-4}
$$

其中
$$\cos^2\alpha + \cos^2\beta + \cos^2\gamma = 1$$

$$
\boldsymbol{e}_a 
= \cos\alpha \boldsymbol{i} + \cos\beta \boldsymbol{j} + \cos\gamma \boldsymbol{k}.
$$

$$
\boldsymbol{a} \cdot \boldsymbol{b}
= |\boldsymbol{a}| |\boldsymbol{b}| \cos(\widehat{\boldsymbol{a}, \boldsymbol{b}})
= |\boldsymbol{a}| \mathrm{Prj}_a \boldsymbol{b}.
$$

数量积满足下列运算性质 ($\lambda$ 为实数)：

1. $\boldsymbol{a} \cdot \boldsymbol{b} = \boldsymbol{b} \cdot \boldsymbol{a};$

2. $\boldsymbol{a} \cdot (\boldsymbol{b} + \boldsymbol{c}) = \boldsymbol{a} \cdot \boldsymbol{b} + \boldsymbol{a} \cdot \boldsymbol{c};$
3. $(\lambda\boldsymbol{a}) \cdot \boldsymbol{b} = \lambda(\boldsymbol{a} \cdot \boldsymbol{b}) = \boldsymbol{a} \cdot (\lambda\boldsymbol{b}).$

由数量积的定义，容易得出下面的结论：

1. $\boldsymbol{a} \cdot \boldsymbol{a} = |\boldsymbol{a}|^2;$

2. 两个非零向量 $\boldsymbol{a}$ 与 $\boldsymbol{b}$ 互相垂直的充要条件是 $\boldsymbol{a} \cdot \boldsymbol{b} = 0.$

设
$$
\boldsymbol{a} = a_x \boldsymbol{i} + a_y \boldsymbol{j} + a_z \boldsymbol{k}, \quad \boldsymbol{b} = b_x \boldsymbol{i} + b_y \boldsymbol{j} + b_z \boldsymbol{k}.
$$

有
$$
\boldsymbol{a} \cdot \boldsymbol{b} = a_x b_x + a_y b_y + a_z b_z.
$$

向量积满足下列规律 ($\lambda$ 为实数)：
1. $\boldsymbol{a} \times \boldsymbol{b} = -\boldsymbol{b} \times \boldsymbol{a};$

2. $(\boldsymbol{a} + \boldsymbol{b}) \times \boldsymbol{c} = \boldsymbol{a} \times \boldsymbol{c} + \boldsymbol{b} \times \boldsymbol{c};$

3. $(\lambda\boldsymbol{a}) \times \boldsymbol{b} = \boldsymbol{a} \times (\lambda\boldsymbol{b}) = \lambda(\boldsymbol{a} \times \boldsymbol{b}).$

由向量积的定义，容易得出下面的结论：

1. $\boldsymbol{a} \times \boldsymbol{a} = \boldsymbol{0}$;

2. 两个非零向量 $\boldsymbol{a}$ 与 $\boldsymbol{b}$ 互相平行的充要条件是 $\boldsymbol{a} \times \boldsymbol{b} = \boldsymbol{0}$.

设 $\boldsymbol{a} = a_x \boldsymbol{i} + a_y \boldsymbol{j} + a_z \boldsymbol{k}, \ \boldsymbol{b} = b_x \boldsymbol{i} + b_y \boldsymbol{j} + b_z \boldsymbol{k}$，则

$$
\boldsymbol{a} \times \boldsymbol{b}
= \begin{vmatrix}
\boldsymbol{i} & \boldsymbol{j} & \boldsymbol{k} \\
a_x & a_y & a_z \\
b_x & b_y & b_z
\end{vmatrix}.
$$

### 平面

- 向量点积方程：

    平面上任意一点 $P( \boldsymbol{r} )$ 与 $P_0(\boldsymbol{r}_0)$ 的向量 $\overrightarrow{P_0 P} = \boldsymbol{r} - \boldsymbol{r}_0$ 必垂直于平面的法向量 $\boldsymbol{n}$，即

    $$
    \boldsymbol{n} \cdot (\boldsymbol{r} - \boldsymbol{r}_0) = 0
    $$

- 点法式方程：

    $$
    A(x - x_0) + B(y - y_0) + C(z - z_0) = 0
    $$

### 直线

- 向量参数方程：

    确定一条直线需要：已知一点 $P_0(x_0, y_0, z_0)$（位置向量 $\boldsymbol{r}_0$）和**方向向量** $\boldsymbol{v} = (m, n, p)$。

    $$
    \boldsymbol{r} = \boldsymbol{r}_0 + t \boldsymbol{v} \quad (t \in \mathbb{R})
    $$

    或

    $$
    x = x_0 + mt, \quad y = y_0 + nt, \quad z = z_0 + pt.

    \tag{7-3-9}
    $$

- 点向式（对称式）方程：

    $$
    \frac {x - x_0}{m} = \frac{y - y_0}{n} = \frac{z - z_0}{p}.

    \tag{7-3-8}
    $$

### 直线与平面的空间位置关系

- 两者之间的组合平行垂直关系可由**方向向量** $\boldsymbol{v}$ 与**法向量** $\boldsymbol{n}$ 的**点积**或**叉积**来判断

- 两平面或直线夹角 $\cos \theta = \frac {| \boldsymbol{n}_1 \cdot \boldsymbol{n}_2 |}{|\boldsymbol{n}_1| |\boldsymbol{n}_2|}$

- 线面夹角 $\sin \varphi = \frac {|\boldsymbol{v} \times \boldsymbol{n}|}{|\boldsymbol{v}| |\boldsymbol{n}|}$

### 曲线的切线

$$
\begin{cases}
F(x, y, z) = 0, \\
G(x, y, z) = 0,
\end{cases}
$$

的切线方程为 

$$
\frac {x - x_0} {1} = \frac {y - y_0} {y'(x_0)} = \frac {z - z_0} {z'(x_0)}
$$

导数部分可用 Cramer's rule 解偏导方程组

### 曲面的切平面与法线

设曲面 $\Sigma$ 的方程为 $F(x, y, z) = 0$，则其切平面方程为：

$$
F'_x(x_0, y_0, z_0)(x - x_0) + F'_y(x_0, y_0, z_0)(y - y_0) + F'_z(x_0, y_0, z_0)(z - z_0) = 0.

\tag {9-2-1}
$$

法线方程为：

$$
\frac{x - x_0}{F'_x} = \frac{y - y_0}{F'_y} = \frac{z - z_0}{F'_z}.

\tag{9-2-2}
$$

若曲面以显函数形式给出，即 $z = f(x, y)$，则其切平面方程为：

$$
f'_x(x_0, y_0)(x - x_0) + f'_y(x_0, y_0)(y - y_0) - (z - z_0) = 0
$$

法线方程为：

$$
\frac{x - x_0}{f'_x} = \frac{y - y_0}{f'_y} = \frac{z - z_0}{-1}
$$

### 旋转变换

标准 2D 逆时针旋转矩阵为：

$$
\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}
$$

绕某个轴旋转将对应行列填为 $1$, 主子矩阵填上上述旋转矩阵即可。

* 绕 $x$-轴的主动旋转定义为：
  $$
    \mathcal{R}_x(\theta_x) = \begin{bmatrix}
    1 & 0 & 0 \\
    0 & \cos\theta_x & -\sin\theta_x \\
    0 & \sin\theta_x & \cos\theta_x
    \end{bmatrix}
  $$

* 绕 $y$-轴的主动旋转定义为：
  $$
    \mathcal{R}_y(\theta_y) = \begin{bmatrix}
    \cos\theta_y & 0 & \sin\theta_y \\
    0 & 1 & 0 \\
    -\sin\theta_y & 0 & \cos\theta_y
    \end{bmatrix}
  $$

* 绕 $z$-轴的主动旋转定义为：
  $$
    \mathcal{R}_z(\theta_z) = \begin{bmatrix}
    \cos\theta_z & -\sin\theta_z & 0 \\
    \sin\theta_z & \cos\theta_z & 0 \\
    0 & 0 & 1
    \end{bmatrix}
  $$

### 绕轴旋转/旋转体生成

将坐标轴分为两部分：

1. 轴向坐标（主元 $u$）：选定的坐标轴对应的坐标
2. 径向坐标（副元 $v_1, v_2$）：垂直于该旋转轴的两个坐标，点到该轴的垂直距离为 $r = \sqrt{v_1^2 + v_2^2}$。

已知图形满足方程 $F(u, v) = 0$（其中 $v$ 为某一垂直分量）：
绕 $u$ 轴旋转一周生成的旋转曲面，方程恒为：

$$
F(u, \pm \sqrt {v_1^2 + v_2^2}) = 0
$$

绕任意轴的话使用旋转变化矩阵 $\mathcal{R}$ 将该轴旋转到 $x$ 轴上，旋转后再使用上述方法，最后再将旋转后的结果逆旋转回去即可。


### 投影

设空间曲线由两曲面交线给出：

$$
C: \begin{cases} F(x, y, z) = 0 \\ G(x, y, z) = 0 \end{cases}
$$

1. 投影柱面：
消去目标坐标面对应的变量（例如消去 $z$），得到只含 $x, y$ 的方程 $H(x, y) = 0$。在三维空间中，它表示母线平行于 $z$ 轴、准线为投影线的**投影柱面**。
2. 投影曲线：
曲线在坐标面（如 $xOy$ 面）上的投影是**投影柱面与坐标平面的交线**，必须写成方程组形式：

$$
C_{xOy}: \begin{cases} H(x, y) = 0 \\ z = 0 \end{cases}
$$

---

## 多元函数微分学

### 二元函数极限的路径判定法

设 $\boldsymbol{\gamma}: [0, 1] \to \mathbb{R}^2$ 为平面上任意连续路径，满足：

$$
\lim_{t \to 0^+} \boldsymbol{\gamma}(t) = (x_0, y_0), \quad \text{且 } \boldsymbol{\gamma}(t) \neq (x_0, y_0) \quad (\forall t > 0)
$$

极限存在的充要条件是：**对所有满足上述条件的任意路径 $\boldsymbol{\gamma}(t)$**，沿该路径的一元复合函数极限均存在且相等：

$$
\lim_{t \to 0^+} f(\boldsymbol{\gamma}(t)) = L
$$

* 建议证明极限不存在随便选几个形如 $\boldsymbol{\gamma}_\theta(r) = (x_0 + r\cos\theta, y_0 + r\sin\theta)$ 的趋近路径

### 偏导数

$$
\text{偏导数连续} \implies \text{可微} \implies \begin{cases} \text{连续} \\ \text{方向导数存在} \implies \text{偏导数存在} \end{cases}
$$

$\dfrac{\partial^2 z}{\partial x \partial y} = \dfrac{\partial^2 z}{\partial y \partial x}$ 的最弱充分条件为：一阶偏导存在，且只需要**其中一个混合偏导数在 $P_0$ 处连续**。

### 梯度

函数 $u = f(x, y, z)$ 在点 $P_0$ 处的**梯度**是一个**向量**，记作 $\mathbf{grad} f$ 或 $\nabla f$：

$$
\mathbf{grad} f = \nabla f = \left( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z} \right)
$$

梯度与方向导数的关系：
方向导数本质上是梯度向量在单位方向向量 $\boldsymbol{e}_l$ 上的投影：

$$
\left.\frac{\partial f}{\partial l}\right|_{P_0} = \nabla f \cdot \boldsymbol{e}_l = |\nabla f| \cos\theta
$$

当 $\boldsymbol{e}_l$ 与 $\nabla f$ **同向**（$\theta = 0$）时，方向导数最大，**最大值等于梯度的模长** $|\nabla f|$。

### 方向导数

若函数 $u = f(x, y, z)$ 在点 $P_0(x_0, y_0, z_0)$ 处可微，则函数 $f$ 在 $P_0$ 处沿任意方向 $\boldsymbol{e}_l$ 的方向导数存在，且有以下的求导公式：

$$
\left.\frac{\partial f}{\partial l}\right|_{P_0} = \left.\frac{\partial u}{\partial x}\right|_{P_0} \cos\alpha + \left.\frac{\partial u}{\partial y}\right|_{P_0} \cos\beta + \left.\frac{\partial u}{\partial z}\right|_{P_0} \cos\gamma,

\tag{9-3-1}
$$

### 全微分

如果函数 $f(x, y)$ 在点 $(x_0, y_0)$ 处可微，则其全微分为：

$$
dz = \dfrac {\partial z}{\partial x} dx + \dfrac{\partial z}{\partial y} dy
$$

### 隐函数导数

#### 二元函数

设二元函数 $F(x, y)$ 在点 $P_0(x_0, y_0)$ 的某个邻域内有连续偏导数，如果

1. $F(x_0, y_0) = 0$;

2. $\left.\dfrac{\partial F}{\partial y}\right|_{P_0} \ne 0$,

则方程 $F(x, y) = 0$ 在点 $(x_0, y_0)$ 的某个邻域内确定唯一的连续函数 $y = f(x)$，且具有连续导数，它满足 $y_0 = f(x_0)$，并有
$$
\frac{\mathrm{d}y}{\mathrm{d}x} = -\frac{F'_x}{F'_y}.

\tag{8-6-1}
$$

#### 三元函数

设三元函数 $F(x, y, z)$ 在点 $P_0(x_0, y_0, z_0)$ 的某一邻域内具有连续偏导数，且 $F(x_0, y_0, z_0) = 0$，$F'_z(x_0, y_0, z_0) \ne 0$，则方程 $F(x, y, z) = 0$ 在点 $(x_0, y_0, z_0)$ 的某一邻域内能唯一确定一个连续且具有连续偏导数的函数 $z = f(x, y)$，它满足条件 $z_0 = f(x_0, y_0)$，并有

$$
\frac{\partial z}{\partial x} = -\frac{F'_x}{F'_z}, \quad \frac{\partial z}{\partial y} = -\frac{F'_y}{F'_z}. 

\tag{8-6-2}
$$

#### 方程组的情形

:::tip[Cramer's rule]
考虑由 $n$ 个未知数组成的 $n$ 元线性方程组，其矩阵乘法形式如下：

$$
A\mathbf{x} = \mathbf{b}
$$

其中向量 $\mathbf{x} = (x_1, \ldots, x_n)^\mathrm{T}$ 

$$
x_i = \frac{\det(A_i)}{\det(A)} \quad i = 1, \ldots, n
$$

其中 $A_i$ 是将矩阵 $A$ 的第 $i$ 列替换为列向量 $\mathbf{b}$ 所得到的矩阵。
:::

设有方程组

$$
\begin{cases}
F(x, y, u, v) = 0, \\
G(x, y, u, v) = 0,
\end{cases}

\tag{8-6-3}
$$

$$
\left\{
\begin{aligned}
F'_x + F'_u \dfrac{\partial u}{\partial x} + F'_v \dfrac{\partial v}{\partial x} = 0, \\
G'_x + G'_u \dfrac{\partial u}{\partial x} + G'_v \dfrac{\partial v}{\partial x} = 0,
\end{aligned}
\right.

\quad

\implies

\left\{
    \begin{aligned}
F'_u \dfrac{\partial u}{\partial x} + F'_v \dfrac{\partial v}{\partial x} = - F'_x, \\
G'_u \dfrac{\partial u}{\partial x} + G'_v \dfrac{\partial v}{\partial x} = - G'_x,
\end{aligned}
\right.

$$

$$
\begin{bmatrix}
F'_u & F'_v \\[2.2ex]
G'_u & G'_v
\end{bmatrix}
\begin{bmatrix}
\dfrac{\partial u}{\partial x} \\[2.2ex]
\dfrac{\partial v}{\partial x}
\end{bmatrix}
= -
\begin{bmatrix}
F'_x \\[2.2ex]
G'_x
\end{bmatrix}
$$

使用克莱姆法则可得，这里不展开赘述其以及雅可比行列式的方法。

注意不要忘记**负号**即可

### 多元函数极值

将 $u = f(x_1, x_2, \ldots, x_n)$ 的一阶偏导数全为 $0$ 的点称为 $f$ 的驻点。

设二元函数 $z = f(x, y)$ 在开区域 $G \subset \mathbf{R}^2$ 内有二阶连续偏导数，$(x_0, y_0) \in G$ 是 $f$ 的驻点，令

$$
\begin{aligned}
f''_{xx}(x_0, y_0) &= A, \\
f''_{xy}(x_0, y_0) &= B, \\
f''_{yy}(x_0, y_0) &= C,
\end{aligned}
$$

则

1. 当 $AC - B^2 > 0$ 时，$f(x, y)$ 在点 $(x_0, y_0)$ 取得极值，且当 $A < 0$ 时取极大值，当 $A > 0$ 时取极小值；

2. 当 $AC - B^2 < 0$ 时，$f(x, y)$ 在点 $(x_0, y_0)$ 不取极值；

3. 当 $AC - B^2 = 0$ 时，$f(x, y)$ 在点 $(x_0, y_0)$ 可能有极值，也可能没有极值。

#### 条件极值

考虑极值问题：

$$
\begin{align}
    \min(\text{or } \max) f = f(x_1, x_2, \ldots, x_n) \\
    \text{s.t. } \begin{cases}
        \varphi_1(x_1, x_2, \ldots, x_n) = 0, \\
        \varphi_2(x_1, x_2, \ldots, x_n) = 0, \\
        \vdots \\
        \varphi_m(x_1, x_2, \ldots, x_n) = 0,
    \end{cases}
\end{align}
$$

定义：

$$
\mathcal{L}(x, \lambda) = f(x) + \langle \lambda, \varphi(x) \rangle
$$

其中 $\langle \cdot, \cdot \rangle$ 表示内积。

$f$ 在约束 $\varphi$ 下的极值点 $x^*$ 必须满足：

$$
\frac {\partial \mathcal{L}} {\partial x} = 0 \quad \text{and} \quad  \frac {\partial \mathcal{L}} {\partial \lambda} = 0
$$

