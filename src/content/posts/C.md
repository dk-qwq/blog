---
title: C/C++ 记忆点
published: 2026-01-16
description: ''
image: ''
tags: [C, C++, 速查, 语言特性]
category: 'C/C++'
draft: false 
lang: ''
pinWeight: 2
---

## 编译与预处理

C++ 编译中 aka 的含义： also known as（也被称为）

eg. "size_t"(aka "unsigned long")

### 神秘宏

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

### std::source_location 输出有关源代码的特定信息

```cpp
#include <iostream>
#include <source_location>
#include <string_view>
 
void log(const std::string_view message,
         const std::source_location location =
               std::source_location::current())
{
    std::clog << "file: "
              << location.file_name() << '('
              << location.line() << ':'
              << location.column() << ") `"
              << location.function_name() << "`: "
              << message << '\n';
}
 
int main() {
    log("Hello world!"); // line 25
}
```

---

## 内存管理

### 动态内存分配

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

---

## 字符串与视图

### std::string_view 字符串视图

性能优于 `const string&`

---

## 标准库工具

### std::numeric_limits

### std::optional

#### 构造和初始化

* 默认构造：`std::optional<T> opt;`（未初始化）
* 值构造：`std::optional<T> opt(value);`（初始化为 value）
* `std::nullopt`：`std::optional<T> opt = std::nullopt;`（显式未初始化）
* `std::make_optional`：`auto opt = std::make_optional(value);`（工厂函数构造）
* `std::optional<T> opt(std::in_place, args...)`:（原地构造 T）

#### 访问和检查

* `has_value()`：检查是否包含值
* `operator bool()`：隐式转换为 bool，表示是否包含值
* `value()`：获取包含的值，若未初始化则抛出 std::bad_optional_access
* `value_or(default)` ：获取包含的值，若未初始化则返回 default

#### 修改和重置
    
* emplace(args...)：原地构造一个新值，替换现有值
* reset()：重置 optional，使其不包含值

---

## 可变参数

### C 原生可变数量参数

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
