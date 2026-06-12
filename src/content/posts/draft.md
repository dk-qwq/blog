---
title: Draft Example
published: 2022-07-01
tags: [Markdown, Blogging, Demo]
category: Examples
draft: true
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

python ord chr

python from fractions import Fraction; p = Fraction(3,100)