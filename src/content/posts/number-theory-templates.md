---
title: 来点数论板子
published: 2026-08-27
description: ''
image: ''
tags: ['XCPC', '板子']
category: 'OI'
draft: false 
lang: ''
pinWeight: 2
---

## 线性筛

```cpp
#include <vector>

const int MAXN = 1e7 + 5;

std::vector<int> primes;
int min_p[MAXN]; // 最小质因数 (min prime factor)
int mu[MAXN];    // 莫比乌斯函数
int phi[MAXN];   // 欧拉函数
bool is_prime[MAXN];

void sieve(int n) {
    std::fill(is_prime + 2, is_prime + n + 1, true);
    mu[1] = 1;
    phi[1] = 1;
    min_p[1] = 1;

    for (int i = 2; i <= n; ++i) {
        if (is_prime[i]) {
            primes.push_back(i);
            min_p[i] = i;
            mu[i] = -1;
            phi[i] = i - 1;
        }
        for (int p : primes) {
            if (i * p > n) break;
            
            is_prime[i * p] = false;
            min_p[i * p] = p;

            if (i % p == 0) {
                // p 是 i 的因数，p 也是 i * p 的最小质因数
                mu[i * p] = 0;
                phi[i * p] = phi[i] * p;
                break; // 保证每个合数只被其最小质因数筛去
            } else {
                // p 与 i 互质
                mu[i * p] = -mu[i];
                phi[i * p] = phi[i] * (p - 1);
            }
        }
    }
}
```

---

## 莫比乌斯与欧拉反演

$$
\begin{aligned}
[n = 1] &= \sum_{d \mid n} \mu(d) & \qquad\qquad n &= \sum_{d \mid n} \varphi(d)
\end{aligned}
$$

---

$$
\lceil \frac n i \rceil = \lfloor \frac {n - 1}  i \rfloor + 1
$$

---

## 拉格朗日反演

* **标准模型**：若方程满足 $F(x) = x\Phi(F(x))$（其中 $\Phi(0) \neq 0, F(0) = 0$），则：

$$[x^n] H(F(x)) = \frac{1}{n} [t^{n-1}] H'(t) \Phi(t)^n$$