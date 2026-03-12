---
title: 2025 SDCPC 省赛题解
published: 2026-03-12
description: 'AGEC的题解'
image: ''
tags: [OI, XCPC, 题解]
category: 'XCPC题解'
draft: false 
lang: ''
pinWeight: 2
---

[题面链接](https://qoj.ac/download.php?type=attachments&id=2040&r=1) / [补题链接](https://qoj.ac/contest/2040)

## A. 项目管理


### 题意

* 有 $n$ 名员工，第 $i$ 名员工的职级为 $a_i$。现在需要选择尽量多的人，限制条件为：如果选择了员工 $i$，则被选中的所有人里至多只能有 $b_i$ 个人职级大于 $a_i$。
* $n \le 2 \times 10^5$。

### 题解

显然存在单调性，考虑如何 check(x)

* 如果从大到小考虑职级，当前选的人数会影响后面的选择，故从小到大考虑职级
* 发现如果能选职级较低的一定更优，故从小到大考虑职级

由上可以考虑到当前职级选最多的一定更优

假设之前选定了 $s$ 个人，那么当前职级选人需要满足的条件为 $\min_{i \in S} b_i \geq x - s - |S|$，$\min_{i \in S} b_i + |S|$ 不断尝试加入次大值即可，故按照 $b_i$ 从大到小 贪心 选择

```cpp collapse={1-55}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int N = 2e5 + 5;
int n, a[N], b[N], p[N];
bool check(int x, bool debug = false) {
    int ans = 0;
    for(int i = 1; i <= n; i++) {
        int l = i, r = i;
        while(r + 1 <= n && a[p[r + 1]] == a[p[i]]) r++;

        int cnt = 0;
        for(int j = l; j <= r; j++) {
            if(x - ans - (r - j + 1) <= b[p[j]] && (r - j + 1) + ans <= x) {
                if(debug) cout << p[j] << ' ';
                ans++;
            }
        }

        i = r;
    }
    if(debug) cout << endl;
    return ans == x;
}
void solve() {
    cin >> n;
    for(int i = 1; i <= n;i ++) cin >> a[i] >> b[i], p[i] = i;
    sort(p + 1, p + 1 + n, [](int p1, int p2){
        if(a[p1] == a[p2]) return b[p1] < b[p2];
        return a[p1] < a[p2];
    });

    // for(int i = 1; i <= n;i ++) cout << p[i] << " \n"[i == n];

    // cout << check(10) << endl;
    // return ;

    int l = 1, r = n, mid;
    while(l < r) {
        mid = (l + r + 1) >> 1;
        if(check(mid)) l = mid;
        else r = mid - 1;
    }
    cout << l << endl;
    check(l, true);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    // freopen("A.in", "r", stdin);
    // freopen("A.out", "w", stdout);
    int T = 1;
    cin >> T;
    while(T--) solve();
}
```

## G. 装配线

### 题意

* $k$ 名工人加工 $n$ 个工件，第 $i$ 个工件在第 $t_i$ 分钟的开头加入工人 $w_i$ 的收件箱。
* 每分钟，工人从收件箱里拿出一个工件，完成加工后放入下一个工人的收件箱（如果是最后一名工人则加工完成）。问所有工件加工完成需要几分钟。
* $k \le 10^9$，$n \le 2 \times 10^5$。

### 题解

对于每个工人有一个加工列表（按照 到达时间排列）

考虑工人 $k$ 转移到 工人 $k + 1$ ，工人 $k + 1$ 的加工列表就是工人 $k$ 的列表全体 $+1$

考虑维护时间差 $delta$ ，工人 $k + 1$ 新加入的工件时间应为 $t_i - delta$ ，查询的时候还原 $+delta$ 即可

加工列表的时间不能重复，所以将相邻的时间段合并，每次插入 $t_i$ ，把 $t_i$ 改为对应时间段的 $r + 1$ 即可

最终答案即为 $\max \left\{ l_i, r_i \right\} + delta$

但是我场上忽略了 修改后的时间段可以小于 $0$ ，导致二分维护的部分和最终答案部分双双出锅

```cpp collapse={1-72}
#include <bits/stdc++.h>
#include <cassert>
using namespace std;
using ll = long long;
const ll inf = 2e16;
using pii = pair<ll, ll>;
const int N = 2e5 + 5;
string s;
int n, k;
map<int, vector<ll>> _map;
set<pii> _S; // 维护一个反向的颜色段？
void insert(ll val) {
    auto it = _S.lower_bound({val, -inf});
    ll l = val, r = val;
    if(it != _S.begin()) {
        auto lit = (it);
        lit--;
        if(lit->first == l - 1) {
            l = lit->second;
            _S.erase(lit);
        }
    }
    if(it != _S.end()) {
        if(it->second == r + 1) {
            r = it->first;
            _S.erase(it);
        }
    }
    // cout << "insert: " << l << ' ' << r << endl;
    _S.insert({r, l});
}
void solve() {
    cin >> n >> k;
    _S.clear();
    _map.clear();
    for(int i = 1; i <= n; i++) {
        int w, t; cin >> w >> t;
        _map[w].push_back(t);
    }
    _map[k];

    ll detal = 0, last = 1;
    for(auto [w, vec]: _map) {
        detal += w - last;
        last = w;
        for(auto tt: vec) {
            // cout << tt << endl;
            ll t = tt - detal;
            auto it = _S.lower_bound({t, -inf});
            if(it == _S.end()) insert(t);
            else if(it->second <= t) insert(it->first + 1);
            else {
                insert(t);
            }
        }
    }
    ll ans = -inf;
    for(auto [r, l]: _S) {
        ans = max(ans, max(l, r));
    }
    cout << ans + detal << endl;
}
int main() {

    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    // freopen("A.in", "r", stdin);
    // freopen("A.out", "w", stdout);
    int T = 1;
    cin >> T;
    while(T--) solve();
}
```

### 解法1

工件 $i$ 完成时间为 $(t_i + k - w_i)$

工件 $i$ 的完成时间为 $a_i$ ，工件 $j$ 的完成时间为 $a_j$ ，那么 $i$ 最多让 $j$ 延误到 $\max(a_i + 1, a_j)$

那么将 $a_i$ 从小到大排序之后依次更新 $a_i = \max(a_i, a_{i - 1} + 1)$ 即可

## E. 最大公因数

### 题意

* 给定正整数序列 $a_i$，进行恰好 $k$ 次操作，每次操作选一个元素加一。最大化所有元素的最大公因数。
* $n, \max a_i \le 10^6$，$k \le 10^{12}$。

### 题解

令 $g$ 为答案，那么有 $k_i g = (a_i + d_i) $ ，又因 $\sum d_i = k$ ，故 $k = \sum k_i g - a_i$ ，$g | (k + \sum a_i)$

枚举 $(k + \sum a_i)$ 的因数，可以在 $\Omicron (\sqrt k)$ 做到

考虑如何 check 合法性，即 $\sum (-a_i \mod g) \leq k$

* 若 $g \leq \max a_i$，发现 完全不会
* 若 $g > \max a_i$ ，那么答案就为 $g \times n - \sum a_i$

$\Omicron (n)$ 显然无法处理第一种情况，考虑预处理每个 $g$ 的情况 ，形如情况 $2$ 的做法显然在此适用于连续的一段区间

对于所有 在这个 $(k \times g, (k + 1) \times g]$ 区间内的 $a_i$  ，直接 $(k + 1) \times g \times (r - l + 1) - \sum a_i$ ，最终求和即可，复杂度 $\Omicron (g \log \max a_i)$

至此，可以实现 $\Omicron (1)$ 的 check

总复杂度 $\Omicron (\sqrt{k + \sum a_i} + \max a_i \log \max a_i)$

```cpp collapse={1-56}
#include <bits/stdc++.h>
#include <cassert>
#define debug(x) cout << #x << ": " << x << endl
using namespace std;
using ll = long long;
const int N = 1e6 + 5;
string s;
int n;ll k;
ll a[N], pre[N];
ll f[N];
bool check(ll g) {
    if(g > a[n]) {
        return g * n - pre[n] <= k;
    }
    return f[g] <= k;
}
void solve() {
    cin >> n >> k;
    for(int i = 1; i <= n; i++) cin >> a[i];
    sort(a + 1, a + 1 + n);
    for(int i = 1; i <= n; i++) pre[i] = pre[i - 1] + a[i];

    for(int g = 1; g <= a[n]; g++) {
        f[g] = 0;
        int l = 1, r = -1, k = 0;
        while(l <= n) {
            while(a[l] > (k + 1) * g) k++;

            r = lower_bound(a + l, a + 1 + n, 1ll * (k + 1) * g + 1) - a;
            r = min(r, n);
            while(l <= r - 1 && a[r] > 1ll * (k + 1) * g) r--;
            
            f[g] += 1ll * (k + 1) * g * (r - l + 1) - (pre[r] - pre[l - 1]);
            l = r + 1, k++;
        }
    }

    ll S = pre[n] + k;

    ll ans = 1;
    for(ll g = 1; g * g <= S; g++) {
        if(S % g) continue;
        if(check(g)) ans = max(ans, g);
        if(check(S / g)) ans = max(ans, S / g);
    }
    cout << ans << endl;
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    // freopen("A.in", "r", stdin);
    // freopen("A.out", "w", stdout);
    int T = 1;
    cin >> T;
    while(T--) solve();
}
```

## C. 括号整数

### 题意

* 用 $0 \sim 9$ 表示括号的种类，称一个整数 $b_1b_2 \cdots b_n$ 是**括号整数**，若存在一个合法括号序列，使得第 $i$ 个括号的种类是 $b_i$。给一个整数 $A$，求小于等于它的最大括号整数。
* $11 \le A \le 10^{2 \times 10^5}$。

### 题解

从前往后放显然不可做，所以考虑从原始状态一次次撤销

枚举答案与 $A$ 的最长公共前缀 $P = p_1 p_2 \cdots p_k$ ，再从 $a_{k+1} - 1$ 到 $1$ 枚举第 $(k + 1)$ 位，假设为 $d$

发现括号匹配操作栈是可以撤销的，那么我们可以得到 $Pd$ 的 括号匹配栈

由于 $d \le a_{k + 1}$ ，故 $k + 1$ 后面的数字可以随便选择，最大即为 $Pd999 \cdots 9 + \text{操作栈的倒序}$ ,其中 $9$ 应为 偶数个

前缀越长，显然更大，如果找到直接输出即可

注意前缀为空的时候下界不能为 $0$ 而是 $1$

如果找不到，那么答案为 $999\cdots 99$ （偶数个 $9$ ，数量小于 $|A|$）


```cpp collapse={1-79}
#include <bits/stdc++.h>
#include <string>
using namespace std;
using ll = long long;
const int N = 2e5 + 5;
string s;
int n;
int st[N], len;
void push(int x) {
    if(len && st[len] == x) len--;
    else st[++len] = x;
}
void pop(int x) {
    if(len == 0 || st[len] != x) st[++len] = x;
    else len--;
}
void print() {
    cout << "st: " << endl;;
    for(int i = 1; i <= len; i++) cout << st[i] << " \n"[i == len];
    cout << "-------" << endl;
}
void solve() {
    cin >> s;
    len = 0;
    for(auto c: s) push(c - '0');
    if(len == 0) {
        cout << s << endl;
        return ;
    }

    bool debug = false;

    for(int p = s.size() - 2; p >= -1; p--) {
        // [0, p]
        pop(s[p + 1] - '0');

        if(p == 2) debug = true;

        for(int i = s[p + 1] - '0' - 1; i >= (p == -1? 1: 0); i--) {
            push(i);
            int siz = (p - 0 + 1) + 1 + len;

            // if(debug) {
            //     cout << i << ' ' << len << endl;
            //     for(int j = 1; j <= len; j++)  cout << st[j] << endl;
            // }

            if(s.size() >= siz && (s.size() - siz) % 2 == 0) {
                for(int j = 0; j <= p; j++) cout << s[j];
                cout << i;
                cout << string(s.size() - siz, '9');
                for(int j = len; j >= 1; j--) cout << st[j];
                cout << endl;
                return ;
            }
            pop(i);
        }

        if(p == 2) debug = false;
    }
    int cnt = (s.size() - 1) / 2 * 2;
    cout << string(cnt, '9') << endl;
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    // freopen("A.in", "r", stdin);
    // freopen("A.out", "w", stdout);
    int T = 1;
    cin >> T;
    while(T--) solve();
}

// push normal
/*
pop: x
    top == x: pop x
    top != x: push x
*/
```
