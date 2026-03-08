---
title: OI 数据生成
published: 2026-03-08
description: '出题过程中常用的数据生成与算法整理'
image: ''
tags: [OI, 数据生成]
category: 'OI'
draft: false 
lang: ''
pinWeight: 2
---

## 随机无向图生成

```python
def gen_connected_graph(n, m):
    assert m >= n - 1

    edges = set()
    result = []

    # Step1: 生成生成树
    for i in range(2, n + 1):
        u = random.randint(1, i - 1)
        edges.add((u, i))
        result.append((u, i))

    # Step2: 补边
    while len(edges) < m:
        u = random.randint(1, n)
        v = random.randint(1, n)
        if u == v:
            continue
        if u > v:
            u, v = v, u
        if (u, v) in edges:
            continue
        edges.add((u, v))
        result.append((u, v))

    return result
```

---

## 随机树生成

### 随机连接父节点

```python
def gen_tree(n):
    edges = []
    for i in range(2, n + 1):
        parent = random.randint(1, i - 1)
        edges.append((parent, i))
    return edges
```

### Prufer 序列

- 还没学

---

## 二维迷宫生成

### 随机 Prim 算法

```python
import random

def generate_maze_prim(n, m):
    n = n if n % 2 == 1 else n + 1
    m = m if m % 2 == 1 else m + 1

    grid = [['#'] * m for _ in range(n)]
    start = (1, 1)
    grid[1][1] = '.'

    frontier = []

    def add_frontier(x, y):
        for dx, dy in [(2,0),(-2,0),(0,2),(0,-2)]:
            nx, ny = x + dx, y + dy
            if 0 < nx < n and 0 < ny < m and grid[nx][ny] == '#':
                frontier.append((x, y, nx, ny))

    add_frontier(1, 1)

    while frontier:
        idx = random.randrange(len(frontier))
        x, y, nx, ny = frontier.pop(idx)

        if grid[nx][ny] == '#':
            grid[(x + nx)//2][(y + ny)//2] = '.'
            grid[nx][ny] = '.'
            add_frontier(nx, ny)

    return grid
```

### 随机 Kruskal 算法

```python
import random

def generate_maze_kruskal(n, m):
    n = n if n % 2 == 1 else n + 1
    m = m if m % 2 == 1 else m + 1

    grid = [['#'] * m for _ in range(n)]
    parent = {}

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(a, b):
        parent[find(a)] = find(b)

    cells = []
    edges = []

    for i in range(1, n, 2):
        for j in range(1, m, 2):
            grid[i][j] = '.'
            parent[(i, j)] = (i, j)
            cells.append((i, j))

    for i, j in cells:
        for dx, dy in [(2,0),(0,2)]:
            ni, nj = i + dx, j + dy
            if ni < n and nj < m:
                edges.append((i, j, ni, nj))

    random.shuffle(edges)

    for x1, y1, x2, y2 in edges:
        if find((x1,y1)) != find((x2,y2)):
            union((x1,y1), (x2,y2))
            grid[(x1+x2)//2][(y1+y2)//2] = '.'

    return grid
```