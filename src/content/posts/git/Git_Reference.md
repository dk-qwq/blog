---
title: Git-Reference
published: 2026-02-06
description: 'Git 常用命令手册'
image: ''
tags: [Git, Reference]
category: 'Git'
draft: false 
lang: ''
pinWeight: 2
---

# Git 基本操作

## Git 基础与使用流程

### 1. 仓库初始化与基础信息

- [git config](#git-config)
- [git init](#git-init)
- [git clone](#git-clone)
- [git status](#git-status)

### 2. 工作区与暂存区操作

- [git add](#git-add)
- [git diff](#git-diff)
- [git restore](#git-restore)
- [git rm](#git-rm)
- [git mv](#git-mv)

### 3. 提交与历史

- [git commit](#git-commit)
- [git log](#git-log)
- [git show](#git-show)
- [git reflog](#git-reflog)
- [git tag](#git-tag)

### 4. 分支与开发流

- [git branch](#git-branch)
- [git checkout](#git-checkout)
- [git switch](#git-switch)
- [git merge](#git-merge)
- [git rebase](#git-rebase)
- [git cherry-pick](#git-cherry-pick)

### 5. 撤销与回退

- [git reset](#git-reset)
- [git revert](#git-revert)

### 6. 远程仓库协作

- [git remote](#git-remote)
- [git fetch](#git-fetch)
- [git pull](#git-pull)
- [git push](#git-push)

### 7. 临时操作

- [git stash](#git-stash)

---

约定:

- `< >` 表示参数是必须的
- `[ ]` 表示参数可选

## git config

`git config --list` ：列出所有 Git 配置项及其值。
`git config [--global | --system | --local] <key> <value>` ：设置 Git 配置项的值。

- `--global`：设置全局配置，适用于当前用户的所有仓库。
- `--system`：设置系统级配置，适用于系统上的所有用户和仓库。
- `--local`：设置本地配置，仅适用于当前仓库。

### 常用配置项

- `git config --global user.name "Your Name"` ：设置全局用户名。
- `git config --global user.email "your.email@example.com"` ：设置全局用户邮箱。

---

## git init

创建仓库
`git init [name]`

---

## git clone

克隆仓库 / 克隆 n 层历史
`git clone [--depth <N>] <url>`

---

## git status

查看当前状态
`git status [-s]`
使用 `-s` 来获取更简短的输出

---

## git add

添加到暂存区
`git add <file...>`

`git add <dir>`

---

## git diff

显示暂存区和工作区的差异:
`git diff [file]`

查看工作区和最新提交(commit)的差异:
`git diff HEAD [file]`

显示暂存区和上一次提交(commit)的差异:

`git diff --cached [file]`

`git diff --staged [file]`

显示两次提交之间的差异:
`git diff <first-branch>...<second-branch>`

显示两个分支的共同祖先与某个分支之间的差异:

等价于：`git diff $(git merge-base A B) B`

---

## git restore

`git restore [<options>] [<pathspec>...]`

- `<options>` 可选参数
- `<pathspec>` 要恢复的文件路径

### 选项

- `--source <commit>` 指定恢复的来源提交，默认是 `HEAD`
- `--staged` 恢复暂存区的文件
- `--ours` 在合并冲突时使用当前分支的版本
- `--theirs` 在合并冲突时使用被合并分支的版本

---

## git rm

`git rm [-f | --force] [-n] [-r] [--cached] [--ignore-unmatch] [-q | --quiet] [--] <file​...>`

### 选项

- `--cached` 仅在暂存区删除
- `-f (--force)` 删除工作区和暂存区文件（强制删除，并将该次删除放到暂存区）
- `-r` 删除目录，允许递归删除
- `-n` 仅列出，不删除
- `--` 分割选项和文件列表\\
- `--ignore-unmatch` 静默跳过不存在的文件
- `-q (--quiet)` 输出静默

---

## git mv

移动或重命名文件、目录、符号链接

- `git mv [-f] [-n] [-k] <source> <destination>`
- `git mv [-f] [-n] [-k] <source> <destination directory>`

1. 将 `<source>` 重命名为 `<destination>`
2. `<source>` 必须是目录，将其移动到 `<destination directory>`

### 选项

- `-f(--force)` 即使目标存在仍然强制
- `-n` 仅显示，不行为
- `-k` 跳过错误情况

---

## git commit

提交到暂存区中:
`git commit`
`git commit -m "<message>"`

修改上一次提交，而不产生新的提交:
`git commit --amend`

---

## git log

`git log [<options>] [<revision range>] [[--] <path>...]`

### options

- `--oneline` 每个提交占一行
- `--graph` 以图形方式显示分支和合并历史
- `--author=<pattern>` 只显示指定作者的提交
- `--since=<date>` 只显示指定日期之后的提交
- `--until=<date>` 只显示指定日期之前的提交
- `--pretty=<format>` 自定义输出格式

---

## git show

默认显示最近一次提交的信息:
`git show [<options>] [<object>]`

### options

- `--pretty=<format>` 自定义输出格式
  - `oneline` 每个提交占一行
  - `format:<string>` 使用自定义格式字符串 (自己查吧，太多了)
- `--color` 彩色输出

### object

- `<branch-name>`
- `<commit-hash>`
- `<commit-hash>:<file-path>`
- `<tag-name>`

---

## git reflog

展示操作历史，而不是和 `git log` 一样的提交历史

查看当前 HEAD 的移动历史:
`git reflog [<branch-name>]`

查看特定分支的历史:
`git reflog show <branch-name>`

将代码回滚到 reflog 中的某个状态:
`git reset --hard <HEAD@{index}>`

---

## git tag

列出所有标签:
`git tag`

创建轻量标签:
`git tag <tag-name> [<commit-hash>]`

创建附注标签:
`git tag -a <tag-name> -m "<message>" [<commit-hash>]`

删除标签:
`git tag -d <tag-name>`

推送标签到远程仓库:
`git push [alias] <tag-name>`

---

## git branch

### 查看分支

`git branch [-a | -r]`

- `-a` 显示所有分支（本地和远程）
- `-r` 仅显示远程分支

查看分支和远程分支的追踪关系，以及当前领先或落后多少提交
`git branch -vv`

### 创建分支

`git branch <branch-name>`

### 移动分支

`git branch -f <branch-name> <commit-hash>`

### 删除分支

`git branch -d | -D [alias] <branch-name>`

- `-d` 安全删除分支（有未合并的更改会报错）
- `-D` 强制删除分支（无论是否有未合并的更改）

### 设置追踪

`git branch -u [alias]/<remote-branch> [<local-branch> = HEAD]`

### 重命名分支

`git branch -m | -M [alias] <old-branch-name> <new-branch-name>`

- `-m` 重命名分支
- `-M` 强制重命名分支（如果新名称已存在）

### 重命名远程分支

`git branch -m <old-branch-name> <new-branch-name>` ：重命名本地分支。

`git push -d <remote_name> <old-branch-name>` ：删除远程分支的旧名称。

`git push <remote_name> <new-branch-name>` ：将本地新名称的分支推送到远程仓库。

`git branch --set-upstream <remote_name/newName> <new-branch-name>` ：设置分支关联。

---

## git checkout

### 操作分支 (Branching)

切换到前一个分支：
`git checkout -`

创建并切换到一个跟踪远程分支的新本地分支:
`git checkout -b <local-branch> [alias]/<remote-branch>`

设置当前分支跟踪远程分支:
`git branch --set-upstream-to=[alias]/<远程分支名>`

切换分支:
`git checkout [-b | -f] <branch-name>`

#### 选项

- `-b` 创建并切换到新分支
- `-f` 强制切换分支

### 操作文件 (Restoring Files)

`git checkout [commit-hash] -- <file-name>`

### 操作提交 (Detached HEAD)

注意此时会进入头指针分离状态
`git checkout <commit-hash>`

---

## git switch

`git switch [-c | -f] <branch-name>`

### 选项

- `-c` 创建并切换到新分支
- `-f` 强制切换分支

`git switch -c <new-branch-name> <commit-hash>` 创建一个自 commit 的新分支并切换到此

`git switch <commit_hash>` 同样进入头指针分离状态

---

## git merge

合并 `<branch-name>` 分支到当前分支:
`git merge <branch-name>`

`git merge --abort` 中止合并并还原到合并前的状态

`git merge --continue` 继续之前中止的合并操作

---

## git rebase

`git rebase` 命令用于将一个分支上的更改移到另一个分支之上。它可以帮助保持提交历史的线性，减少合并时的冲突。

### 基本用法

`git checkout <topicbranch>`

`git rebase <basebranch>`

`git rebase <basebranch> [topicbranch = HEAD]`

前者是基

把后者放到前者的分支上

如果有冲突，手动解决后执行 `git rebase --continue`

### 交互式变基

将指定提交之后的所有提交进行交互式变基(此时可改变顺序):
`git rebase -i <commit-hash>`

---

## git cherry-pick

将指定的提交应用到当前分支:
`git cherry-pick <commit-hash>`

---

## git reset

回退版本

`git reset [--soft | --mixed | --hard] [HEAD] [file...]`

- `--mixed` 为默认，重置暂存区，工作目录不变
- `--soft` 暂存区工作目录不变
- `--hard` 暂存区和工作目录都会还原到提交状态

---

## git revert

`git revert <commit-hash>` : 通过创建一个新提交来撤销指定修改

`git revert -n | --no-commit <commit-hash>` ：撤销指定提交，但不自动创建新提交。

---

## git remote

`git remote -v` ：列出当前仓库中已配置的远程仓库，并显示它们的 URL。

`git remote add <remote_name> <remote_url>` ：添加一个新的远程仓库。

`git remote remove <remote_name>` ：删除一个已配置的远程仓库。

`git remote rename <old_name> <new_name>` ：重命名一个已配置的远程仓库。

`git remote set-url <remote_name> <new_url>` ：更改已配置远程仓库的 URL。

`git remote show <remote_name>` ：显示有关指定远程仓库的详细信息。

---

## git fetch

从远程仓库获取最新的更改，但不合并到当前分支。
`git fetch [alias]`

---

## git pull

`git fetch` & `git merge` 的组合命令，从远程仓库获取最新更改并合并到当前分支。

`git pull [alias] [branch]`

`git pull --rebase` 使用变基方式合并远程更改。

---

## git push

`git push [alias] [local-branch]:[remote-branch]`

如果省略 `[remote-branch]`，则默认将本地分支推送到远程仓库的同名分支。

- `-u` 设置上游分支，使得以后可以直接使用 `git push` 和 `git pull` 而不需要指定远程仓库和分支。
- `-f` 强制推送，覆盖远程分支的内容（谨慎使用，可能会丢失数据）。

`git push origin :<branch-name>` 删除远程分支

---

## git stash

存储当前工作区的修改，以便稍后恢复:
`git stash push [-m <message>]`

查看存储列表
`git stash list`

`stash@{0}` 是最后一次修改

恢复存储状态
`git stash apply`

`git stash apply stash@{n}`

恢复并删除最后一次 stash
`git stash pop`

删除 stash（后面的stash序号都会变化）
`git stash drop stash@{1}`

删除所有存储的修改
`git stash clear`
