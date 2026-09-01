---
title: Draft Example
published: 2022-07-01
tags: [Markdown, Blogging, Demo]
category: Examples
draft: true
---

**建议打印框架骨架与易错点，不需要打印冗长的具体题解。**

CDQ 分治和整体二分属于**算法思想/框架**，并非固定接口的数据结构。每次题目的修改、查询逻辑差异很大，但两者在递归划分、临时数组复用和树状数组清空（必须撤销修改，不可 `memset`）上有高度固定的套路，备一份标准骨架能有效防止考场写挂细节。

---

### CDQ 分治标准框架（以三维偏序为例）

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int a, b, c, cnt, ans;
} p[100005], tmp[100005];

int tree[200005], max_val;
void add(int x, int v) { for (; x <= max_val; x += x & -x) tree[x] += v; }
int query(int x) { int s = 0; for (; x; x -= x & -x) s += tree[x]; return s; }

void cdq(int l, int r) {
    if (l >= r) return;
    int mid = (l + r) >> 1;
    cdq(l, mid);
    cdq(mid + 1, r);

    // 双指针统计：左侧修改贡献给右侧查询
    int i = l, j = mid + 1, k = l;
    while (i <= mid && j <= r) {
        if (p[i].b <= p[j].b) {
            add(p[i].c, p[i].cnt);
            tmp[k++] = p[i++];
        } else {
            p[j].ans += query(p[j].c);
            tmp[k++] = p[j++];
        }
    }
    while (j <= r) {
        p[j].ans += query(p[j].c);
        tmp[k++] = p[j++];
    }
    // 关键：仅撤销左侧贡献，杜绝 memset 导致超时
    for (int t = l; t < i; t++) add(p[t].c, -p[t].cnt);
    while (i <= mid) tmp[k++] = p[i++];

    for (int t = l; t <= r; t++) p[t] = tmp[t];
}

```

---

### 整体二分标准框架（以多询问区间第 $k$ 小为例）

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Query {
    int type;      // 1: 修改/插入, 2: 询问
    int x, y, k, id;
} q[200005], q1[200005], q2[200005];

int ans[200005], tree[200005], max_n;
void add(int x, int v) { for (; x <= max_n; x += x & -x) tree[x] += v; }
int ask(int x) { int s = 0; for (; x; x -= x & -x) s += tree[x]; return s; }

// [vl, vr] 为二分的值域范围，[ql, qr] 为当前需要处理的询问/操作区间
void solve(int vl, int vr, int ql, int qr) {
    if (ql > qr) return;
    if (vl == vr) {
        for (int i = ql; i <= qr; i++)
            if (q[i].type == 2) ans[q[i].id] = vl;
        return;
    }

    int mid = (vl + vr) >> 1;
    int cnt1 = 0, cnt2 = 0;

    for (int i = ql; i <= qr; i++) {
        if (q[i].type == 1) { // 插入/修改操作
            if (q[i].y <= mid) {
                add(q[i].x, q[i].k);
                q1[++cnt1] = q[i];
            } else {
                q2[++cnt2] = q[i];
            }
        } else {              // 查询操作
            int cur = ask(q[i].y) - ask(q[i].x - 1);
            if (cur >= q[i].k) {
                q1[++cnt1] = q[i];
            } else {
                q[i].k -= cur; // 削减 k 值，落入右值域
                q2[++cnt2] = q[i];
            }
        }
    }

    // 撤销树状数组历史修改
    for (int i = 1; i <= cnt1; i++)
        if (q1[i].type == 1) add(q1[i].x, -q1[i].k);

    // 将划分好的操作序列拷回原数组并继续递归
    for (int i = 1; i <= cnt1; i++) q[ql + i - 1] = q1[i];
    for (int i = 1; i <= cnt2; i++) q[ql + cnt1 + i - 1] = q2[i];

    solve(vl, mid, ql, ql + cnt1 - 1);
    solve(mid + 1, vr, ql + cnt1, qr);
}

```

---

### 核心易错点清单

* **CDQ 分治去重：** 存在元素三维完全相同时，第一维排序后必须**先去重并记录 `cnt**`，否则左右区间划分时会遗漏相同元素的贡献。
* **数据结构复原：** 树状数组/线段树严禁全量 `memset`，必须按操作路径逐一 `add(..., -v)` 撤销。
* **整体二分 $k$ 值削减：** 查询落入右半值域 $[mid + 1, vr]$ 时，必须预先扣除左半部分产生的贡献 $k \leftarrow k - cur$。
* **稳定划分：** 归并与划分临时数组时，保持相同优先级的元素原有相对顺序不变。

---

### 核心区别一览

| 维度 | CDQ 分治 | 整体二分 |
| --- | --- | --- |
| **分治对象** | **时间/操作序列**（区间 $[l, r]$ 是下标或操作编号） | **答案值域**（区间 $[vl, vr]$ 是可能答案的范围） |
| **核心目的** | 计算**左半边修改**对**右半边查询**的累加贡献 | 将所有询问按“答案在左值域还是右值域”进行**分类** |
| **问题特征** | 贡献具备**可加性**（统计总数、偏序求和、前缀最值） | 单次询问答案具备**二分单调性**（第 $k$ 大/小、首次达标时刻） |
| **典型降维** | 将动态修改/高维偏序转化为静态结构 + 树状数组 | 将多组独立的单次二分合并为统一操作，规避主席树等复杂结构 |

---

### 1. CDQ 分治（分治时间/操作）

#### 核心思想

处理“一堆修改和查询”时，如果离线按时间顺序排好，CDQ 分治将操作序列 $[l, r]$ 从中间切成 $[l, mid]$ 和 $[mid+1, r]$：

1. 先递归处理左半部分；
2. **只计算左半部分修改（先发生的）对右半部分查询（后发生的）的影响**；
3. 再递归处理右半部分。

#### 运作流程

```
            [l, r] 操作序列
             /          \
    [l, mid] (早发生的)   [mid+1, r] (晚发生的)
           \              /
            【计算贡献】
    (只把左边的修改加进树状数组，
     用来回答右边的查询)

```

#### 典型应用场景

* **多维偏序：** 如三维偏序（第 1 维排序，第 2 维 CDQ 归并，第 3 维树状数组）。
* **动态问题转静态：** 比如支持单点加、矩形求和，把修改和查询全视作事件序列，CDQ 掉时间维后，只需维护静态一维树状数组。
* **CDQ 优化 DP：** 转移形式形如 $dp[i] = \max_{j < i} \{ dp[j] + \dots \}$ 时，先递归计算 $[l, mid]$ 的 DP 值，再将左边的 DP 状态批量转移给右边 $[mid+1, r]$，最后递归右边。

---

### 2. 整体二分（分治答案值域）

#### 核心思想

如果**单次询问可以二分答案**（比如单次二分值域 $mid$，把 $\le mid$ 的数插入树状数组，判断区间内满足条件的个数是否 $\ge k$），但有 $Q$ 次询问，逐个二分总复杂度为 $O(Q \cdot N \log V)$。

整体二分将**所有询问与修改放在一起**二分值域 $[vl, vr]$：

1. 设当前二分中心为 $mid$；
2. 仅应用值域属于 $[vl, mid]$ 的修改操作；
3. 检查当前区间 $[ql, qr]$ 中的所有询问：
* 若该询问在 $mid$ 处**已经满足条件**（如累积数量 $\ge k$），说明答案在 $[vl, mid]$，分流到左侧集合 $Q_1$；
* 若**未满足**，说明答案在 $[mid+1, vr]$，分流到右侧集合 $Q_2$（同时通常令 $k \leftarrow k - \text{当前贡献}$）；


4. 撤销数据结构的修改，递归划分 $([vl, mid], Q_1)$ 和 $([mid+1, vr], Q_2)$。

#### 运作流程

```
                 值域 [vl, vr], 询问集合 Q
                        /             \
    (修改 <= mid 入树状数组，判定 Q 中的每个询问)
                      /                 \
       答案在 [vl, mid] 的询问       答案在 [mid+1, vr] 的询问
        递归处理: [vl, mid]            递归处理: [mid+1, vr]

```

#### 典型应用场景

* **区间第 $k$ 大/小：** 不使用可持久化线段树（主席树）的离线替代解法。
* **多目标判定问题：** 例如国家陨石问题（POJ/SPOJ Meteors，每个国家需要累积 $P_i$ 陨石，求最早在第几次流星雨后达标）。

---

### 快速判断用哪个

* **看到求第 $k$ 小、第 $k$ 大、第几次操作后首次满足某种阈值：** 优先考虑**整体二分**。
* **看到动态前缀和/逆序对、矩形统计、三/四维偏序、DP 存在多维制约：** 优先考虑 **CDQ 分治**。