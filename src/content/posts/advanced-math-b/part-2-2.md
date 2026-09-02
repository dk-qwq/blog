---
title: 高数B（下）- 2
published: 2026-09-01
description: ''
image: ''
tags: [数学, 高数]
category: '高数'
draft: false 
lang: ''
---

## 向量微分算子

### 散度

$F = F_x \boldsymbol{i} + F_y \boldsymbol{j} + F_z \boldsymbol{k}$

$$
\operatorname{div} \boldsymbol{F} 
= \nabla \cdot \boldsymbol{F} 
= (\frac{\partial}{\partial x}, \frac{\partial}{\partial y}, \frac{\partial}{\partial z}) \cdot (F_x, F_y, F_z)
= \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z}
$$

区别于 $\nabla F$

### 旋度

$$
\nabla \times \mathbf{F} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ \frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\ P & Q & R \end{vmatrix} = \left(\frac{\partial R}{\partial y} - \frac{\partial Q}{\partial z}\right)\mathbf{i} + \left(\frac{\partial P}{\partial z} - \frac{\partial R}{\partial x}\right)\mathbf{j} + \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)\mathbf{k}
$$

## 积分分类、转化与联系

### 第一类/第二类 积分区分

1. 曲线积分：
   - 第一类：$\int_L f(x, y) \, ds$
   - 第二类：$\int_L P(x, y) \, dx + Q(x, y) \, dy$
2. 曲面积分：
   - 第一类：$\iint_{\Sigma} f(x, y, z) \, dS$
   - 第二类：$\iint_{\Sigma} P(x, y, z) \, dy dz + Q(x, y, z) \, dz dx + R(x, y, z) \, dx dy$

### 两类曲线/曲面积分之间的联系

$$
\int_L P \, \mathrm{d}x + Q \, \mathrm{d}y 
= \int_L (P \cos\alpha + Q \cos\beta) \, \mathrm{d}s

\tag{11-7-1}
$$

$$
\iint_{\Sigma} P \, \mathrm{d}y\, \mathrm{d}z + Q \, \mathrm{d}z \, \mathrm{d}x + R \, \mathrm{d}x \, \mathrm{d}y
= \int_L (P \cos\alpha + Q \cos\beta + R \cos\gamma) \, \mathrm{d}s

\tag{11-7-6}
$$

## 积分降维与计算

### 积分变换

设变换公式为 $x = x(u, v),\ y = y(u, v)$，将平面区域 $D$ 映射为 $uv$ 平面上的区域 $D'$：

$$
\iint_D f(x, y) \, dx dy = \iint_{D'} f(x(u, v), y(u, v)) \cdot \vert{}J\vert{} \, du dv
$$

其中 $J$ 为雅可比行列式（Jacobian）：

$$
J 
= \frac{\partial(x, y)}{\partial(u, v)} 
= \begin{vmatrix} \frac{\partial x}{\partial u} & \frac{\partial x}{\partial v} \\ \frac{\partial y}{\partial u} & \frac{\partial y}{\partial v} \end{vmatrix} 
= \frac{\partial x}{\partial u}\frac{\partial y}{\partial v} - \frac{\partial x}{\partial v}\frac{\partial y}{\partial u}
$$

**面积微元关系：$dx dy = \vert{}J\vert{} \, du dv$。**

- 常用特例：极坐标变换

    适用于**积分区域为圆形/扇形/环形**或**被积函数含 $x^2 + y^2$** 的情形：

    $$
    \iint_D f(x, y) \, dx dy = \iint_{D'} f(r\cos\theta, r\sin\theta) \cdot r \, dr d\theta
    $$

### 曲线积分

$$
\int_{L} f(x, y) \, ds = \int_a^b f(x(t), y(t)) \sqrt{x'^2(t) + y'^2(t)} \, dt
$$

### 曲面积分

$$
\iint_{\Sigma} f(x, y, z) \, dS = \iint_D f(x, y, z(x, y)) \sqrt{1 + \left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2} \, dx dy
$$

### 第二类曲线积分的计算

设 $P(x, y), Q(x, y)$ 在有向光滑曲线弧 $L$ 上有定义且连续，$L$ 的参数方程为

$$
x = \varphi(t), \quad y = \psi(t).
$$

曲线积分

$$
\begin{aligned}
&\int_L P(x, y) \, \mathrm{d}x + Q(x, y) \, \mathrm{d}y \\
= &\int_\alpha^\beta (P(\varphi(t), \psi(t))\varphi'(t) + Q(\varphi(t), \psi(t))\psi'(t)) \, \mathrm{d}t.
\end{aligned}

\tag{11-2-1}
$$


### 反常积分

#### 无界区域反常积分（无穷限积分）

设 $f(x, y)$ 在无界区域 $D$ 上连续，若存在 $\rho_0 > 0$，使当 $\rho = \sqrt{x^2 + y^2} \geqslant \rho_0$ 且 $(x, y) \in D$ 时，有

$$
|f(x, y)| \leqslant \frac{M}{\rho^\alpha},
$$

其中 $M$ 与 $\alpha$ 均为常数，则当 $\alpha > 2$ 时，反常二重积分 $\iint\limits_D f(x, y) \, \mathrm{d}\sigma$ 收敛。

#### 有界函数反常积分（瑕积分）

设 $f(x, y)$ 在有界闭区域 $D$ 上除 $P_0(x_0, y_0)$ 外处处连续，且当 $(x, y) \to (x_0, y_0)$ 时，$f(x, y) \to \infty$。若不等式

$$
|f(x, y)| \leqslant \frac{M}{\rho^\alpha}
$$

在 $D$ 上除点 $(x_0, y_0)$ 外处处成立，其中 $M$ 与 $\alpha$ 均为常数，且

$$
\rho = \sqrt{(x - x_0)^2 + (y - y_0)^2},
$$
则当 $\alpha < 2$ 时，反常二重积分 $\iint\limits_D f(x, y) \, \mathrm{d}\sigma$ 收敛。

## 全微分方程

$$
\mathrm{d}u = P(x, y) \, \mathrm{d}x + Q(x, y) \, \mathrm{d}y
$$

$$
u(x, y) = \int_{x_0}^x P(x, y_0) \, \mathrm{d}x + \int_{y_0}^y Q(x, y) \, \mathrm{d}y

\tag {11-3-9}
$$


## 积分核心方向规则与四大定理

各类积分定理中，方向的匹配由以下右手定则与几何准则统一约束：

| 积分类型 / 定理 | 几何对象 | 正方向判定规则 | 典型公式 |
| --- | --- | --- | --- |
| **定积分 / 变限积分** | 一维区间 $[a, b]$ | 从下限到上限为正；上下限对调变号。 | $\int_b^a f(x)\mathrm{d}x = -\int_a^b f(x)\mathrm{d}x$ |
| **格林公式 (Green)** | 平面闭曲线 $L$ 围成区域 $D$ | **左侧法则**：沿路径前进时，区域 $D$ 始终在前进方向的**左侧**（单连通域即**逆时针**）。 | $\oint_L P\mathrm{d}x + Q\mathrm{d}y = \iint_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)\mathrm{d}x\mathrm{d}y$ |
| **高斯公式 (Gauss)** | 空间封闭曲面 $\Sigma$ 包围立体 $\Omega$ | 取**外侧**法向量（$\vec{n}$ 指向立体外部）为正方向。若取内侧需加负号。 | $\oiint_\Sigma \vec{F} \cdot \mathrm{d}\vec{S} = \iiint_\Omega (\nabla \cdot \vec{F})\mathrm{d}V$ |
| **斯托克斯公式 (Stokes)** | 空间有向曲面 $\Sigma$ 与其边界 $\Gamma$ | **右手定则**：右手四指沿边界 $\Gamma$ 方向弯曲，大拇指指向曲面 $\Sigma$ 的**法向量正侧**。 | $\oint_\Gamma \vec{F} \cdot \mathrm{d}\vec{r} = \iint_\Sigma (\nabla \times \vec{F}) \cdot \mathrm{d}\vec{S}$ |


## 格林公式

设有界闭区域 $D$ 由分段光滑的曲线 $L$ 所围成，函数 $P(x, y)$ 及 $Q(x, y)$ 在 $D$ 上具有一阶连续偏导数，则有

$$
\iint_D \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) \mathrm{d}x \mathrm{d}y = \oint_L P \, \mathrm{d}x + Q \, \mathrm{d}y, 

\tag{11-3-1}
$$

其中 $L$ 是 $D$ 的取正向的边界曲线。

## 路径无关条件

设 $P(x, y), Q(x, y)$ 在单连通区域 $D$ 内有连续偏导数，则下列条件相互等价：

1. 对 $D$ 中任一分段光滑曲线 $L$，曲线积分 $\int_L P \, \mathrm{d}x + Q \, \mathrm{d}y$ 与路径无关，只与 $L$ 的起点与终点有关；

2. 沿 $D$ 中任一分段光滑的闭曲线 $L$，有
    $$
    \oint_L P \, \mathrm{d}x + Q \, \mathrm{d}y = 0;
    $$

3. 在 $D$ 内 $P \, \mathrm{d}x + Q \, \mathrm{d}y$ 是 $D$ 内某一函数 $u$ 的全微分，即在 $D$ 内存在函数 $u(x, y)$，使得
 
    $$
    \mathrm{d}u = P \, \mathrm{d}x + Q \, \mathrm{d}y;
    $$

4. 在 $D$ 内每点处有 $\dfrac{\partial P}{\partial y} = \dfrac{\partial Q}{\partial x}$。

## 高斯公式

设空间闭区域 $\Omega$ 是由分片光滑的闭曲面 $\Sigma$ 所围成，函数 $P(x, y, z), Q(x, y, z), R(x, y, z)$ 在 $\Omega$ 及 $\Sigma$ 上具有关于 $x, y, z$ 的连续偏导数，则有

$$
\iiint_\Omega \left( \frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z} \right) \mathrm{d} v = \oiint_\Sigma P \, \mathrm{d}y \mathrm{d}z + Q \, \mathrm{d}z \mathrm{d}x + R \, \mathrm{d}x \mathrm{d}y, 

\tag{11-6-1}
$$

这里 $\Sigma$ 是 $\Omega$ 整个边界曲面的外侧。

或者

$$
\iiint_\Omega \operatorname{div} \boldsymbol{F} \, \mathrm{d}v = \oiint_\Sigma \boldsymbol{F} \cdot \boldsymbol{n} \, \mathrm{d}\boldsymbol{S}
$$

## 斯托克斯 (Stokes) 公式

设分片光滑的曲面 $\Sigma$ 的边界是分段光滑闭曲线 $\Gamma$，函数 $P(x, y, z), Q(x, y, z), R(x, y, z)$ 及其偏导数在曲面 $\Sigma$ 上连续，则

$$
\begin{aligned}
&\oint_\Gamma P \, \mathrm{d}x + Q \, \mathrm{d}y + R \, \mathrm{d}z \\
&= \iint_\Sigma \left( \frac{\partial R}{\partial y} - \frac{\partial Q}{\partial z} \right) \mathrm{d}y \mathrm{d}z + \left( \frac{\partial P}{\partial z} - \frac{\partial R}{\partial x} \right) \mathrm{d}z \mathrm{d}x + \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) \mathrm{d}x \mathrm{d}y,
\end{aligned} \tag{11-6-4}
$$

这里有向曲面 $\Sigma$ 的正向与曲线 $\Gamma$ 的正向符合右手法则。

为了便于记忆，可把公式 (11-6-4) 写成

$$
\oint_\Gamma P \, \mathrm{d}x + Q \, \mathrm{d}y + R \, \mathrm{d}z = \iint_\Sigma \begin{vmatrix}
\mathrm{d}y \mathrm{d}z & \mathrm{d}z \mathrm{d}x & \mathrm{d}x \mathrm{d}y \\[1.5ex]
\dfrac{\partial}{\partial x} & \dfrac{\partial}{\partial y} & \dfrac{\partial}{\partial z} \\[2.5ex]
P & Q & R
\end{vmatrix}.
$$

或

$$
\oint_{\partial\Sigma} \boldsymbol{F} \cdot \mathrm{d}\boldsymbol{r} = \iint_\Sigma (\nabla \times \boldsymbol{F}) \cdot \boldsymbol{n} \, \mathrm{d}S.
$$