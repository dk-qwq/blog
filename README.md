# dk-qwq Blog · Astro + Vue

这是从原博客迁移出的独立工作副本，使用 Astro 6、Vue 3、TypeScript 和 Tailwind CSS 3。页面与 Markdown 在构建时生成 HTML，Vue 负责导航、搜索、主题设置、归档筛选和评论挂载。Tailwind 3 通过标准 PostCSS 管线构建。

## 本地开发

需要 Node.js 22.12+（推荐 Node.js 24）和 pnpm 11。

~~~bash
pnpm install --frozen-lockfile
pnpm dev
~~~

默认地址为 http://localhost:4321/blog/。

开发模式的搜索使用真实文章标题、标签和摘要。要验证完整的正文搜索，请构建后预览：

~~~bash
pnpm build
pnpm preview
~~~

## 常用命令

| 命令 | 用途 |
| --- | --- |
| pnpm dev | 开发服务器 |
| pnpm new-post my-post | 创建文章 |
| pnpm check | Astro 与 Vue 类型检查 |
| pnpm test | 内容树、链接规则、筛选与搜索单元测试 |
| pnpm build | 构建静态页面和 Pagefind 搜索索引 |
| pnpm test:links | 检查构建后页面与 RSS 的内部链接 |
| pnpm test:e2e | 在生产预览上运行桌面、移动端浏览器测试 |
| pnpm validate | 依次执行 lint、类型检查、单元测试、构建和链接检查 |

第一次运行浏览器测试需要执行 pnpm exec playwright install chromium；测试前运行 pnpm build。浏览器测试会自行启动 4322 端口的预览服务。Giscus 和统计服务在自动化测试中被隔离，测试覆盖组件挂载，不会向外部服务发布数据。

## 代码结构

- src/pages/、src/layouts/：Astro 路由、静态内容和页面布局。
- src/components/NavbarControls.vue：导航交互的统一入口。
- src/components/Search.vue、ArchivePanel.vue、LightDarkSwitch.vue：Vue 交互组件。
- src/components/widget/DisplaySettings.vue：主题色设置。
- src/components/misc/GiscusComment.vue：评论加载与主题同步。
- src/composables/：浏览器偏好设置及监听器清理。
- src/scripts/site.ts：切页生命周期、公式滚动条、图片灯箱、复制代码。
- src/utils/content-paths.ts、content-order.ts：不依赖 Astro 的路径和排序规则。
- src/utils/content-utils.ts、content-tree.ts：内容加载和目录树。
- src/lib/pagefind.ts：按需加载生产搜索索引。
- src/content/：原有 Markdown 和文章附件。
- src/styles/：全局主题、Markdown、代码块和过渡样式。

## 内容与链接约定

普通文章使用 /blog/posts/路径/。目录中的 index.md 对应目录路径的文章；_index.md 用作目录标题、描述和排序元数据。首页、归档、上一篇/下一篇和 RSS 使用同一套路径转换，避免链接落到不存在的 _index 页面。RSS 不发布仅用于目录元数据的 _index.md。

站点域名、/blog 部署前缀在 astro.config.mjs 配置；站点信息和主题设置在 src/config.ts 配置。修改部署前缀时，同时更新浏览器测试的基地址与相应 URL 断言。

## 部署

GitHub Pages 工作流继续使用 pnpm build，部署 dist/。Vercel 静态输出中的搜索索引也会在构建后同步。保留了 /blog/ 路径、文章渲染扩展、图片优化、RSS、站点地图与 Giscus pathname 评论映射。

原文章内容和附件按文件保留，包含本地尚未纳入 Git 的文件；是否提交这些文章沿用原仓库的忽略规则。构建时若出现 KaTeX 的换行兼容提示，来源于已有 Markdown 公式，不影响构建完成。

主题基于 [Fuwari](https://github.com/saicaca/fuwari)，遵循仓库中的 LICENSE。本地 Vue 图标取自已有 Iconify 图标集：Material Symbols（Apache-2.0）和 Font Awesome Free（CC BY 4.0）。
