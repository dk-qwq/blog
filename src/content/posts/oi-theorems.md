---
title: OI 常用定理
published: 2026-03-17
description: ''
image: ''
tags: [OI]
category: ''
draft: false 
lang: ''
pinWeight: 2
---

## Dilworth 定理

### 二元关系

集合 $X, Y$ 满足 图关系 $G(R) \subseteq X \times Y$ ，那么称 $R$ 是 $X$ 和 $Y$ 之间的一个 **二元关系**。

定义如下性质：

$xRy$ 成立当且仅当 $(x,y)\in G(R)$ 。

1.  自反性（reflexive）：$(\forall~a \in S)~~aRa$
2.  反对称性（antisymmetric）：$(\forall~a,b \in S)~~(aRb \land bRa) \implies a=b$
3.  传递性（transitive）：$(\forall~a,b,c \in S)~~(aRb \land bRc) \implies aRc$

### 偏序集

若集合 $S$ 上的一个二元关系 $\preceq$ 具有 **自反性**、**反对称性**、**传递性**，则称 $S$ 是 **偏序集** ，$\preceq$ 为其上一 **偏序**。

### 链与反链

对偏序集 $S$ 和其上的偏序 $\preceq$，称 $S$ 的全序子集为 **链**。若 $S$ 的子集 $T$ 中任意两个不同元素均不可比（即 $(\forall~a,b \in T)~~a \neq b \implies (a \npreceq b \land b \npreceq a)$），则称 $T$ 为 **反链**。

### Dilworth 定理

对有限偏序集 $S$ 和其上的偏序 $\preceq$，我们有：

:::tip[Dilworth 定理]
$S$ 的宽度（最长反链长度）等于最小的链覆盖数．
:::

### 例题

#### [NOIP1999 提高组 导弹拦截](https://www.luogu.com.cn/problem/P1020)

> 求有最少多少个递减子序列覆盖一个序列。
>
> 定义偏序 $a \preceq b = (a \leq b \land h_a \geq h_b)$
> 
> 那么依此求最长反链，即最长递增子序列长度。


#### [[TJOI2015] 组合数学](https://www.luogu.com.cn/problem/P3974)

> 给定 $n \times m$ 方格，每个方格上有一个价值，只能向右或者下行走，每次经过只能拿走 $1$ 价值，求问最少需要多少次才能把所有格子上的价值都拿走。
>
> 定义偏序 $\preceq$ 为 向右，向下可达的关系。
> 
> 那么 $(a \npreceq b \land b \npreceq a)$ 仅有 右上，左下的关系
>
> 那么可得 $dp_{i, j} = \max \left\{ {dp_{i - 1, j + 1} + a_{i, j}, dp_{i - 1, j}, dp_{i, j + 1}} \right\}$

---

## Hall 定理

假设 $G=(X,Y,E)$ 是二分图，且 $|X|\le |Y|$．对于图 $G$ 的一个匹配 $M$，如果 $X$ 中的所有顶点都是匹配点，那么就称 $M$ 是一个 **$X$‑完美匹配**。

:::tip[Hall 定理]
假设 $G=(X,Y,E)$ 是二分图，且 $|X|\le |Y|$．对于任何 $W\subseteq X$，记 $N_G(W)$ 为图 $G$ 中所有与 $W$ 中的顶点相邻的顶点集合．那么，$X$‑完美匹配存在，当且仅当 $|W|\le |N_G(W)|$ 对于所有 $W\subseteq X$ 都成立．
:::
