---
title: 大物（上）- 3
published: 2026-09-25
description: '气体动理论/热力'
image: ''
tags: [物理, 大物]
category: '大物'
draft: false 
lang: ''
pinWeight: 2
---

## 气体动理论基础

### 理想气体状态方程

- **物态方程**：
    $$pV = \nu RT$$

    *其中物质的量 $\nu = \dfrac{N}{N_{\mathrm{A}}}$，普适气体常量 $R = 8.31 \, \mathrm{J/(mol\cdot K)}$。*

### 压强的微观本质与温度解释

- **分子平均平动动能**:
    $$
    \overline{\varepsilon}_{\mathrm{k}} = \frac 1 2 m \overline{v^2}
    $$

- **压强公式**：
    $$
    p = \frac{2}{3} n \overline{\varepsilon}_{\mathrm{k}} = \frac 1 3 \rho \overline {v^2}
    $$

    *其中 $n$ 为单位体积分子数*

- **温度的微观本质**：
    $$
    \begin{cases}
        p = n k T \\[1ex]
        p = \dfrac{2}{3} n \left( \dfrac{1}{2} m \overline{v^2} \right)
    \end{cases}
    \implies \frac{1}{2} m \overline{v^2} = \frac{3}{2} k T
    $$

    *气体分子的平均平动动能与气体的温度成正比*

## 能量均分定理与理想气体内能

- **分子的平均总动能**：
    $$
    \overline{\varepsilon} = \frac i 2 k T
    $$

- **$\nu \, \mathrm{mol}$ 的理想气体内能**：
    $$
    E = \nu \frac i 2 R T
    $$

- **分子自由度 $i$ 归纳**：

| 类别 | 单原子 | 双原子 (刚性) | 双原子 (非刚性) | 三原子 (刚性) | 三原子 (非刚性) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **自由度 ($i$)** | $3(\text{平})$ | $5 = 3(\text{平}) +2(\text{转})$ | $7 = 3(\text{平}) + 2(\text{转}) + 2(\text{振})$ | $6 = 3(\text{平}) + 3(\text{转})$ | $12 = 3(\text{平}) +$<br>$3(\text{转}) + 6(\text{振})$ |

## 热力学第一定律与典型过程

### 热力学第一定律

- **体积功**：
    $$
    W = \int p \, \mathrm{d} V
    $$

- **内能增量**：
    $$
    \Delta E = \nu \dfrac i 2 R \Delta T
    $$

- **第一定律表达式**：
    $$
    Q = \Delta E + W
    $$

    *系统从外界吸收的热量，一部分使系统内能增加，另一部分使系统对外界做功*

### 四大准静态过程对比

| 过程 | 过程方程 / 特征 | 做功 $W$ | 吸热 $Q$ |
| --- | --- | --- | --- |
| **等容过程**<br> | $V = \text{常数}$<br> | $W = 0$<br> | $Q_V = \Delta E = \nu \dfrac{i}{2} R \Delta T$<br> |
| **等压过程**<br> | $p = \text{常数}$<br> | $W = p\Delta V = \nu R \Delta T$<br> | $Q_p = \Delta E + W = \nu \dfrac{i+2}{2} R \Delta T$<br> |
| **等温过程**<br> | $T = \text{常数}$，$\Delta E = 0$<br> | $W_T = \nu RT \ln\dfrac{V_2}{V_1} = \nu RT \ln\dfrac{p_1}{p_2}$<br> | $Q_T = W_T = \nu RT \ln\dfrac{V_2}{V_1}$<br> |
| **绝热过程**<br> | $\mathrm{d}Q = 0$<br><br>绝热指数 $\gamma = \dfrac{i+2}{i}$<br> | $W_a = -\Delta E = -\nu \dfrac{i}{2} R (T_2 - T_1)$<br><br>$W_a = \dfrac{p_1 V_1 - p_2 V_2}{\gamma - 1}$<br> | $Q = 0$<br> |


- **绝热过程状态方程**：$pV^\gamma = \text{常量}$、$V^{\gamma - 1}T = \text{常量}$、$p^{\gamma - 1}T^{-\gamma} = \text{常量}$。


- **$p\text{-}V$ 图斜率对比**：
    $$
    \left(\frac{\mathrm{d}p}{\mathrm{d}V}\right)_T = -\frac{p}{V}, \quad \left(\frac{\mathrm{d}p}{\mathrm{d}V}\right)_a = -\gamma \frac{p}{V}
    $$



因为 $\gamma > 1$，所以在同一点相交时，**绝热线比等温线更为陡峭**。

## 循环过程与热机

### 循环过程与热机效率

<img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Stirling_Cycle.png/500px-Stirling_Cycle.png?utm_source=zh.wikipedia.org&utm_campaign=parser&utm_content=thumbnail" alt="斯特灵循环P-V图" width="180">

一热机经过一个正循环后，由于工作物质的内能不改变，它**从高温热源吸收的热量 $Q_1$**，一部分用于对外做功 $W$，另一部分则向低温热源放热，**$Q_2$ 为向低温热源放出的热量**。这就是说，热机经历一个正循环后，吸收的热量 $Q_1$ 不能全部转化为功，转化为功的只是 $W = Q_1 - |Q_2|$。

$$
\eta = \frac{W}{Q_1} = \frac{Q_1 - \vert{}Q_2\vert{}}{Q_1} = 1 - \frac{\vert{}Q_2\vert{}}{Q_1}
$$

---

### 卡诺循环

由**两个等温过程**和**两个绝热过程**组成的理想可逆循环：

<img src="https://upload.wikimedia.org/wikipedia/commons/0/06/Carnot_cycle_p-V_diagram.svg?utm_source=zh.wikipedia.org&utm_campaign=index&utm_content=original" alt="卡诺循环的压力－体积图" width="200">

- 吸热与放热：

$$
Q_1 = \nu R T_1 \ln \dfrac {V_2} {V_1}, \quad
|Q_2| = \nu R T_2 \ln \dfrac {V_4} {V_3}
$$

- **卡诺热机效率**：
    $$
    \eta = 1 - \dfrac{T_2}{T_1}
    $$

- **卡诺制冷机致冷系数**：
    $$
    e = \dfrac {T_2}{T_1 - T_2}
    $$

---

### 卡诺定理

$$
\eta' \leq 1 - \dfrac {T_2}{T_1}
$$