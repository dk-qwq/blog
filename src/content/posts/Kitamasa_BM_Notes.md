---
title: Kitamasa 与 BM 算法学习笔记
published: 2026-03-21
description: ''
image: ''
tags: [OI]
category: ''
draft: false 
lang: ''
pinWeight: 2
---

:::note
下文的序列均为 $0$-index
:::

## Kitamasa 算法

> 序列 $\left\{ a_i \right\}$ 满足 $a_n = \sum_{j = 0}^{k - 1} c_j a_{n - k + j}$ ，求 $a_m$

显然序列中任意项都能满足存在 $c_j$ 使得 $a_n = \sum_{j = 0}^{k - 1} c_j a_j$ ，令 $F_n = \left\{ c_j \right\}$

$F_{n} = \sum_{j = 0}^{k - 1} a_j F_{j}$ ，$F_{m} = \sum_{j = 0}^{k - 1} b_j F_{j}$ ，考虑如何计算 $F_{n + m}$

$F_{n + m} = \sum_{j = 0}^{k - 1} a_j F_{m + j}$ ，$F_{m + j}$ 仅有 $k$ 种，尝试递推

考虑多项式形式， $F_n = x^n = \sum_{j = 0}^{k - 1} a_j x^j$

$$
\begin{align*}
F_{m + 1} &= F_m \times x^1 = \sum_{j = 0}^{k - 1} b_j x^{j + 1} \\
&= \sum_{j = 1}^{k - 1} b_{j - 1} x^{j} + b_{k - 1} x^k \\
&= \sum_{j = 1}^{k - 1} b_{j - 1} x^{j} + b_{k - 1} F_k
\end{align*}
$$

（$F_k$ 即初始给定的递推数列），位移再叠加即可，复杂度 $\Omicron (k^2)$

现在我们有了 $F_n, F_m \to F_{n + m}$ ，那么就能使用快速幂 $F_m = \sum F_{2^i}$ 完成 $\Omicron (k^2 \log n)$ 的实现

但是我们还需要单位元 和 基础底数

- 单位元，即 $F_0 = x^0 = \begin{bmatrix} 1 & 0 & 0 & \dots & 0 \end{bmatrix}$
- 基础底数，即 $F_1 = x_1 = \begin{bmatrix} 0 & 1 & 0 & \dots & 0 \end{bmatrix}$


```cpp collapse={1-31}
ll kitamasa(const vector<ll>& coef, const vector<ll>& a, ll n) {
    if(n < (int)a.size()) return a[n];

    int k = coef.size();
    assert(k != 0);

    auto compose = [&](const vector<ll>& A, const vector<ll>& _B) -> vector<ll> {
        vector<ll> B = _B;
        vector<ll> C(k);
        for(auto v: A) {
            for(int j = 0; j < k; j++) (C[j] += v * B[j] % mod) %= mod;

            ll back = B.back();
            for(int j = k - 1; j >= 1; j--)
                B[j] = (B[j - 1] + back * coef[j] % mod) % mod;
            B[0] = back * coef[0] % mod;
        }

        return C;
    };

    vector<ll> res_c(k), c(k);
    res_c[0] = 1, c[1] = 1;
    while(n) {
        if(n & 1ll) res_c = compose(res_c, c);
        n >>= 1, c = compose(c, c);
    }
    ll res = 0;
    for(int j = 0; j < k; j++) (res += res_c[j] * a[j] % mod) %= mod;
    return res;
}
```

### 例题

#### [T - フィボナッチ ](https://atcoder.jp/contests/tdpc/tasks/tdpc_fibonacci)

> $a_1 = a_2 = ... = a_K = 1$
> 
> $a_i$ = $a_{i-1}$ + ... + $a_{i-K} (i > K)$
> 
> $a_N$ を mod 1,000,000,007 で求めよ。
> 
> $2 ≤ K ≤ 1000, 1 ≤ N ≤ 10^9$
>
> [submission](https://atcoder.jp/contests/tdpc/submissions/74256174)

## Berlekamp-Massey 算法

> 给定一个数列 $\left\{ a_i \right\}$，求满足 $a_n = \sum_{j = 0}^{k - 1} c_j a_{n - k + j}$ 的最短递推关系（即阶数 $k$ 最小）

延用但略有不同于 [kitamasa](#kitamasa-算法) 中的记号：$F_n = \left\{ f_j \right\}$ 使得 $a_n = \sum_{j = 0}^{k - 1} f_j a_{n - j}$

初始时 $F_0 = \left\{ \right\}$

考虑按顺序递推，若 $F_{i - 1}$ 也适用于 $a_i$ ，则 $F_i = F_{i - 1}$ ，否则令 $D_i = a_i - \sum_{j = 0}^{k - 1} f_j a_{i - 1 - j}$

递推过程中不可能只存在于一个错误，否则数列类似于 $0, 0, \dots, 0, 1$ ，无正确递推关系

对于数列中的第一个错误，显然无论如何调整都无法使得 $F_m$ 存在，令此时 $F_m$ 为 $m + 1$ 个 $0$ 方便后续使用（ $0$-index ）

设某次的位置为 $preI$ ，误差为 $preD$ ，那么有
$preD = a_{preI} - \sum_{j = 0}^{k' - 1} f'_j a_{preI - 1 - j}$

当前位置：

$$
\begin{align*}
a_i &= \sum_{j = 0}^{k - 1} f_j a_{i - 1 - j} + D_i \\
&= \sum_{j = 0}^{k - 1} f_j a_{i - 1 - j} + \frac {D_i} {preD} (a_{preI} - \sum_{j = 0}^{k' - 1} f'_j a_{preI - 1 - j})
\end{align*}
$$

设 $bias = i - preI$

那么新 $F_n$ 的长度为 $\max (bias + k', k)$

显然 有 $k'$ 单调且斜率小于等于 $1$ ， $preI$ 单调且斜率为 $1$ ，故 $k' - preI$ 单调不增，每次仅记录上一次的 错误点 即可满足 阶数最小

```cpp collapse={1-128}
#include <bits/stdc++.h>
#include <cassert>
#define print(vec) print_v(#vec, vec)
#define debug(x) cout << #x << ": " << x << endl
using namespace std;
using ll = long long;
const ll mod = 998244353;
ll qpow(ll x, ll k) {
    ll res = 1;
    while(k) {
        if(k & 1ll) res = res * x % mod;
        x = x * x % mod, k >>= 1;
    }
    return res;
}
ll Inv(ll x) {
    return qpow(x, mod - 2);
}

template<typename T>
void print_v(string name, const vector<T>& vec) {
    cout << name << ": " << endl;
    for(auto v: vec) cout << v << ' ';
    cout << endl;
}

ll kitamasa(const vector<ll>& coef, const vector<ll>& a, ll n) {
    if(n < (int)a.size()) return a[n];

    int k = coef.size();
    assert(k != 0);

    auto compose = [&](const vector<ll>& A, const vector<ll>& _B) -> vector<ll> {

        vector<ll> B = _B;
        vector<ll> C(k);
        for(auto v: A) {
            for(int j = 0; j < k; j++) (C[j] += v * B[j] % mod) %= mod;

            ll back = B.back();
            for(int j = k - 1; j >= 1; j--)
                B[j] = (B[j - 1] + back * coef[j] % mod) % mod;
            B[0] = back * coef[0] % mod;
        }

        return C;
    };

    vector<ll> res_c(k), c(k);
    res_c[0] = 1, c[1] = 1;
    while(n) {
        if(n & 1ll) res_c = compose(res_c, c);
        n >>= 1, c = compose(c, c);
    }
    ll res = 0;
    for(int j = 0; j < k; j++) (res += res_c[j] * a[j] % mod) %= mod;
    return res;
}

vector<ll> BM(const vector<ll>& a) {
    int preI = -1; ll preD = 0;
    vector<ll> coef, pre_c, tmp;
    for(int i = 0; i < (int)a.size(); i++) {
        ll D = a[i];
        for(int j = 0; j < (int)coef.size(); j++)
            (D -= coef[j] * a[i - j - 1] % mod) %= mod;
        D = (D + mod) % mod;

        if(D == 0) continue;

        if(preI < 0) {
            coef = vector(i + 1, 0ll);
            preI = i;
            preD = D;
            continue;
        }

        int bias = i - preI;
        int oldlen = coef.size();
        int newlen = bias + pre_c.size();
        if(newlen > oldlen) {
            tmp = coef;
            coef.resize(newlen);
        }

        ll Delta = D * Inv(preD) % mod;
        (coef[bias - 1] += Delta) %= mod;
        for(int j = 0; j < (int)pre_c.size(); j++) {
            (coef[bias + j] -= Delta * pre_c[j] % mod) %= mod;
        }

        if(newlen > oldlen) {
            pre_c = std::move(tmp);
            preI = i;
            preD = D;
        }
    }
    return coef;
}


ll guessNth(const vector<ll>& a, ll n) {
    vector<ll> coef = BM(a);

    for(auto v: coef) cout << (v + mod) % mod << ' ';
    cout << endl;

    ranges::reverse(coef);
    ll res = kitamasa(coef, a, n);
    return (res + mod) % mod;
}

void solve() {
    int n, m;
    cin >> n >> m;
    vector<ll> a(n);
    for(auto& v: a) cin >> v;
    cout << guessNth(a, m) << endl;
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

> 关于插入上一次错误的实现细节：
> 
> $a_preI$ 相对于 $a_i$ 的位置 实际为 $bias - 1$ （因为 $0$-index）
>
> $f'_j a_{preI - 1 - j}$ 的系数简单从 $(bias - 1) + 1$ 开始就行了


### 例题

#### [P5487 【模板】Berlekamp–Massey 算法](https://www.luogu.com.cn/problem/P5487)

> 
> [submission](https://atcoder.jp/contests/tdpc/submissions/74256174)

## 参考资料
1. [Kitamasa 算法：更快地计算线性递推的第 n 项](https://zhuanlan.zhihu.com/p/1964051212304364939)
2. [如何预测数列的下一项？Berlekamp-Massey 算法](https://zhuanlan.zhihu.com/p/1966417899825665440)