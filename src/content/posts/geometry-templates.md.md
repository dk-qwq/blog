---
title: 来点计算几何板子
published: 2026-08-27
description: ''
image: ''
tags: ['XCPC', '板子']
category: 'OI'
draft: false 
lang: ''
pinWeight: 2
---

### 一、 点与直线基础

```cpp
const double eps = 1e-9;
int sgn(double x) {
    if (fabs(x) < eps) return 0;
    return x < 0 ? -1 : 1;
}

struct Point {
    double x, y;
    Point(double x = 0, double y = 0) : x(x), y(y) {}
    Point operator+(const Point &b) const { return Point(x + b.x, y + b.y); }
    Point operator-(const Point &b) const { return Point(x - b.x, y - b.y); }
    double operator*(const Point &b) const { return x * b.x + y * b.y; } // 点乘
    double operator^(const Point &b) const { return x * b.y - y * b.x; } // 叉乘
    double len2() const { return x * x + y * y; }
    double len() const { return sqrt(len2()); }
};
```

---

### 二、 多边形有向面积（鞋带公式）

$O(n)$ 计算任意多边形面积。若顶点按逆时针给出，结果为正；顺时针为负。

```cpp
double polygon_area(const vector<Point> &poly) {
    double area = 0;
    int n = poly.size();
    for (int i = 0; i < n; i++) {
        area += poly[i] ^ poly[(i + 1) % n];
    }
    return area / 2.0;
}
```

---

### 三、 三角形外心（外接圆圆心）

利用中垂线交点公式直接求解：

```cpp
Point circumcenter(const Point &a, const Point &b, const Point &c) {
    double a2 = a.len2(), b2 = b.len2(), c2 = c.len2();
    double d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
    double ux = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d;
    double uy = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d;
    return Point(ux, uy);
}
```

---

### 四、 两直线交点

由直线 $P + t\vec{v}$ 与 $Q + u\vec{w}$ 求交点（假设不平行/不共线）：

```cpp
Point line_intersection(const Point &p, const Point &v, const Point &q, const Point &w) {
    double t = ((q - p) ^ w) / (v ^ w);
    return p + v * t; // 注意 Point 需支持标量乘法 v * t
}
```

---

### 五、 点到直线的投影点

求点 $P$ 在直线 $AB$ 上的投影点 $Q$：

```cpp
Point projection(const Point &p, const Point &a, const Point &b) {
    Point v = b - a;
    double t = ((p - a) * v) / v.len2();
    return a + v * t;
}
```

---


## 下半凸包

```cpp
#include <bits/stdc++.h>
using namespace std;

using i64 = long long;

struct Point {
    i64 x, y;

    Point operator-(const Point &other) const {
        return {x - other.x, y - other.y};
    }

    // 向量叉积 (this × other)
    i64 cross(const Point &other) const {
        return x * other.y - y * other.x;
    }
};

// 计算 (b - a) × (c - a)
// > 0 表示 a -> b -> c 左转；< 0 表示右转；= 0 表示三点共线
i64 cross(const Point &a, const Point &b, const Point &c) {
    return (b - a).cross(c - a);
}

// 输入点集 pts，返回下凸壳上的点序列（从左到右）
vector<Point> get_lower_hull(vector<Point> pts) {
    int n = pts.size();
    if (n <= 2) return pts;

    // 1. 按 x 升序排序，x 相同按 y 升序
    sort(pts.begin(), pts.end(), [](const Point &a, const Point &b) {
        if (a.x != b.x) return a.x < b.x;
        return a.y < b.y;
    });

    // 2. 单调栈维护下凸壳
    vector<Point> hull;
    hull.reserve(n);

    for (const auto &p : pts) {
        // cross <= 0: 严格凸包（不保留共线点，右转或共线弹出）
        // cross <  0: 包含共线点（仅右转弹出）
        while (hull.size() >= 2 && cross(hull[hull.size() - 2], hull.back(), p) <= 0) {
            hull.pop_back();
        }
        hull.push_back(p);
    }

    return hull;
}
```

上半凸包修改不等号方向即可

---

## Pick's 定理

顶点均为整点的简单多边形面积 $S$ 、内部整点数 $I$ 、边上整点数 $B$ 满足：

$$S = I + \frac{B}{2} - 1$$

---

## 点在多边形内判定

### 一、 基础点与向量定义

```cpp
#include <bits/stdc++.h>
using namespace std;

const double eps = 1e-9;
int sgn(double x) {
    if (fabs(x) < eps) return 0;
    return x < 0 ? -1 : 1;
}

struct Point {
    double x, y;
    Point(double x = 0, double y = 0) : x(x), y(y) {}
    Point operator+(const Point &b) const { return Point(x + b.x, y + b.y); }
    Point operator-(const Point &b) const { return Point(x - b.x, y - b.y); }
    double operator*(const Point &b) const { return x * b.x + y * b.y; } // 点乘
    double operator^(const Point &b) const { return x * b.y - y * b.x; } // 叉乘
};

// 点 p 是否在线段 ab 上（含端点）
bool on_segment(const Point &p, const Point &a, const Point &b) {
    return sgn((a - p) ^ (b - p)) == 0 && sgn((a - p) * (b - p)) <= 0;
}
```

### 二、 任意简单多边形判定：射线法（$O(n)$）

```cpp
int point_in_polygon(const Point &p, const vector<Point> &poly) {
    int n = poly.size();
    int cnt = 0;
    for (int i = 0; i < n; i++) {
        Point a = poly[i];
        Point b = poly[(i + 1) % n];
        if (on_segment(p, a, b)) return 1; // 落在多边形边界上
        
        if (a.y > b.y) swap(a, b);
        // 左闭右开区间：a.y <= p.y < b.y
        if (sgn(p.y - a.y) >= 0 && sgn(p.y - b.y) < 0) {
            // 判断点 p 是否在线段 a->b 的左侧（即射线向右发射必穿过 ab）
            if (sgn((b - a) ^ (p - a)) > 0) {
                cnt ^= 1;
            }
        }
    }
    return cnt ? 2 : 0;
}
```

### 三、 凸多边形判定：极角二分法（单次 $O(\log n)$）

```cpp
int point_in_convex(const Point &p, const vector<Point> &poly) {
    int n = poly.size();
    // 1. 检查是否在角 P0P1 到 P0P(n-1) 的外部
    double c1 = (poly[1] - poly[0]) ^ (p - poly[0]);
    double c2 = (poly[n - 1] - poly[0]) ^ (p - poly[0]);
    if (sgn(c1) < 0 || sgn(c2) > 0) return 0;
    
    // 2. 特判是否在最外侧两射线边界上
    if (sgn(c1) == 0) return on_segment(p, poly[0], poly[1]) ? 1 : 0;
    if (sgn(c2) == 0) return on_segment(p, poly[0], poly[n - 1]) ? 1 : 0;

    // 3. 二分查找所在的极角扇区 P0-P[mid]-P[mid+1]
    int l = 1, r = n - 2, pos = 1;
    while (l <= r) {
        int mid = (l + r) / 2;
        if (sgn((poly[mid] - poly[0]) ^ (p - poly[0])) >= 0) {
            pos = mid;
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
    
    // 4. 判断点与外侧边 P[pos]->P[pos+1] 的相对位置
    double c = (poly[pos + 1] - poly[pos]) ^ (p - poly[pos]);
    if (sgn(c) > 0) return 2; // 严格内部
    if (sgn(c) == 0) return 1; // 落在边界上
    return 0;                 // 外部
}
```

---