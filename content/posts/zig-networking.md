+++
title = "WIP: TCP and UDP Networking in Zig 0.16"
date = 2025-05-31
description = "My experience with the new std.Io.net API"
[taxonomies]
tags = ["zig", "networking"]
+++

{% callout(type="danger", label="Disclaimer") %}
This post is still very much WIP(Work in progress). I am still trying to wrap my head around `std.Io` and `std.Io.net`

Until then this post will be treated as a living document.
{% end %}

[Zig 0.16](<https://ziglang.org/download/0.16.0/release-notes.html>) ships a new `std.Io` abstraction that replaces the "old" direct-`posix` networking pattern.  
Most resources online still show the old way. I wanted to cover what works (on my machine) in 0.16 based on my understanding of `lib/std/Io/net.zig`.

TLDR here is the code if you just want to poke around: [codeberg.org/MarioMottl/zignet](<https://codeberg.org/MarioMottl/zignet>)

{{ divider(n="01", label="THE NEW API") }}

## std.Io.net

Everything lives under `std.Io.net`.  
The two entry points are:

{% table() %}
| Goal | Call | Returns |
|---|---|---|
| TCP server | `addr.listen(io, .{ .mode = .stream })` | `net.Server` |
| UDP socket | `addr.bind(io, .{ .mode = .dgram })` | `net.Socket` |
| TCP client | `addr.connect(io, .{ .mode = .stream })` | `net.Stream` |
{% end %}

For IPv4 `net.IpAddress.parseIp4(host, port)` parses the address.  
For IPv6 `net.IpAddress.parseIp6(host, port)` parses the address.  

All operations take an `Io` handle - obtained from `init.io`,  
through the new `main` signature: `pub fn main(init: std.process.Init)`.

For more information see: [Juicy Main](<https://ziglang.org/download/0.16.0/release-notes.html#Juicy-Main>)

{% callout(type="note", label="INFO") %}
The following examples will only focus on `IPv4`.
{% end %}

{{ divider(n="02", label="TCP SERVER") }}

## TCP server


{% codeblock(filename="tcp.zig") %}
```zig
const std = @import("std");
const Io = std.Io;
const net = std.Io.net;

const debug_print = std.debug.print;

pub fn main(init: std.process.Init) !void {
    const io = init.io;

    const addr = try net.IpAddress.parseIp4("0.0.0.0", 2100);
    var server = try addr.listen(io, .{ .mode = .stream });
    defer server.deinit(io);
    debug_print("TCP listening on 0.0.0.0:2100\n", .{});

    while (true) {
        var stream = try server.accept(io);
        defer stream.close(io);
        debug_print("Client connected\n", .{});

        var read_buf: [4096]u8 = undefined;
        var write_buf: [4096]u8 = undefined;
        var reader = stream.reader(io, &read_buf);
        var writer = stream.writer(io, &write_buf);

        while (true) {
            // SEE: Caveats underneath
            reader.interface.fillMore() catch break;
            const chunk = reader.interface.buffered();
            if (chunk.len == 0) continue;
            try writer.interface.writeAll(chunk);
            try writer.interface.flush();
            reader.interface.tossBuffered();
        }

        debug_print("Client disconnected\n", .{});
    }
}
```
{% end %}

`net.Server.accept` blocks until a client connects and returns a `net.Stream`.  
`stream.reader` and `stream.writer` wrap it in buffered I/O both require caller-provided backing buffers.

{% callout(type="warn", label="Caveats") %}

`pub fn fillMore(r: *Reader)` is used because it does exactly **one** syscall and returns whatever arrived. For my `echo-server` example this is exactly what we want.  
`fn fill(r: *Reader, n: usize)` blocks until **exactly n bytes** are in the buffer.  
If the stream closes beforehand `fill(...)` will return an `error.EndOfStream`.

`readSliceShort(&buf)` loops until the buffer is full, returning a short count only if the stream ends early.  
`readSliceAll(&buf)` does the same but returns `error.EndOfStream` instead of a short count if the stream ends early.  

`readAlloc(allocator, len)` is a shortcut for `readSliceAll` - allocates `len` bytes via `allocator` and fills them from the stream.  

Only `fillMore(...)` is not blocking AFAIK.

{% end %}

{% codeblock(filename="tcp.zig::Read/Write API") %}
```zig
reader.interface.fillMore() catch break;
const chunk: []u8 = reader.interface.buffered(); // slice into read_buf
try writer.interface.writeAll(chunk);            // copy to write_buf
try writer.interface.flush();                    // drain write_buf to socket
reader.interface.tossBuffered();                 // mark bytes consumed
```
{% end %}

{{ divider(n="03", label="TCP CLIENT") }}

## TCP client

{% codeblock(filename="tcp_client.zig") %}
```zig
const std = @import("std");
const Io = std.Io;
const net = std.Io.net;

const print = std.debug.print;

pub fn main(init: std.process.Init) !void {
    const io = init.io;

    const addr = try net.IpAddress.parseIp4("127.0.0.1", 2100);
    var stream = try addr.connect(io, .{ .mode = .stream });
    defer stream.close(io);
    print("Connected to 127.0.0.1:2100\n", .{});

    var read_buf: [4096]u8 = undefined;
    var write_buf: [4096]u8 = undefined;
    var reader = stream.reader(io, &read_buf);
    var writer = stream.writer(io, &write_buf);

    try writer.interface.writeAll("Hello from TCP client!\n");
    try writer.interface.flush();

    reader.interface.fillMore() catch {};
    const chunk = reader.interface.buffered();
    print("Echo: {s}", .{chunk});
}
```
{% end %}

`addr.connect` gives back the same `net.Stream` type as `server.accept` - the read/write API is identical on both ends.

{{ divider(n="04", label="UDP SERVER") }}

## UDP server

UDP is simpler. No connections, no streams, no buffering layer.

{% codeblock(filename="udp.zig") %}
```zig
const std = @import("std");
const Io = std.Io;
const net = std.Io.net;

const debug_print = std.debug.print;

pub fn main(init: std.process.Init) !void {
    const io = init.io;

    const addr = try net.IpAddress.parseIp4("0.0.0.0", 2101);
    var socket = try addr.bind(io, .{ .mode = .dgram });
    defer socket.close(io);
    debug_print("UDP listening on 0.0.0.0:2101\n", .{});

    var buf: [65536]u8 = undefined;

    while (true) {
        // Blocks until a datagram arrives; msg.from holds sender address
        const msg = try socket.receive(io, &buf);
        debug_print("Received {d} bytes from {}\n", .{ msg.data.len, msg.from });
        try socket.send(io, &msg.from, msg.data);
    }
}
```
{% end %}

`socket.receive` returns `net.IncomingMessage` with two fields:
- `msg.data` - slice into your buffer containing the received bytes
- `msg.from` - `net.IpAddress` of the sender, ready to pass straight back to `send`

{{ divider(n="05", label="UDP CLIENT") }}

## UDP client

{% codeblock(filename="udp_client.zig") %}
```zig
const std = @import("std");
const Io = std.Io;
const net = std.Io.net;

const print = std.debug.print;

pub fn main(init: std.process.Init) !void {
    const io = init.io;

    // Bind to port 0 - OS assigns an ephemeral port so we can receive the echo
    const local_addr = try net.IpAddress.parseIp4("0.0.0.0", 0);
    var socket = try local_addr.bind(io, .{ .mode = .dgram });
    defer socket.close(io);

    const server_addr = try net.IpAddress.parseIp4("127.0.0.1", 2101);
    try socket.send(io, &server_addr, "Hello from UDP client!\n");
    print("Sent to 127.0.0.1:2101\n", .{});

    var buf: [65536]u8 = undefined;
    const msg = try socket.receive(io, &buf);
    print("Echo: {s}", .{msg.data});
}
```
{% end %}

Bind to port `0` before sending - the OS assigns an ephemeral port, which lets the server's echo reach us.
Sending without binding first would leave no return address for the reply.

{{ divider(n="06", label="SUMMARY") }}

## Key takeaways

{% table() %}
| | TCP | UDP |
|---|---|---|
| Bind call | `addr.listen(io, .{ .mode = .stream })` | `addr.bind(io, .{ .mode = .dgram })` |
| Returns | `net.Server` | `net.Socket` |
| Accept / receive | `server.accept(io)` -> `net.Stream` | `socket.receive(io, &buf)` -> `net.IncomingMessage` |
| Send | `stream.writer` + `writeAll` + `flush` | `socket.send(io, &dest, data)` |
| Close | `server.deinit(io)` / `stream.close(io)` | `socket.close(io)` |
{% end %}

{% callout(type="warn", label="BUFFERED WRITER REQUIRES flush()") %}
`writeAll` fills the internal write buffer. Nothing is sent to the socket until `flush()` is called.
Forgetting `flush()` means silent data loss - the bytes sit in the buffer and are dropped when the stream closes.
{% end %}


## Sources
[Zig Source-Code](<https://codeberg.org/ziglang/zig>)  
[std.Io.net](<https://codeberg.org/ziglang/zig/src/branch/master/lib/std/Io/net.zig>)  
[fillMore](<https://codeberg.org/ziglang/zig/src/commit/7be3b1de455c9cf247dc3ab8c4fd75c9b16d77cf/lib/std/Io/Reader.zig#L1136>)  
[readSliceShort](<https://codeberg.org/ziglang/zig/src/commit/7be3b1de455c9cf247dc3ab8c4fd75c9b16d77cf/lib/std/Io/Reader.zig#L679>)  
[readSliceAll](<https://codeberg.org/ziglang/zig/src/commit/7be3b1de455c9cf247dc3ab8c4fd75c9b16d77cf/lib/std/Io/Reader.zig#L664>)  
[readAlloc](<https://codeberg.org/ziglang/zig/src/commit/7be3b1de455c9cf247dc3ab8c4fd75c9b16d77cf/lib/std/Io/Reader.zig#L743>)  
[Code-Snippets](<https://codeberg.org/MarioMottl/zignet>)  
