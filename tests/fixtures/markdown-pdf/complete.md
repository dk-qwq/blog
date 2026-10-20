---
title: Markdown 打印兼容检查
published: 2026-10-15
description: 这段 frontmatter 不应作为正文显示
tags: [测试, PDF]
draft: true
---

## 公式与提示框

行内公式 $a_n = a_{n-1} + a_{n-2}$。

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

:::note
这是博客提示框，保留行内公式 $O(n)$。
:::

> [!TIP]
> GitHub 提示框也需要保留。

## 代码与表格

```cpp title="sum.cpp" collapse={1-3}
int sum(int n) {
    return n * (n + 1) / 2;
}
```

| 项目 | 内容 |
| --- | --- |
| 中文 | 可以复制的正文 |
| 公式 | $x^2$ |

- [x] 已完成
- [ ] 待完成

<details>
<summary>展开推导过程</summary>

打印时必须看到这段隐藏内容。

</details>

<spoiler>打印时必须看到隐藏答案。</spoiler>

## 本地图片

![本地示意图](images/diagram.png)

这是文档末尾。
