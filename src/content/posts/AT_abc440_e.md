---
title: AT_abc440_e
published: 2026-01-16
description: '背包的k优解'
image: ''
tags: [abc题解, OI]
category: 'abc题解'
draft: false 
lang: ''
---

[原题链接](https://atcoder.jp/contests/abc440/tasks/abc440_e)

## Problem Statement

There are $10^{100}$ cookies of each of $N$ types. The deliciousness per cookie of the $i$\-th type is $A_i$.

You will choose a total of $K$ cookies from these. Two ways of choosing cookies are considered the same if and only if the multisets of types of chosen cookies match.

For each of the $\binom{N+K-1}{K}$ ways of choosing, consider the sum of deliciousness of the chosen cookies. Let $S_1,S_2,\dots$ be these sums in descending order, with duplicates included. Find $S_1,\dots,S_X$.

### 简要题意

有 $n$ 个价值为 $A_i$ 的物品，每个物品无个数限制，求选 $k$ 个物品的 前 $X$ 大价值

## 题解

我们可以根据当前最大方案依次推导小于当前价值的方案

对 ${A_i}$ 从大到小排序，

$A_1 \rArr A_2 \rArr A_3$ 等价与 $A_1 \rArr A_3$ ，那么我们记录 $A_1$ 的数量，每次下放只下放 $A_1$，总价值 $-A_1 + A_i$

又因求前 $X$ 大，所以每次只下放一个即可，且 $A_1 \rArr A_2, A_1 \rArr A_3$ 的操作顺序一定是先 $A_2$ 再 $A_3$ 的，那么我们记录当前下放的最大值，就可以使得小值不会拓展到大值

复杂度 $\Omicron(X n \log (X n))$ ， [提交链接](https://atcoder.jp/contests/abc440/submissions/72481003)

```cpp collapse={1-34}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int N = 1e5 + 5;

int n, m, k;
ll a[N];
priority_queue<array<ll, 3>> _S;
void solve() {
    cin >> n >> m >> k;
    for(int i = 1; i <= n; i++) cin >> a[i];
    sort(a + 1, a + 1 + n, greater());
    _S.push({a[1] * m, m, 2});
    while(k > 0) {
        auto [val, m, c] = _S.top(); _S.pop();
        cout << val << endl;
        k--;

        if(m > 0) {
            for(int i = c; i <= n; i++)
                _S.push({val - a[1] + a[i], m - 1, i});
        }
    }
    assert(k == 0);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    // freopen("A.in", "r", stdin);
    // freopen("A.out", "w", stdout);
    int T = 1;
    // cin >> T;
    while(T--) solve();
}
```

## 复杂度更优的解

但是，这样的复杂度还是太坏了，在 $n$ 较大的时候很容易T掉
可以发现我们每次拓展都是拓展了 $n$ 个，且如果 $A_n$ 比较小的时候，拓展到这里显然是没有用的，我们可以考虑先拓展相邻的，等下一次拓展再到后面

更为形式化的： $A_1 \rArr A_3$ 可以变为 $A_1 \rArr A_2 \rArr A_3$

且我们拓展到 $A_2$ 的时候一定是不劣的

考虑记录上一次转移了多少，以及当前转移了多少；每次尝试转移到当前层或者直接转移到下一层即可

由于每次只拓展 $2$ 个，所以我们的复杂度上限为 $\Omicron(X \log (2X))$ ，[提交链接](https://atcoder.jp/contests/abc440/submissions/72482456)

```cpp collapse = {1-38}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int N = 1e5 + 5;

int n, m, k;
ll a[N];
priority_queue<array<ll, 4>> _S; // val, c, cur, pre
void solve() {
    cin >> n >> m >> k;
    for(int i = 1; i <= n; i++) cin >> a[i];
    sort(a + 1, a + 1 + n, greater());
    _S.push({a[1] * m, 2, 0, m});
    while(k > 0) {
        auto [val, c, cur, pre] = _S.top(); _S.pop();
        cout << val << endl;
        k--;

        if(m > 0) {
            if(pre > 0) {
                _S.push({val - a[c - 1] + a[c], c, cur + 1, pre - 1});
            }
            if(cur > 0 && c + 1 <= n) {
                _S.push({val - a[c] + a[c + 1], c + 1, 1, cur - 1});
            }
        }
    }
    assert(k == 0);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    // freopen("A.in", "r", stdin);
    // freopen("A.out", "w", stdout);
    int T = 1;
    // cin >> T;
    while(T--) solve();
}
```
