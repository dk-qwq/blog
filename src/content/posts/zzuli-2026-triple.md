---
title: 2026 郑轻新生赛三带一题解
published: 2026-03-17
description: ''
image: ''
tags: [OI, 校赛, 题解]
category: '校赛题解'
draft: false 
lang: ''
pinWeight: 2
---

### 题意

给定 $13$ 种类型的扑克牌数量，求最多能组合出多少个**三带一**（指 $AAAB$ 型）。

### 题解

显然答案满足单调性，考虑如何 check

记 位置 $i$ 的 $3$ 使用了 $x_i$ 次，剩余了 $s_i = a_i - 3 \times x_i$ 张牌

答案为 $ans = \sum x_i$ ，一共剩余了 $S = \sum s_i$ 张

考虑配对的情况，使用 [Hall 定理](https://oi-wiki.org/graph/graph-matching/graph-match/#hall-%E5%AE%9A%E7%90%86)

对于位置 $i$ ，其 $|N(\left\{ i \right\})|$ 显然为 $S - s_i$

对于 多位置，其 $\left| N(\left\{ i \right\}) \cap N(\left\{ j \right\}) \cap \cdots \right| = S$

分别可得 $x_i \leq S - s_i$ ， $\sum x_i \leq S$

后者取最大转化为 $\sum x_i = ans \leq (\sum a_i - 3 \times x_i) = \sum a_i - 3 \times ans$ 即 $ans \leq \frac {\sum a_i} 4$

前者转化为 $x_i \leq (\sum a_i - 3 \times ans) - (a_i - 3 \times x_i)$ 即 $2 \times x_i \geq 3 \times ans + a_i - \sum a_i$

又有限制条件 $3 \times x_i \leq a_i$

综上可得 $\left \lceil {\frac {3 \times ans + a_i - \sum a_i} 2} \right \rceil \leq x_i \leq \left \lfloor {\frac {a_i} 3} \right \rfloor$

检查 $\sum x_i$ 范围内是否有 $x$ 即可

```cpp collapse={1-45}
#include<bits/stdc++.h>
using namespace std;

void solve() {
    int n = 13;
    vector<int> a(n + 1);
    int sum = 0;
    for (int i = 0; i < n; i ++ ) {
        cin >> a[i];
        sum += a[i];
    }
    int l = 0, r = sum / 4;

    auto check = [&](int x) {
        int R = 0, L = 0;
        for (int i = 0; i < n; i ++ ) {
            int Y = a[i] / 3;
            int X = max(0, (a[i] - sum + 3 * x));
            X = (X + 1) / 2;
            if (X > Y) return false;
            R += Y;
            L += X;
        }
        if (L <= x && x <= R) {
            return true;
        }
        return false;
    };

    while (l < r) {
        int mid = (l + r + 1) >> 1;
        if (check(mid)) {
            l = mid;
        } else {
            r = mid - 1;
        }
    }
    cout << l << endl;
}

int main() {
    int T = 1;
    cin >> T;
    while (T-- ) solve();
}
```