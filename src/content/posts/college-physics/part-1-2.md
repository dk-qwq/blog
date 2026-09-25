---
title: 大物（上）- 2
published: 2026-09-25
description: '刚体的定轴转动/振动与波'
image: ''
tags: [物理, 大物]
category: '大物'
draft: false 
lang: ''
pinWeight: 2
---

## 刚体的定轴转动

### 质点运动与刚体定轴转动对照表

| 物理量 / 定理 | 质点运动 (平动) | 刚体定轴转动 (转动) |
| --- | --- | --- |
| **速度 / 角速度** | $\boldsymbol{v} = \dfrac{\mathrm{d}\boldsymbol{r}}{\mathrm{d}t}$ | $\boldsymbol{\omega} = \dfrac{\mathrm{d}\boldsymbol{\theta}}{\mathrm{d}t}$ |
| **加速度 / 角加速度** | $\boldsymbol{a} = \dfrac{\mathrm{d}\boldsymbol{v}}{\mathrm{d}t}$ | $\boldsymbol{\alpha} = \dfrac{\mathrm{d}\boldsymbol{\omega}}{\mathrm{d}t}$ |
| **惯性量度** | 质量 $m$ | 转动惯量 $J = \displaystyle\int r^2 \mathrm{d}m$ |
| **动力学作用量** | 力 $\boldsymbol{F}$ | 力矩 $\boldsymbol{M}$ |
| **动力学基本方程** | $\boldsymbol{F} = m\boldsymbol{a}$ | $\boldsymbol{M} = J\boldsymbol{\alpha}$ |
| **动量 / 角动量** | $\boldsymbol{p} = m\boldsymbol{v}$ | $\boldsymbol{L} = \boldsymbol{J}\boldsymbol{\omega}$ |
| **动量 / 角动量定理** | $\boldsymbol{F} = \dfrac{\mathrm{d}\boldsymbol{p}}{\mathrm{d}t}$ | $\boldsymbol{M} = \dfrac{\mathrm{d}\boldsymbol{L}}{\mathrm{d}t}$ |
| **功的计算** | $W = \displaystyle\int \boldsymbol{F} \cdot \mathrm{d}\boldsymbol{r}$ | $W = \displaystyle\int \boldsymbol{M} \cdot \,\mathrm{d}\boldsymbol{\theta}$ |
| **功率** | $P = \boldsymbol{F} \cdot \boldsymbol{v}$ | $P = \boldsymbol{M} \cdot \boldsymbol{\omega}$ |
| **动能 (标量形式)** | $E_k = \dfrac{1}{2}mv^2$ | $E_k = \dfrac{1}{2}J\omega^2$ |
| **动能定理** | $W = \dfrac{1}{2}mv_2^2 - \dfrac{1}{2}mv_1^2$ | $W = \dfrac{1}{2}J\omega_2^2 - \dfrac{1}{2}J\omega_1^2$ |

### 线量与角量的桥梁公式

- **速度映射**：$\boldsymbol{v} = \boldsymbol{\omega} \times \boldsymbol{r}$
- 加速度映射：
  * **切向加速度** $a_t = r \alpha$
  * **法向加速度** $a_n = r \omega^2$

### 力矩

- 力矩的产生：$\boldsymbol{M} = \boldsymbol{r} \times \boldsymbol{F}$
- 力矩的作用：$\boldsymbol{M} = J\boldsymbol{\alpha}$

### 角动量守恒定理

当质点或系统受到的合外力矩 $\boldsymbol{M}_{\text{ext}} = \mathbf{0}$ 时，

$$
\boldsymbol{L} = \boldsymbol{J} \boldsymbol{\omega} = \text{常矢量}
$$

### 常见转动惯量速查表

<div class="[&_td]:!align-middle [&_th]:!align-middle [&_img]:!my-0 [&_img]:!inline-block">

| 图形 | 描述 | 转动惯量 |
| :---: | :--- | :--- |
| <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Moment_of_inertia_rod_center.svg/250px-Moment_of_inertia_rod_center.svg.png" width="70" /> | **细棒**，长为 $L$ ，质量为 $m$（轴过中心） | $J_{\text{center}} = \dfrac{mL^2}{12}$ |
| <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Moment_of_inertia_rod_end.svg/250px-Moment_of_inertia_rod_end.svg.png" width="70" /> | **细棒**，长为 $L$ ，质量为 $m$（轴过一端） | $J_{\text{end}} = \dfrac{mL^2}{3}$ |
| <img src="https://upload.wikimedia.org/wikipedia/commons/5/54/Moment_of_inertia_thin_cylinder.png" width="70" /> | **两端开通的薄圆柱壳**，半径为 $r$ ，质量为 $m$ | $J = mr^2$ |
| <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Moment_of_inertia_solid_cylinder.png" width="70" /> | **实心圆柱**，半径为 $r$ ，高为 $h$ ，质量为 $m$ | $J_z = \dfrac{mr^2}{2}$ |
| <img src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Moment_of_inertia_thick_cylinder.png" width="70"/> | **两端开通的厚圆柱**，内半径为 $r_1$ ，外半径为 $r_2$ ，高为 $h$ ，质量为 $m$ | $J_z = \dfrac{m}{2}\left(r_1^2 + r_2^2\right)$ |
| <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Moment_of_inertia_solid_sphere.png" width="70" /> | **实心球**，半径为 $r$ ，质量为 $m$ | $J = \dfrac{2mr^2}{5}$ |

</div>

---

## 振动与波

### 简谐振动基础

- **角频率与系统参数**：$\omega^2 = \frac k m$，其中 $k$ 为弹性系数，$m$ 为振子质量
- **位移方程**：$x = A \cos (\omega t + \varphi)$
- 周期与频率：
  - **周期**：$T = \dfrac {2 \pi} {\omega}$
  - **频率**：$\nu = \frac 1 T = \frac \omega {2 \pi}$
- **由初始条件确定振幅与初相**：
    $$
    A = \sqrt{x_0^2 + \dfrac {v_0^2} {\omega^2}}  \quad 
    \tan \varphi = -\dfrac {v_0} {\omega x_0}
    $$

### 简谐振动的能量

$$
\begin{cases}
E_k = \dfrac{1}{2} m v^2 = \dfrac{1}{2} m \omega^2 A^2 \sin^2 (\omega t + \varphi) \\[1ex]
E_p = \dfrac{1}{2} k x^2 = \dfrac{1}{2} k A^2 \cos^2 (\omega t + \varphi)
\end{cases}
$$

$$
E = E_k + E_p = \dfrac{1}{2} k A^2
$$

### 同方向同频率振动的合成

$$
\begin{cases}
A = \sqrt{A_1^2 + A_2^2 + 2A_1A_2\cos(\varphi_2 - \varphi_1)} \\[1ex]
\tan \varphi_0 = \dfrac {A_1 \sin \varphi_1 + A_2 \sin \varphi_2} {A_1 \cos \varphi_1 + A_2 \cos \varphi_2} 
\end{cases}
$$

1. 若相位差 $(\varphi_2 - \varphi_1) = 2 k \pi \, (k = 0, \pm 1, \pm 2, \cdots)$
    $$
    A = \sqrt{A_1^2 + A_2^2 + 2 A_1 A_2} = A_1 + A_2
    $$
2. 若相位差 $(\varphi_2 - \varphi_1) = (2k + 1) \pi \, (k = 0, \pm 1, \pm 2, \cdots)$
    $$
    A = \sqrt{A_1^2 + A_2^2 - 2 A_1 A_2} = |A_1 - A_2|
    $$

### 机械波

- **波速关系式**：$u = \dfrac {\lambda} {T}$，其中 $\lambda$ 为波长，$u$ 为波速

$$
y = A \cos ({\omega (t - \dfrac x  u) + \varphi})
$$