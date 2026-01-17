---
title: C/C++ 记忆点
published: 2026-01-16
description: ''
image: ''
tags: [C/C++]
category: 'C/C++'
draft: false 
lang: ''
---

C++ 编译中 aka 的含义： also known as（也被称为）

eg. "size_t"(aka "unsigned long")

## 动态内存分配

```c
void* malloc (size_t size); 
void free (void* ptr);
```

```c
void* calloc(size_t num_elements,size_t element_size);
// 开辟 num 个大小为 size 的空间，且初始化为 0
```

```c
void* realloc(void* ptr,size_t new_size);
// 把一块原有的空间重新分配为 size 大小
```

## 神秘宏

```cpp
__FILE__ (源文件名)
__LINE__ (当前行数)

#line 行号 [文件名]
#line 100 "a.c"

__func__ / __FUNCTION__
(当前函数名)

__DATE__ (日期)
__TIME__ (时间 hh:mm:ss形式)
```

## C 原生可变数量参数

```cpp
#include <stdarg.h>
// va_list 存储可变参数的类型
// va_start(args, count) 初始化 va_list
// va_arg(args, type) 取出 args 下一个参数，类型为 type
// va_end 清空（必带）

// 计算可变参数的和
int sum(int count, ...) {
    int total = 0;
    va_list args;
   
    // 初始化 args 以访问可变参数
    va_start(args, count);
   
    // 逐个访问可变参数
    for (int i = 0; i < count; i++) {
        total += va_arg(args, int);
    }
   
    // 清理 args
    va_end(args);
   
    return total;
}
```