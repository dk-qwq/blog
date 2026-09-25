---
title: 大物（上）- 1
published: 2026-09-21
description: '基本运动学'
image: ''
tags: [物理, 大物]
category: '大物'
draft: false 
lang: ''
pinWeight: 2
---

## 量纲分析

$$
\dim \boldsymbol{Q} = \boldsymbol{L}^p \boldsymbol{M}^q \boldsymbol{T}^s
$$

基本量纲：长度 $\boldsymbol{L}\ (\mathrm{m})$，质量 $\boldsymbol{M}\ (\mathrm{kg})$，时间 $\boldsymbol{T}\ (\mathrm{s})$

---

## 质点运动学

### 基本运动学参量

- 位置矢量：$\boldsymbol{r} = x \boldsymbol{i} + y \boldsymbol{j} +z \boldsymbol{k}\\[1ex]$
- 位移矢量：$\Delta \boldsymbol{r} = \boldsymbol{r}_2 - \boldsymbol{r}_1\\[1ex]$
- 速度与加速度：$\boldsymbol{v} = \dfrac {\mathrm{d} \boldsymbol{r}}{\mathrm{d} t},\quad \boldsymbol{a} = \dfrac {\mathrm{d} \boldsymbol{v}}{\mathrm{d} t}$

### 圆周运动学参量

- 角速度与线速度：$\boldsymbol{\omega} = \dfrac {\mathrm{d} \boldsymbol{\theta}} {\mathrm{d} t}$，$\boldsymbol{v} = r \boldsymbol{\omega}\\[1ex]$
- 角加速度与切向加速度：$\alpha = \dfrac {\mathrm{d} \boldsymbol{\omega}} {\mathrm{d} t} = \dfrac {\mathrm{d}^2 \boldsymbol{\theta}} {\mathrm{d} t ^ 2}$，$a_t = r \alpha$
- 加速度矢量分解：
    $$
    \boldsymbol{a} = \boldsymbol{a_n} + \boldsymbol{a_t} = \dfrac {v^2} {r} \boldsymbol{e_n} + \dfrac {\mathrm{d} v} {\mathrm{d} t} \boldsymbol{e_t}
    $$
    *其中 $\boldsymbol{a_n}$ 为法向加速度，$\boldsymbol{a_t}$ 为切向加速度，总加速度与切向夹角：$\tan \varphi = \dfrac {a_n} {a_t}$。*

#### 匀变角加速运动方程

讲匀变速直线运动的 $x, v, a$ 替换为 $\theta, \omega, \alpha$。

$$
\begin{cases}
    \boldsymbol{\omega} = \boldsymbol{\omega}_0 + \alpha t \\
    \boldsymbol{\theta} = \boldsymbol{\theta}_0 + \boldsymbol{\omega}_0 t + \frac 1 2 \alpha t^2 \\
    \boldsymbol{\omega}^2 = \boldsymbol{\omega}_0^2 + 2 \alpha (\boldsymbol{\theta} - \boldsymbol{\theta}_0)
\end{cases}
$$

### 伽利略相对速度变换

$$
\boldsymbol{v} = \boldsymbol{v'} + \boldsymbol{u}
$$

*绝对速度 = 相对速度 + 牵连速度；其中 $\boldsymbol{v}$ 为质点相对于 S 系的速度，$\boldsymbol{u}$ 为 S' 系相对于 S 系的速度，$\boldsymbol{v'}$ 为质点相对于 S' 系的速度。*

---

## 牛顿定律与动力学方程

### 牛顿运动定律

- 第一定律 (惯性定律)：$\boldsymbol{F} = 0 \, \text{时，}  \boldsymbol{v} = \text{常矢量}$
- 第二定律 (动量变化率形式，最本质形态)：$\boldsymbol{p} = m \boldsymbol{v}$，$\boldsymbol{F} = \dfrac{\mathrm{d} \boldsymbol{p}}{\mathrm{d} t} = \dfrac{\mathrm{d}(m \boldsymbol{v})}{\mathrm{d} t}$
- 第三定律 (作用与反作用)：$\boldsymbol{F} = - \boldsymbol{F'}$

### 常见力公式

- 万有引力与重力加速度：$F = G \dfrac {m_1 m_2} {r^2}$，$g = \dfrac {G m_E} {R_E^2}\\[1ex]$
- 摩擦力：$F_{f0} \leq F_{f0m} = \mu_0 F_N$，$F_f = \mu F_N$

### 非惯性系与惯性力

$$
\boldsymbol{F} + \boldsymbol{F_i} = m \boldsymbol{a}
$$

*其中 $\boldsymbol{F_i}$ 为惯性力。*

---

## 动量定理与质心

### 动量定理与动量守恒

- 质点动量定理：
    $$
    \boldsymbol{I} = \int_{t_1}^{t_2} \boldsymbol{F}(t) \, \mathrm{d} t = \boldsymbol{p}_2 - \boldsymbol{p}_1 = m \boldsymbol{v}_2 - m \boldsymbol{v}_1
    $$
- 质点系动量定理：
    $$
    \boldsymbol{F}^{ex} = \dfrac{\mathrm{d} \boldsymbol{p}}{\mathrm{d} t}
    $$
    *其中 $\boldsymbol{F}^{ex}$ 为作用于质点系的合外力。*

- 动量守恒：$\boldsymbol{F}^{ex} = 0$ ，$\boldsymbol{p} =\text{常矢量}$ 

### 质心

$$
\boldsymbol{r}_c = \dfrac {\sum m_i \boldsymbol{r}_i} {\sum m_i}
$$

---

## 功与能

- $\mathrm{d} W = \boldsymbol{F} \cdot \mathrm{d} \boldsymbol{r}\\[1ex]$
- $P = \dfrac {\mathrm{d} W} {\mathrm{d} t} = \boldsymbol{F} \cdot \dfrac {\mathrm{d} \boldsymbol{r}} {\mathrm{d} t} = \boldsymbol{F} \cdot \boldsymbol{v}$
- 动能定理
    $$
    W = E_{k2} - E_{k1}
    $$

---

## 保守力做功与势能

保守力做功与**路径无关**，其沿闭合路径积分为零：$W = \oint_L \boldsymbol{F} \cdot \, \mathrm{d} \boldsymbol{r} = 0$。

保守力做功等于势能的减少量：$W = - \Delta E_p$。

三大保守力做功与对应势能：

| 物理量 / 类型 | 功的表达式 $W$ | 势能表达式 $E_p$ |
| --- | --- | --- |
| **万有引力** | $W = G m' m \left(\dfrac{1}{r_B} - \dfrac{1}{r_A}\right)$ | $E_p = - G \dfrac{m'm}{r}$ |
| **重力** | $W = - (m g y_2 - m g y_1)$ | $E_p = mgy$ |
| **弹性力** | $W = - \left(\dfrac{1}{2} k x_2^2 - \dfrac{1}{2} k x_1^2\right)$ | $E_p = \dfrac{1}{2} k x^2$ |

### 质点系功能原理与机械能守恒

- $W^{ex} + W^{in} = \sum E_{ki} - \sum E_{ki0}\\[1ex]$
- $W^{ex} + W^{in}_{nc} = E - E_0$

*其中 $W^{in}_{nc}$ 为非保守内力*

### 碰撞模型

- 完全弹性碰撞：如果在碰撞后，两物体的动能之和完全没有损失
- 非弹性碰撞：由于非保守力作用，机械能的损失或者增加
- 完全非弹性碰撞：两物体在非弹性碰撞后一起以相同的速度运动，动能损失最大

