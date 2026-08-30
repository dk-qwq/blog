---
title: 来点神秘板子
published: 2026-08-30
description: ''
image: ''
tags: ['XCPC', '板子']
category: 'OI'
draft: false 
lang: ''
pinWeight: 2
---


## dsu on tree

```cpp
#include <bits/stdc++.h>
#include <cassert>
using namespace std;
using ll = long long;
const int N = 1e5 + 5;
vector<vector<int>> g;

int id[N], L[N], R[N], idx;
int siz[N], son[N], fa[N];
int node[N];
void dfs1(int u, int f) {
    fa[u] = f, siz[u] = 1;

    id[u] = ++idx;
    node[idx] = u;
    L[u] = idx;
    for(auto v: g[u]) {
        if(v == f) continue;
        dfs1(v, u);
        siz[u] += siz[v];
        if(siz[son[u]] < siz[v]) son[u] = v;
    }
    R[u] = idx;
}

int cnt[N];
map<int, ll> _M; // cnt, \sum col
int col[N];
ll ans[N];
void add(int x) {
    _M[cnt[col[x]]] -= col[x];
    cnt[col[x]]++;
    _M[cnt[col[x]]] += col[x];
}
void del(int x) {
    _M[cnt[col[x]]] -= col[x];
    cnt[col[x]]--;
    _M[cnt[col[x]]] += col[x];
}
ll getans() {
    // cout << "----------" << endl;
    // for(auto [k, v]: _M) cout << k << ' ' << v << endl;
    // return 0;
    while((--_M.end())->second == 0) _M.erase(--_M.end());
    return _M.rbegin()->second;
}

void dfs2(int u, bool keep) {
    for(auto v: g[u]) {
        if(v == fa[u] || v == son[u]) continue;
        dfs2(v, false);
    }
    if(son[u]) dfs2(son[u], true);
    for(auto v: g[u]) {
        if(v == fa[u] || v == son[u]) continue;
        for(int i = L[v]; i <= R[v]; i++) add(node[i]);
    }
    add(u);
    ans[u] = getans();
    if(!keep) {
        for(int i = L[u]; i <= R[u]; i++) del(node[i]);
    }
}
int n;
void solve() {
    cin >> n;
    g.resize(n + 1);
    for(int i = 1; i <= n; i++) cin >> col[i];
    for(int i = 1; i < n; i++) {
        int x, y; cin >> x >> y;
        g[x].push_back(y);
        g[y].push_back(x);
    }
    dfs1(1, -1);
    dfs2(1, false);
    for(int i = 1; i <= n; i++)
        cout << ans[i] << " \n"[i == n];
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

---

## tree-hash

```cpp
#include <cctype>
#include <iostream>
#include <random>
#include <set>
#include <vector>

using ull = unsigned long long;

const ull mask = std::mt19937_64(time(nullptr))();

ull shift(ull x) {
  x ^= mask;
  x ^= x << 13;
  x ^= x >> 7;
  x ^= x << 17;
  x ^= mask;
  return x;
}

constexpr int N = 1e6 + 10;

int n;
ull hash[N];
std::vector<int> edge[N];
std::set<ull> trees;

void getHash(int x, int p) {
  hash[x] = 1;
  for (int i : edge[x]) {
    if (i == p) {
      continue;
    }
    getHash(i, x);
    hash[x] += shift(hash[i]);
  }
  trees.insert(hash[x]);
}

using std::cin;
using std::cout;

int main() {
  cin.tie(nullptr)->sync_with_stdio(false);
  cin >> n;
  for (int i = 1; i < n; i++) {
    int u, v;
    cin >> u >> v;
    edge[u].push_back(v);
    edge[v].push_back(u);
  }
  getHash(1, 0);
  cout << trees.size();
}
```

---

## quadrangle

```cpp
void solve(int l, int r, int L, int R) {
    if (l > r) return;
    
    int mid = (l + r) >> 1;
    int best_k = -1;
    long long min_val = INF;
    
    // 决策点 k 的范围是 [L, min(mid - 1, R)]
    int limit = min(mid - 1, R);
    for (int k = L; k <= limit; ++k) {
        move_to(k + 1, mid);
        long long cost = dp[k] + K + cur_pairs;
        if (cost < min_val) {
            min_val = cost;
            best_k = k;
        }
    }
    
    dp[mid] = min_val;
    
    // 递归左右区间
    solve(l, mid - 1, L, best_k);
    solve(mid + 1, r, best_k, R);
}
```

---

## 2-sat

```cpp
struct TwoSAT {
    int n; // 变量总数（包含原始变量与辅助变量）
    std::vector<std::vector<int>> g;
    std::vector<int> dfn, low, scc, stk;
    std::vector<bool> in_stk;
    int timer = 0, scc_cnt = 0;
    std::vector<int> ans; // 0: false, 1: true

    explicit TwoSAT(int initial_n = 0) : n(initial_n) {
        expand(n);
    }

    // 动态扩容以支持添加辅助变量
    void expand(int total_vars) {
        n = total_vars;
        g.resize(2 * n);
        dfn.assign(2 * n, 0);
        low.assign(2 * n, 0);
        scc.assign(2 * n, 0);
        in_stk.assign(2 * n, false);
        ans.assign(n, 0);
    }

    // 分配一个新变量并返回其 ID
    int new_var() {
        int id = n++;
        g.resize(2 * n);
        dfn.resize(2 * n, 0);
        low.resize(2 * n, 0);
        scc.resize(2 * n, 0);
        in_stk.resize(2 * n, false);
        ans.resize(n, 0);
        return id;
    }

    // 添加蕴含关系：(u == val_u) -> (v == val_v)，自动连带逆否命题
    void add_implication(int u, int val_u, int v, int val_v) {
        g[2 * u + val_u].push_back(2 * v + val_v);
        g[2 * v + (!val_v)].push_back(2 * u + (!val_u));
    }

    // 添加子句：(u == val_u) || (v == val_v)
    void add_clause(int u, int val_u, int v, int val_v) {
        add_implication(u, !val_u, v, val_v);
    }

    // 强制变量取值：u == val
    void set_value(int u, int val) {
        g[2 * u + (!val)].push_back(2 * u + val);
    }

    // 前缀优化：约束一组文字中【至多选一个为真】
    // lits: {var_id, required_val}
    void at_most_one(const std::vector<std::pair<int, int>>& lits) {
        int k = lits.size();
        if (k <= 1) return;

        std::vector<int> pref(k);
        for (int i = 0; i < k; ++i) {
            pref[i] = new_var();
        }

        for (int i = 0; i < k; ++i) {
            auto [u, val] = lits[i];
            // 1. u == val -> pref[i] == true
            add_implication(u, val, pref[i], 1);

            if (i > 0) {
                // 2. pref[i-1] == true -> pref[i] == true
                add_implication(pref[i - 1], 1, pref[i], 1);
                // 3. u == val -> pref[i-1] == false (互斥约束)
                add_implication(u, val, pref[i - 1], 0);
            }
        }
    }

    void tarjan(int u) {
        dfn[u] = low[u] = ++timer;
        stk.push_back(u);
        in_stk[u] = true;
        for (int v : g[u]) {
            if (!dfn[v]) {
                tarjan(v);
                low[u] = std::min(low[u], low[v]);
            } else if (in_stk[v]) {
                low[u] = std::min(low[u], dfn[v]);
            }
        }
        if (dfn[u] == low[u]) {
            scc_cnt++;
            while (true) {
                int x = stk.back();
                stk.pop_back();
                in_stk[x] = false;
                scc[x] = scc_cnt;
                if (x == u) break;
            }
        }
    }

    bool solve() {
        for (int i = 0; i < 2 * n; ++i) {
            if (!dfn[i]) tarjan(i);
        }
        for (int i = 0; i < n; ++i) {
            if (scc[2 * i] == scc[2 * i + 1]) return false;
            ans[i] = (scc[2 * i + 1] < scc[2 * i]);
        }
        return true;
    }
};
```

---

## string-hash

```cpp
const ull mod[2] = {998244353, (ull)1e9+7};
const ull base[2] = {233, 911382323};
 
struct RH{
    vector<array<ull, 2>> h, pw;
 
    void build(const string& s) {
        int n = s.size();
        h.resize(n), pw.resize(n);
 
        h[0] = {(ull)(s[0] - 'a' + 1), (ull)(s[0] - 'a' + 1)};
        pw[0] = {1ull, 1ull};
        for(int i = 1; i < n; i++) {
            pw[i][0] = pw[i - 1][0] * base[0] % mod[0];
            pw[i][1] = pw[i - 1][1] * base[1] % mod[1];
            h[i][0] = (h[i - 1][0] * base[0] % mod[0]) + (ull)(s[i] - 'a' + 1);
            h[i][1] = (h[i - 1][1] * base[1] % mod[1]) + (ull)(s[i] - 'a' + 1);
 
            h[i][0] %= mod[0], h[i][1] %= mod[1];
        }
    }
 
    array<ull, 2> query(int l, int r) {
        assert(l <= r);
        assert(r < (h.size()));
        array<ull, 2> res = h[r];
 
        if(l) {
            res[0] = res[0] + mod[0] - h[l - 1][0] * pw[r - l + 1][0] % mod[0];
            res[1] = res[1] + mod[1] - h[l - 1][1] * pw[r - l + 1][1] % mod[1];
            res[0] = (res[0] % mod[0] + mod[0]) % mod[0];
            res[1] = (res[1] % mod[1] + mod[1]) % mod[1];
        }
 
        return res;
    }
 
    array<ull, 2> query(const string& t) {
        int n = t.size();
        array<ull, 2> res = {0, 0};
        for(int i = 0; i < n; i++) {
            res[0] = (res[0] * base[0] + (t[i] - 'a' + 1)) % mod[0];
            res[1] = (res[1] * base[1] + (t[i] - 'a' + 1)) % mod[1];
        }
        return res;
    }
}H;
```

---

## 二维极大点集（Pareto 边界 / Skyline）

```cpp
using Point = std::pair<int, int>;

// 过滤被支配点，仅保留极大点集合（不存在其他点满足 x' >= x 且 y' >= y）
std::vector<Point> get_skyline(std::vector<Point> pts) {
    // 1. x 降序；若 x 相同，y 降序
    std::sort(pts.begin(), pts.end(), [](const auto& a, const auto& b) {
        if (a.first != b.first) return a.first > b.first;
        return a.second > b.second;
    });

    // 2. 扫描并维护前缀 y 的最大值
    std::vector<Point> res;
    int max_y = -2e9; // 设为小于坐标下界的值
    for (const auto& p : pts) {
        if (p.second > max_y) {
            res.push_back(p);
            max_y = p.second;
        }
    }
    return res;
}
```

---

## SOS DP

```cpp
// N: 集合大小（二进制位数）
// 复杂度：O(N * 2^N)

// 1. 子集和（高维前缀和）
// 目标：dp[mask] = sum_{sub ⊆ mask} a[sub]
void sos_subset_sum(std::vector<int>& dp, int n) {
    for (int i = 0; i < n; ++i) {
        for (int mask = 0; mask < (1 << n); ++mask) {
            if (mask & (1 << i)) {
                dp[mask] += dp[mask ^ (1 << i)];
            }
        }
    }
}

// 2. 超集和（高维后缀和）
// 目标：dp[mask] = sum_{mask ⊆ sup} a[sup]
void sos_superset_sum(std::vector<int>& dp, int n) {
    for (int i = 0; i < n; ++i) {
        for (int mask = 0; mask < (1 << n); ++mask) {
            if (!(mask & (1 << i))) {
                dp[mask] += dp[mask ^ (1 << i)];
            }
        }
    }
}

// 3. 逆变换（高维差分 / 容斥还原原数组）
// 将子集和数组还原回原数组 a
void sos_subset_diff(std::vector<int>& dp, int n) {
    for (int i = 0; i < n; ++i) {
        for (int mask = 0; mask < (1 << n); ++mask) {
            if (mask & (1 << i)) {
                dp[mask] -= dp[mask ^ (1 << i)];
            }
        }
    }
}
```

---

## DAGDominatorTree

```cpp
// DAG 支配树
// 原理：DAG 上 idom[u] = LCA(v ∈ pred[u])
// 复杂度：O((N + M) log N)
struct DAGDominatorTree {
    int n, logn;
    std::vector<std::vector<int>> g, rg, dt; // g: 原图, rg: 反图, dt: 支配树
    std::vector<int> in_deg, dep, idom;
    std::vector<std::vector<int>> fa;

    DAGDominatorTree(int n) : n(n), g(n + 1), rg(n + 1), dt(n + 1),
                              in_deg(n + 1, 0), dep(n + 1, 0), idom(n + 1, 0) {
        logn = 32 - __builtin_clz(std::max(1, n)) + 1;
        fa.assign(n + 1, std::vector<int>(logn, 0));
    }

    void add_edge(int u, int v) {
        g[u].push_back(v);
        rg[v].push_back(u);
        in_deg[v]++;
    }

    int lca(int u, int v) {
        if (dep[u] < dep[v]) std::swap(u, v);
        for (int k = logn - 1; k >= 0; --k) {
            if (dep[u] - (1 << k) >= dep[v]) {
                u = fa[u][k];
            }
        }
        if (u == v) return u;
        for (int k = logn - 1; k >= 0; --k) {
            if (fa[u][k] != fa[v][k]) {
                u = fa[u][k];
                v = fa[v][k];
            }
        }
        return fa[u][0];
    }

    // 若存在多个源点，默认引入虚拟根节点 0 连接所有入度为 0 的点
    void build(int root = 0) {
        std::queue<int> q;
        if (root == 0) {
            for (int i = 1; i <= n; ++i) {
                if (in_deg[i] == 0) {
                    g[0].push_back(i);
                    rg[i].push_back(0);
                    in_deg[i]++;
                }
            }
            q.push(0);
        } else {
            q.push(root);
        }

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            if (u != root) {
                int p = -1;
                for (int v : rg[u]) {
                    if(p == -1) p = v;
                    else p = lca(p, v);
                }
                idom[u] = p;
                fa[u][0] = p;
                dep[u] = dep[p] + 1;
                for (int k = 1; k < logn; ++k) {
                    fa[u][k] = fa[fa[u][k - 1]][k - 1];
                }
                dt[p].push_back(u);
            }

            for (int v : g[u]) {
                if (--in_deg[v] == 0) {
                    q.push(v);
                }
            }
        }
    }
};
```

### 核心接口说明

* **`dt.add_edge(u, v)`**：添加一条原图的有向边 $u \to v$（内部会自动维护反图与入度）。
* **`dt.build(root = 0)`**：拓扑排序并倍增建树。
  * 传入 `0` 时，自动将所有 $\text{in\_deg} = 0$ 的点挂在 `0` 号超级源点下。
  * 传入具体点（如 `1`）时，仅从该点出发构建支配树。


* **`dt.idom[u]`**：点 $u$ 在支配树上的**直接支配点**（即支配树上的父节点）。
* **`dt.dt[u]`**：支配树的邻接表，存储 $u$ 在支配树上的所有**子节点**。
* **`dt.lca(u, v)`**：支配树上的 LCA 查询。

---

## FenwickTree2D

```cpp
template <typename T = long long, typename Coord = int>
struct FenwickTree2D {
    int n;
    std::vector<std::vector<Coord>> ys;
    std::vector<std::vector<T>> bit;

    explicit FenwickTree2D(int n) : n(n), ys(n + 1), bit(n + 1) {}

    // 1. 离线预处理：收集所有可能被修改/添加的点 (x, y)
    void fake_add(int x, Coord y) {
        for (int i = x; i <= n; i += i & -i) {
            ys[i].push_back(y);
        }
    }

    // 2. 离散化并初始化内层树状数组
    void build() {
        for (int i = 1; i <= n; ++i) {
            std::sort(ys[i].begin(), ys[i].end());
            ys[i].erase(std::unique(ys[i].begin(), ys[i].end()), ys[i].end());
            bit[i].assign(ys[i].size() + 1, 0);
        }
    }

    // 3. 单点加：(x, y) 处增加 val
    void add(int x, Coord y, T val) {
        for (int i = x; i <= n; i += i & -i) {
            int pos = std::lower_bound(ys[i].begin(), ys[i].end(), y) - ys[i].begin() + 1;
            for (int j = pos; j < (int)bit[i].size(); j += j & -j) {
                bit[i][j] += val;
            }
        }
    }

    // 内部前缀查询：x <= limit_x 且 y <= y_val (inclusive = true) 或 y < y_val (inclusive = false)
    T query_prefix(int x, Coord y_val, bool inclusive) const {
        T res = 0;
        for (int i = x; i > 0; i -= i & -i) {
            auto it = inclusive ? std::upper_bound(ys[i].begin(), ys[i].end(), y_val)
                                : std::lower_bound(ys[i].begin(), ys[i].end(), y_val);
            int pos = it - ys[i].begin();
            for (int j = pos; j > 0; j -= j & -j) {
                res += bit[i][j];
            }
        }
        return res;
    }

    T query(int x, Coord y) const {
        return query_prefix(x, y, true);
    }

    // 矩形区域和查询：[x1, x2] * [y1, y2]
    T query(int x1, Coord y1, int x2, Coord y2) const {
        if (x1 > x2 || y1 > y2) return assert(false), 0;
        return query_prefix(x2, y2, true) 
             - query_prefix(x1 - 1, y2, true) 
             - query_prefix(x2, y1, false) 
             + query_prefix(x1 - 1, y1, false);
    }
};
```

---

## PockerJudge

```cpp
class PokerJudge {
public:
    struct HandValue {
        int type;           // 牌型，越大越强
        vector<int> key;    // 同牌型下的比较关键字
 
        bool operator<(const HandValue& other) const {
            if (type != other.type) return type < other.type;
            return key < other.key;
        }
 
        bool operator==(const HandValue& other) const {
            return type == other.type && key == other.key;
        }
    };
 
    // 比较两手牌，返回：
    // 1  => a赢
    // -1 => b赢
    // 0  => 平局
    int compareHands(const vector<string>& a, const vector<string>& b) {
        HandValue A = evaluate(a);
        HandValue B = evaluate(b);
        if (A == B) return 0;
        return (B < A ? 1 : -1);
    }
 
    // 直接返回胜者字符串
    string winner(const vector<string>& a, const vector<string>& b) {
        int res = compareHands(a, b);
        if (res > 0) return "Player 1";
        if (res < 0) return "Player 2";
        return "Tie";
    }
 
public:
    int getRank(char c) {
        if (c >= '2' && c <= '9') return c - '0';
        if (c == 'T') return 10;
        if (c == 'J') return 11;
        if (c == 'Q') return 12;
        if (c == 'K') return 13;
        if (c == 'A') return 14;
        assert(("getRank Error", true) && false);
        return -1;
    }
 
    HandValue evaluate(const vector<string>& cards) {
        vector<int> ranks;
        vector<char> suits;
 
        for (auto &card : cards) {
            ranks.push_back(getRank(card[0]));
            suits.push_back(card[1]);
        }
 
        sort(ranks.begin(), ranks.end());
 
        // 判断同花
        bool flush = true;
        for (int i = 1; i < 5; i++) {
            if (suits[i] != suits[0]) {
                flush = false;
                break;
            }
        }
 
        // 判断顺子
        bool straight = false;
        int straightHigh = 0;
 
        vector<int> uniq = ranks;
        uniq.erase(unique(uniq.begin(), uniq.end()), uniq.end());
 
        if (uniq.size() == 5) {
            if (uniq[4] - uniq[0] == 4) {
                straight = true;
                straightHigh = uniq[4];
            } else if (uniq == vector<int>({2, 3, 4, 5, 14})) {
                // A 2 3 4 5
                straight = true;
                straightHigh = 5;
            }
        }
 
        // 统计点数出现次数
        map<int, int> cnt;
        for (int x : ranks) cnt[x]++;
 
        // v: {出现次数, 点数}
        vector<pair<int, int>> v;
        for (auto &p : cnt) v.push_back({p.second, p.first});
 
        sort(v.begin(), v.end(), [](const auto& a, const auto& b) {
            if (a.first != b.first) return a.first > b.first;
            return a.second > b.second;
        });
 
        // 牌型定义：
        // 9 皇家同花顺
        // 8 同花顺
        // 7 四条
        // 6 葫芦
        // 5 同花
        // 4 顺子
        // 3 三条
        // 2 两对
        // 1 一对
        // 0 高牌
 
        // Royal Flush
        if (flush && ranks == vector<int>({10, 11, 12, 13, 14})) {
            return {9, {14}};
        }
 
        // Straight Flush
        if (straight && flush) {
            return {8, {straightHigh}};
        }
 
        // Four of a Kind
        if (v[0].first == 4) {
            int four = v[0].second;
            int kicker = v[1].second;
            return {7, {four, kicker}};
        }
 
        // Full House
        if (v[0].first == 3 && v[1].first == 2) {
            int three = v[0].second;
            int two = v[1].second;
            return {6, {three, two}};
        }
 
        // Flush
        if (flush) {
            vector<int> key = ranks;
            sort(key.rbegin(), key.rend());
            return {5, key};
        }
 
        // Straight
        if (straight) {
            return {4, {straightHigh}};
        }
 
        // Three of a Kind
        if (v[0].first == 3) {
            int three = v[0].second;
            vector<int> kickers;
            for (int i = 1; i < (int)v.size(); i++) kickers.push_back(v[i].second);
            sort(kickers.rbegin(), kickers.rend());
 
            vector<int> key = {three};
            key.insert(key.end(), kickers.begin(), kickers.end());
            return {3, key};
        }
 
        // Two Pairs
        if (v[0].first == 2 && v[1].first == 2) {
            int highPair = max(v[0].second, v[1].second);
            int lowPair = min(v[0].second, v[1].second);
            int kicker = v[2].second;
            return {2, {highPair, lowPair, kicker}};
        }
 
        // One Pair
        if (v[0].first == 2) {
            int pairRank = v[0].second;
            vector<int> kickers;
            for (int i = 1; i < (int)v.size(); i++) kickers.push_back(v[i].second);
            sort(kickers.rbegin(), kickers.rend());
 
            vector<int> key = {pairRank};
            key.insert(key.end(), kickers.begin(), kickers.end());
            return {1, key};
        }
 
        // High Card
        vector<int> key = ranks;
        sort(key.rbegin(), key.rend());
        return {0, key};
    }
}judge;
```

---