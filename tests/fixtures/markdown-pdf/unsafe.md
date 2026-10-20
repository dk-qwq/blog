---
title: 不可信 Markdown
---

## 安全正文

这段普通正文应保留。

<script>parent.document.documentElement.dataset.markdownInjected = 'script';</script>

<img src="missing.png" alt="不可信图片" onerror="parent.document.documentElement.dataset.markdownInjected = 'event'">

<a href="javascript:parent.document.documentElement.dataset.markdownInjected='link'">不可信链接</a>

<iframe srcdoc="<script>parent.parent.document.documentElement.dataset.markdownInjected='iframe'</script>"></iframe>

<form action="https://example.invalid/submit"><input name="secret"><button>提交</button></form>
