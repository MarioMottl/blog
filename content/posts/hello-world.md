+++
title = "Hello, World"
date = 2025-01-01
description = "Testing all blog components - code blocks, callouts, dividers, and TOC."
[taxonomies]
tags = ["meta", "rust"]
+++

First post. Testing all available components.

## Code blocks

Plain block with lang tag and copy button:

```rust
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("{}", greet("world"));
}
```

Block with external link button:

{% codeblock(link="https://godbolt.org/z/Mxjhh8bzb", link_label="godbolt") %}
```rust
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("{}", greet("world"));
}
```
{% end %}

Inline `code` looks like this.

{{ divider(n="01", label="CALLOUT BLOCKS") }}

## Callouts

{% callout(label="NOTE") %}
Default callout. Uses the green accent. Good for general notes and observations.
{% end %}

{% callout(type="insight", label="KEY INSIGHT") %}
Teal callout. Use for important takeaways, things worth remembering.
{% end %}

{% callout(type="note", label="INFO") %}
Blue callout. Good for background context or supplementary information.
{% end %}

{% callout(type="warn", label="WARNING") %}
Yellow callout. Use for gotchas, caveats, things that need attention.
{% end %}

{% callout(type="danger", label="DANGER ZONE") %}
Salmon callout. Reserve for unsafe code, footguns, things that can go wrong badly.
{% end %}

{{ divider(n="02", label="MORE LANGUAGES") }}

## Other languages

```zig
const std = @import("std");

pub fn main() void {
    const msg = "hello, world";
    std.debug.print("{s}\n", .{msg});
}
```

```c
#include <stdio.h>

int main(void) {
    printf("hello, world\n");
    return 0;
}
```

```toml
[package]
name = "example"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1", features = ["derive"] }
```

{{ divider(n="03", label="COMPARISON TABLE") }}

## Tables

{% table() %}
| Feature | Rust | Zig | C |
|---|---|---|---|
| Memory safety | Compile-time borrow checker | Optional, manual | Manual |
| Build system | Cargo | Built-in `zig build` | Make / CMake |
| Error handling | `Result<T, E>` | Error unions | Return codes |
| Null safety | No null, use `Option<T>` | Optional types `?T` | Nullable pointers |
| Compile speed | Slow | Fast | Fast |
| Runtime | Zero-cost abstractions | Zero-cost | Zero-cost |
{% end %}
