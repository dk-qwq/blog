---
title: 来点网络流板子
published: 2026-08-27
description: ''
image: ''
tags: ['XCPC', '板子']
category: 'OI'
draft: false 
lang: ''
pinWeight: 2
---

## 最大流/最小割

**时间复杂度**

* **一般图**：$\mathcal{O}(V^2E)$
* **二分图匹配**：$\mathcal{O}(E\sqrt{V})$
* **单位容量网络**：$\mathcal{O}(E\min(V^{2/3}, E^{1/2}))$
*(实际运行中 Dinic 远达不到理论上界，通常能轻松跑过 $10^4$ 级别规模的图)*

```cpp
#include <iostream>
#include <vector>
#include <queue>

using namespace std;
using ll = long long;
const ll INF = 1e18;

struct Dinic {
    struct Edge {
        int v;
        ll cap, flow;
        int rev; // 反向边在 adj[v] 中的位置
    };
    
    int n;
    vector<vector<Edge>> adj;
    vector<int> d, cur;

    Dinic(int n) : n(n), adj(n + 1), d(n + 1), cur(n + 1) {}

    void add(int u, int v, ll cap) {
        adj[u].push_back({v, cap, 0, (int)adj[v].size()});
        adj[v].push_back({u, 0, 0, (int)adj[u].size() - 1});
    }

    bool bfs(int src, int des) {
        fill(d.begin(), d.end(), -1);
        queue<int> q;
        d[src] = 0;
        q.push(src);
        
        while (!q.empty()) {
            int u = q.front(); 
            q.pop();
            for (auto& e : adj[u]) {
                if (d[e.v] == -1 && e.cap > e.flow) {
                    d[e.v] = d[u] + 1;
                    q.push(e.v);
                }
            }
        }
        return d[des] != -1;
    }

    ll dinic(int u, int des, ll flow) {
        if (u == des || flow == 0) return flow;
        
        // 当前弧优化
        for (int& i = cur[u]; i < adj[u].size(); ++i) {
            auto& e = adj[u][i];
            if (d[e.v] == d[u] + 1) {
                ll pushed = dinic(e.v, des, min(flow, e.cap - e.flow));
                if (pushed > 0) {
                    e.flow += pushed;
                    adj[e.v][e.rev].flow -= pushed;
                    return pushed;
                }
            }
        }
        return 0;
    }

    ll maxFlow(int src, int des) {
        ll flow = 0;
        while (bfs(src, des)) {
            fill(cur.begin(), cur.end(), 0);
            while (ll pushed = dinic(src, des, INF)) {
                flow += pushed;
            }
        }
        return flow;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    int n, m, s, t;
    cin >> n >> m >> s >> t;
    
    Dinic dinic(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        ll cap;
        cin >> u >> v >> cap;
        dinic.add(u, v, cap);
    }
    
    cout << dinic.maxFlow(s, t) << "\n";
    return 0;
}
```

---

## 最小费用最大流

**时间复杂度**：$\mathcal{O}(f \cdot m \log n)$

```cpp
#include <vector>
#include <queue>
#include <limits>
#include <algorithm>

template <typename Flow = long long, typename Cost = long long>
struct PrimalDual {
    const Flow INF_FLOW = std::numeric_limits<Flow>::max() / 2;
    const Cost INF_COST = std::numeric_limits<Cost>::max() / 2;

    struct Edge { int to; Flow cap; Cost cost; int rev; };

    int n;
    std::vector<std::vector<Edge>> adj;
    std::vector<Cost> h, dist;
    std::vector<int> pv, pe;

    PrimalDual(int n) : n(n), adj(n), h(n), dist(n), pv(n), pe(n) {}

    void add_edge(int u, int v, Flow cap, Cost cost) {
        adj[u].push_back({v, cap, cost, (int)adj[v].size()});
        adj[v].push_back({u, 0, -cost, (int)adj[u].size() - 1});
    }

    void spfa(int s) {
        h.assign(n, INF_COST);
        std::queue<int> q;
        std::vector<bool> in_q(n, false);
        h[s] = 0; q.push(s); in_q[s] = true;
        while (!q.empty()) {
            int u = q.front(); q.pop(); in_q[u] = false;
            for (auto& e : adj[u]) {
                if (e.cap > 0 && h[e.to] > h[u] + e.cost) {
                    h[e.to] = h[u] + e.cost;
                    if (!in_q[e.to]) q.push(e.to), in_q[e.to] = true;
                }
            }
        }
    }

    bool dijkstra(int s, int t) {
        dist.assign(n, INF_COST);
        std::priority_queue<std::pair<Cost, int>, std::vector<std::pair<Cost, int>>, std::greater<>> pq;
        dist[s] = 0; pq.emplace(0, s);
        
        while (!pq.empty()) {
            auto [d, u] = pq.top(); pq.pop();
            if (dist[u] < d) continue;
            for (int i = 0; i < (int)adj[u].size(); ++i) {
                auto& e = adj[u][i];
                Cost cost = e.cost + h[u] - h[e.to];
                if (e.cap > 0 && dist[e.to] > dist[u] + cost) {
                    dist[e.to] = dist[u] + cost;
                    pv[e.to] = u; pe[e.to] = i;
                    pq.emplace(dist[e.to], e.to);
                }
            }
        }
        return dist[t] != INF_COST;
    }

    std::pair<Flow, Cost> min_cost_max_flow(int s, int t, bool has_neg = false, Flow max_f = -1) {
        if (max_f == -1) max_f = INF_FLOW;
        if (has_neg) spfa(s);
        else h.assign(n, 0);

        Flow flow = 0;
        Cost cost = 0;
        while (flow < max_f && dijkstra(s, t)) {
            for (int i = 0; i < n; ++i) 
                if (dist[i] < INF_COST) h[i] += dist[i];

            Flow add = max_f - flow;
            for (int u = t; u != s; u = pv[u]) 
                add = std::min(add, adj[pv[u]][pe[u]].cap);

            flow += add;
            cost += add * h[t];
            for (int u = t; u != s; u = pv[u]) {
                auto& e = adj[pv[u]][pe[u]];
                e.cap -= add;
                adj[u][e.rev].cap += add;
            }
        }
        return {flow, cost};
    }
};
```

---

## 上下界网络流

改自 [自己对上下界网络流的一些理解](https://www.luogu.com.cn/article/78lh1op9)

规定原源汇点为 $S,T$，边的出入点为 $u,v$，辅助源汇点为 $S',T'$ 
最大流的源汇点为 $src,des$ 。

### 无源汇上下界可行流

对于 $b(u,v) \leq f(u,v) \leq c(u,v)$ 的边，从 $u$ 向 $v$ 连一条流量为 $c(u,v)-b(u,v)$ 的边。

令 $M=\sum_{u} {In}-\sum_{u} {Out}$：

若 $M = 0$，不加边

若 $M > 0$，从 $S'$ 向 $u$ 连一条流量为 $M$ 的边

若 $M < 0$，从 $u$ 向 $T'$ 连一条流量为 $-M$ 的边

若存在可行流则 $\sum{M[M>0]} = Maxflow( )$

### 有源汇上下界可行流

同上的，令加入 $T$ 到 $S$ 流量为 $+\infty$ 的边

可行流为上述附加边的流量即 `flow=edges[g[T].back()].flow;`

### 有源汇上下界最大流&最小流

去掉附加边（$T$ 到 $S$ 流量为 $+\infty$ 的边）即
```cpp
edges.pop_back(),edges.pop_back();
g[S].pop_back(),g[T].pop_back();
```
可行流 $\pm$ 最大流（$S \to T$，$T \to S$）

---

**完全不修改原板子**的前提下，在外部优雅地书写：

### 1. 无源汇上下界可行流

外部只需要额外维护一个 `M` 数组，并建立超级源汇 $S'$ 和 $T'$。

```cpp
// 假设 n 是原图节点数，原图节点标号 1~n
int S_prime = 0, T_prime = n + 1;
Dinic dinic(T_prime); // 分配足够的节点空间
vector<ll> M(n + 1, 0);

// 1. 读入边并建立残量图
for (int i = 0; i < m; ++i) {
    int u, v; ll b, c; // b 为下界，c 为上界
    cin >> u >> v >> b >> c;
    dinic.add(u, v, c - b);
    M[v] += b; // In 增加
    M[u] -= b; // Out 增加
}

// 2. 连接超级源汇
ll sum_M = 0;
for (int i = 1; i <= n; ++i) {
    if (M[i] > 0) {
        dinic.add(S_prime, i, M[i]);
        sum_M += M[i];
    } else if (M[i] < 0) {
        dinic.add(i, T_prime, -M[i]);
    }
}

// 3. 判断是否可行
if (dinic.maxFlow(S_prime, T_prime) == sum_M) {
    cout << "YES\n";
    // 此时原边 i 的实际流量 = b[i] + dinic.adj[u][对应边索引].flow
} else {
    cout << "NO\n";
}
```

---

### 2. 有源汇上下界可行流

在第 1 种情况的基础上，**先加一条 $T \to S$ 容量为 $\infty$ 的边**，再连 $S'$ 和 $T'$。

```cpp
// 原源汇为 S, T。超级源汇为 S_prime, T_prime。
// ... (前面处理 M 数组和原图 c - b 边的代码同上) ...

// 记录这条附加边在 T 的邻接表中的位置，方便后续获取流量或“删除”
int extra_edge_idx = dinic.adj[T].size(); 
dinic.add(T, S, INF);

// ... (连接 S_prime 和 T_prime 的代码同上) ...

if (dinic.maxFlow(S_prime, T_prime) == sum_M) {
    cout << "YES\n";
    // 可行流即为附加边 T -> S 上的流量
    ll feasible_flow = dinic.adj[T][extra_edge_idx].flow;
    cout << feasible_flow << "\n";
} else {
    cout << "NO\n";
}

```

---

### 3. 有源汇上下界最大流 & 最小流

在求出“有源汇可行流”后，残量网络已经平衡。我们不需要用暴力的 `pop_back()` 去删边，而是**将那条 $\infty$ 附加边及其反向边的容量和流量强行设为 0**，等同于在残量网络中将其“物理切断”。

```cpp
// ... (接着上面的可行流代码) ...

if (dinic.maxFlow(S_prime, T_prime) == sum_M) {
    // 1. 获取已有的可行流
    ll feasible_flow = dinic.adj[T][extra_edge_idx].flow;
    
    // 2. 外部安全“删边”：将附加边及其反向边的 cap 和 flow 清零
    auto& e = dinic.adj[T][extra_edge_idx];
    auto& rev_e = dinic.adj[S][e.rev];
    e.cap = e.flow = 0;
    rev_e.cap = rev_e.flow = 0;
    
    // 3. 求最大流 / 最小流（原板子支持在残量图上连续调用）
    // 【求最大流】: 带着已有的可行流，继续从 S 往 T 增广
    ll max_flow = feasible_flow + dinic.maxFlow(S, T);
    cout << max_flow << "\n";
    
    // 或者【求最小流】: 退回尽可能多的流量，也就是从 T 往 S 增广
    // ll min_flow = feasible_flow - dinic.maxFlow(T, S);
    // cout << min_flow << "\n";

} else {
    cout << "Please go home and sleep\n"; // 无解
}

```

**为什么这种外部修改更好？**

* **不破环封装**：`Dinic` 结构体保持纯净，仍然是一个普通的求最大流黑盒。
* **内存与索引安全**：不用 `pop_back()`，避免了因为添加边顺序不同导致的图结构（`rev` 索引）错乱问题。直接操作残留边的容量更符合“残量网络”的本质。