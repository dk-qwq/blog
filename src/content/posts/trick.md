---
title: trick
published: 2026-01-10
description: '做题中需要记的一些东西'
image: ''
tags: [OI]
category: 'OI'
draft: false 
lang: 'zh_CN'
---
# 常用 ACM 算法竞赛笔记与模板（整理版）
---
## 目录

- [环境与 IO](#环境与-io)
  - [标准输入 输出 重定向](#标准输入--输出-重定向)

- [常用模板与输入加速](#常用模板与输入加速)
  - [Template](#template)
  - [快读](#快读)

- [随机 生成 校验工具](#随机--生成--校验工具)
  - [Python 生成与校验](#python生成与校验)

- [数据结构 DSU BIT multiset fenwick](#数据结构-dsu--bit--multiset--fenwick)
  - [差分与前缀和技巧](#差分与前缀和技巧)
    - [区间覆盖次数最大值](#区间覆盖次数最大值)
  - [带权并查集](#带权并查集)
  - [二维树状数组 fenwick](#二维树状数组fenwick)
  - [multiset 常见用法与效率提示](#multiset-常见用法与效率提示)

- [图论与最小生成树 MST 桥](#图论与最小生成树-mst--桥)
  - [桥 割边 的性质](#桥割边的性质)
    - [1 到 n 路径与桥的关系](#1--n-路径与桥的关系)

- [数论与位运算技巧](#数论与位运算技巧)
  - [异或前缀性质](#异或前缀性质)
  - [k平方模3性质](#性质)
  - [计数某一位为1的快速方法](#计数某一位为-1-的快速方法-计算区间)   

- [距离变换 曼哈顿 切比雪夫](#距离变换曼哈顿与切比雪夫常用技巧)

- [哈希与模数表](#哈希与模数表)

- [C++20 ranges / STL / 小技巧](#c20-ranges--stl--小技巧)
  - [:: 全局作用域运算符](#-全局作用域运算符)
  - [内存占用估算技巧](#内存占用估算技巧)
  - [Python 技巧](#python-技巧)
  - [views](#views)
  - [平板电视（pbds）](#平板电视pbds)
    - [动态第 $k$ 小](#动态第-k-小)
  - [生成下一个排列](#生成下一个排列字典序)
  - [常用 debug 宏](#常用-debug-宏)
  - [unordered_map pair 哈希](#unordered_map-pair-哈希)

- [常见数学结论 快查](#常见数学结论快查)
  - [偏序与线性扩展（排序 / LIS 技巧）](#偏序与线性扩展排序--lis-技巧)

- [代码片段速查](#代码片段速查零散但常用)
  - [C++ 随机数](#c-随机数可复现--不可复现)
  - [pair 哈希](#pair-哈希)
  - [清空容器](#清空容器swap-trick)

- [实用命令](#实用命令)
  - [测时](#测时)

- [AI持续维护Prompt](#AI持续维护Prompt)

- [返回目录](#返回目录)



---

# 环境与 IO

## 标准输入 / 输出 重定向

#### 说明

* PowerShell **不支持** `<` 作为 stdin 重定向（与 CMD 不同）。

#### 示例

```powershell
# PowerShell — 方式 1：使用管道
Get-Content in.txt -Raw | A.exe > out.txt

# PowerShell — 方式 2：调用 cmd（/C 表示执行指定的命令后关闭命令提示符窗口）
cmd /c "A.exe < in.txt > out.txt"
```

```bash
# Linux / 通用
./A.exe < in.txt > out.txt
```

---

# 常用模板与输入加速

### Template

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int N = 2e5 + 5;
string s;
int n;
void solve() {

}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    freopen("A.in", "r", stdin);
    // freopen("A.out", "w", stdout);
    int T = 1;
    // cin >> T;
    while(T--) solve();
}
```

### 快读

```cpp
#include<iostream>
#include<cstdio>
#include<vector>
using namespace std;
namespace INPUT{
    char buf[1 << 20], *p1, *p2;
    #define gc() (p1==p2&&(p2=(p1=buf)+fread(buf,1,1<<20,stdin),p1==p2)?EOF:*p1++)
}
using namespace INPUT;
template<typename T>
inline T read(){
    T x = 0, p = 1;
    char ch = gc();
    for(; ch < '0' || ch > '9'; ch = gc())
        if(ch == '-') p = -1;
    for(;ch >= '0' && ch <= '9'; ch = gc())
        x = (x<<3) + (x<<1) + (ch^48);
    return x * p;
}
void solve(){
    // ...
}
int main(){
    freopen("A.in", "r", stdin);
    freopen("A.out", "w", stdout);
    int T = read<int>();
    while(T--) solve();
}
```

---

# 随机 / 生成 / 校验工具

### Python：生成与校验

```python
# check.py: 用于检查输出是否满足某些序列条件（示例）
inFile = open("A.in", "r")
outFile = open("A.out", "r")

n = int(inFile.readline())
a = [0] * n
b = [0] * n
for i in range(0, n):
    a[i], b[i] = map(int, inFile.readline().split())

ans = int(outFile.readline())

last = [0] * n
group = list(map(int, outFile.readline().split()))

flag = False
for i in range(0, n):
    w = group[i]
    if last[w] > b[i]:
        open("A.ans", "w").write("False")
        flag = True
        break
    last[w] = b[i]

if flag == False:
    open("A.ans", "w").write("True")
```

```python
# 简单数据生成器
import random

def gen(n, m):
    print(n, m)
    for _ in range(n):
        print(random.randint(1, 1000), end=' ')
    print()

if __name__ == "__main__":
    gen(10, 5)
```

```python
import random

random.randint(l, r)
random.choice(list)
random.sample(list, k)
random.shuffle(list)

# f = open("data.in", "w")
with open("data.in", "w") as f:
    f.write("...\n")
    print("...", file = f)
# f.close()
```
---

# 数据结构 DSU / BIT / multiset / fenwick

## 差分与前缀和技巧
### 区间覆盖次数最大值
给定若干区间 ([l, r])，只需计算**某点被覆盖的最大次数**（不关心具体点）。
* 对每个区间：
  * `c[l]++` ， `c[r + 1]--`
* 对 `c` 求前缀和，维护最大值即可

**说明：**
* 若坐标范围小，用数组
* 若坐标范围大 / 稀疏，用 `map`
* 不同区间权值不同，直接把 `++ / --` 改为对应权值
```cpp
map<ll, ll> c;
for (auto [l, r] : intervals)
    c[l]++, c[r + 1]--;

ll cur = 0, ans = 0;
for (auto& [_, v] : c) {
    cur = (v += cur);
    ans = max(ans, cur);
}
```

## 带权并查集

```cpp
// 带权并查集（a[x] = a[y] + d; 模 M）
struct DSU {
  std::vector<size_t> pa, size, dist;

  explicit DSU(size_t size_) : pa(size_), size(size_, 1), dist(size_) {
    std::iota(pa.begin(), pa.end(), 0);
  }

  size_t find(size_t x) {
    if (pa[x] == x) return x;
    size_t y = find(pa[x]);
    (dist[x] += dist[pa[x]]) %= M;
    return pa[x] = y;
  }

  bool unite(size_t x, size_t y, int d) { // a[x] = a[y] + d;
    find(x), find(y);
    (d += M - dist[y]) %= M;
    (d += dist[x]) %= M;
    x = pa[x], y = pa[y];
    if (x == y) return d == 0;
    if (size[x] < size[y]) {
      std::swap(x, y);
      d = (M - d) % M;
    }
    pa[y] = x;
    size[x] += size[y];
    dist[y] = d;
    return true;
  }

  int check(size_t x, size_t y) { // a[x] - a[y]
    find(x), find(y);
    if (pa[x] != pa[y]) return -1;
    return (dist[y] - dist[x] + M) % M;
  }
};
```

---

## 二维树状数组（Fenwick）

```cpp
struct fenwick{ // 二维树状数组
  void add(int x, int y, int v) {
    for (int i = x; i <= n; i += lowbit(i))
      for (int j = y; j <= m; j += lowbit(j)) c[i][j] += v;
  }
};
```

---

## multiset 常见用法与效率提示

* 查找某值：`s.find(val)` — 推荐用于判断存在性（**不要**用 `count` 在 multiset 上查元素的存在性：`multiset::count()` 的复杂度为 `O(k + log n)`，其中 `k` 为该值出现的次数）。
* 删除：

  * `s.erase(val)` 删除所有等值元素（C++11 以后返回删除个数）
  * `s.erase(it)` 删除迭代器
  * `s.erase(s.find(val))` 删除单个点
* 最小/最大：

  * `*s.begin()` 最小值
  * `*prev(s.end())` 最大值

---

# 图论与最小生成树 (MST) / 桥

## 桥（割边）的性质

### 1 → n 路径与桥的关系

首先，我们将所有位于 **任意一条从 $1$ 到 $n$ 的路径上的边**的集合记作 $A$。
接着，找出图中的所有 **桥（割边）**，将这些边的集合记作 $B$。
然后，任选一条从 $1$ 到 $n$ 的简单路径，将路径上的边的集合记作 $P$。
那么：$ B \cap P = A$


> 对图 $G=(V,E)$，若 $T=(V,E')$ 是 $G$ 的一棵最小生成树，加入若干新点 $V_{new}$ 并连接若干边后，新图 $G'=(V\cup V_{new}, E\cup E_{new})$ 的最小生成树中，**不会使用原图中不在 $T$ 中的边**。
>
> 即：$E_{T'} \cap (E \setminus E') = \empty$。 
>
> 结论（简洁）：也就是说加入新点可在原最小生成树上做

---

# 数论与位运算技巧

## 异或前缀性质（$1 \oplus 2 \oplus \dots \oplus n$）

> 结论：
>
> * 若 $n \bmod 4 = 0$，则 $1 \oplus \dots \oplus n = n$。
> * 若 $n \bmod 4 = 1$，则 $1 \oplus \dots \oplus n = 1$。
> * 若 $n \bmod 4 = 2$，则 $1 \oplus \dots \oplus n = n+1$。
> * 若 $n \bmod 4 = 3$，则 $1 \oplus \dots \oplus n = 0$。 

## $k^2 \bmod 3$ 性质

> 任意平方数关于模 3 的结果只可能是 0 或 1（$k^2 \equiv 0\ \text{或}\ 1 \pmod 3$）。
> 推论：任意平方数可表示为若干个 3 的和，或若干个 3 加上一个偶数（用于构造题目证明时）。

## 计数某一位为 1 的快速方法（$O(1)$ 计算区间）

```python
def count_up_to(x, k):
    """计算 [0, x] 中二进制第 k 位为 1 的整数个数"""
    if x < 0:
        return 0
    T = 1 << (k + 1)      # 周期长度 2^(k+1)
    L = 1 << k            # 每个周期中 1 的数量 2^k
    full_cycles = (x + 1) // T
    remainder = (x + 1) % T
    return full_cycles * L + max(0, remainder - L)

def query_range(l, r, k):
    """查询 [l, r] 中二进制第 k 位为 1 的整数个数"""
    return count_up_to(r, k) - count_up_to(l - 1, k)
```

---

# 距离变换：曼哈顿与切比雪夫（常用技巧）

* 曼哈顿距离：$dis(A, B) = |x_1 - x_2| + |y_1 - y_2|$
* 切比雪夫距离：$dis(A, B) = \max(|x_1 - x_2|, |y_1 - y_2|)$

> 转换技巧：
>
> * 将 $(x,y) \mapsto (x+y, x-y)$，则原坐标系中的 **曼哈顿距离** 等于新坐标系中的 **切比雪夫距离**。
>
>* 将 $(x,y) \mapsto \left(\dfrac{x+y}{2},\dfrac{x-y}{2}\right)$，则原坐标系中的 **切比雪夫距离** 等于新坐标系中的 **曼哈顿距离**。 

---

# 哈希与模数表

| 类型      | 模数 (mod)                  | 常用基数 (base)         | 说明             |
| ------- | ------------------------- | ------------------- | -------------- |
| 单模数常用   | 1,000,000,007 (1e9+7)     | 131, 137, 911382323 | 经典，OJ 通用       |
| 单模数常用   | 1,000,000,009 (1e9+9)     | 131, 233, 911382323 | 常和 1e9+7 搭配    |
| 单模数常用   | 998,244,353               | 61, 107, 131, 233   | NTT 质数，代码里常见   |
| 双模数组合   | (1e9+7, 1e9+9)            | (131, 137)          | 最经典的双模哈希       |
| 双模数组合   | (998244353, 1e9+7)        | (233, 911382323)    | 抗碰撞性更高         |
| 64位自然溢出 | 2^64 (unsigned long long) | 随机奇数 \~ 1e5..1e9    | 无需取模，溢出即模 2^64 |

---

# C++20 ranges / STL / 小技巧

## :: 全局作用域运算符
- 使用 `::x` 显式访问全局变量，避免与局部变量 / 形参重名
- 例：`dfs(u, fa)` 中用 `::fa[u] = fa`


## 内存占用估算技巧
计算空间，所有变量定义之前`bool Be;` 之后`bool Ed;`， 然后输出：`cout << ((&Ed - &Be) >> 20) << endl;` 就是使用变量的总空间，单位为 MB （可能cout的时候需要调换Be，Ed的位置，原因：大端小端）

## Python 技巧

python中可以直接使用 `pow(x, k, mod)` ，不需要导入任何库

## views

```cpp
for (auto i : views::iota(1, n + 1)) {}

auto p = std::ranges::partition_point(v, odd);
std::cout << *p << '\n';
```

* `iota_view(0, 10^9)` 是虚拟范围，**O(1)** 表示无需构造实际容器，适合用于二分答案。
* `partition_point` 要求 `check` 在范围内单调（先 `true` 后 `false`），必要时反转返回值。 

```cpp
std::map<int, std::string> mp = {{1, "a"}, {2, "b"}, {3, "c"}}; // 反向迭代map
for (auto&& [k, v] : std::views::reverse(std::views::all(map))) { ... }
for (auto&& [k, v] : mp | rv::all | rv::reverse)
    std::cout << k << " " << v << "\n";
```

## 平板电视（pbds）
### 动态第 $k$ 小
```cpp
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;

tree<int, null_type,
  less<int>,
  rb_tree_tag,
  tree_order_statistics_node_update
> os;

os.insert(x);               // 插入
os.erase(x);                // 删除
os.order_of_key(x);         // < x 的元素个数
*os.find_by_order(k);       // 第 k 小（0-indexed）
```

## 生成下一个排列（字典序）

```cpp
#include <algorithm>
bool next_permutation(iterator start, iterator end);
```

* 复杂度：**`O(n)`**（单次）

## 常用 debug 宏

```cpp
#define debug(a) cout<<#a<<"="<<a<<endl;
```

## unordered_map pair 哈希

```cpp
struct PairHash {
    size_t operator()(const std::pair<int,int>& p) const noexcept {
        return std::hash<long long>()(((long long)p.first << 32) ^ p.second);
    }
};
std::unordered_map<std::pair<int, int>, ll, PairHash> count;
```

> ⚠️ 注意：自实现 hashmap 在性能上可能不如嵌套 `std::unordered_map<int, std::unordered_map<int, ll>>`，后者在很多场景更稳定。 

---

# 常见数学结论（快查）

* $\sum_{X} f(X) = \sum_{k} \sum_{X} [f(X) > k]$
* 对于大小为 $n \times m$ 的方格，若 $n/m$ 为奇数，则可以从 $(1, 1)$ 到 $(n, m)$ 一次性走完所有方格（ $S$ 型）
* 素数计数函数：$\pi(n) \sim \dfrac{n}{\ln n}$。 
* 多边形成立条件（给定边长能否构成多边形）：

  > 若有 $m \ge 3$ 根边长 $l_1,\dots,l_m$，当且仅当 $\sum_{i=1}^{m} l_i > 2\max_i l_i$。 

## 偏序与线性扩展（排序 / LIS 技巧）
对直积偏序 $< \times <$ ，可通过“主序升序、次序逆序”的线性扩展消除等值冲突。

---

# 代码片段速查（零散但常用）

### C++ 随机数（可复现 / 不可复现）

```cpp
#include <iostream>
#include <random>
using namespace std;
// 用随机设备作为种子
random_device rd;       
mt19937 gen(rd());
// 直接使用gen() 返回一个unsigned int类型的数
// 所以你需要使用 int x = gen() >> 1; 来截断

// 或者用固定种子
mt19937 gen2(42);       
uniform_int_distribution<int> dist(1, 6); // [1,6] 区间
cout << dist(gen) << endl;  // 模拟掷骰子
```

### pair 哈希

```cpp
struct PairHash {
    size_t operator()(const std::pair<int,int>& p) const noexcept {
        return std::hash<long long>()(((long long)p.first << 32) ^ p.second);
    }
};
```

### 清空容器（swap trick）

```cpp
template<typename T>
void clear(T& v){ T().swap(v); }
```

---

# 实用命令

## 测时
PowerShell：`Measure-Command {A.exe}` 测程序运行时间（PowerShell 专用）。 

---

# 返回目录

* [回到顶部](#常用-acm-算法竞赛笔记与模板整理版)

---

# AI持续维护Prompt

### 零碎知识点整理
```text
你是 ACM 算法竞赛 Markdown 笔记整理助手。
我会输入一些零碎、口语化、不成体系的知识点。

请你将它们整理为简短、清晰、易理解的总结，要求：
1. 控制在几句话内
2. 偏向比赛时快速翻笔记能看懂
3. 使用算法竞赛常用表述
4. 适合直接写进 Markdown 笔记

输出要求：
- 不讲背景、不写推导
- 不废话，只保留结论和用法
- 表述尽量精炼、好记

```

### ✅ Prompt 1（推荐长期使用）

```text
你是 ACM 算法竞赛 Markdown 笔记的结构维护助手。

下面是我当前笔记的【完整多层目录结构】，
请你严格基于该目录来判断我新增内容的插入位置。

【目录结构】
（粘贴当前 md 的完整多层目录，包括一级 / 二级 / 三级）

【我新增的内容】
（粘贴新的算法、结论、模板或技巧）

请你按以下格式输出，并且【每一层都要写全】：

1️⃣ 推荐插入路径（从一级到最深层）：
- 一级标题：
- 二级标题：
- 三级标题（若无则写“无”）：
- 四级标题（若无则写“无”）：

2️⃣ 是否需要新建标题：
- 新建层级：（二级 / 三级 / 四级 / 不需要）
- 原因说明：

3️⃣ 若存在多个可选位置：
- 给出所有候选路径
- 指出最推荐的一条，并说明理由

4️⃣ 若内容与现有笔记有重叠：
- 指出应合并的具体小节
- 或说明为何应独立成新小节
```

---

# 返回目录

* [回到顶部](#常用-acm-算法竞赛笔记与模板整理版)