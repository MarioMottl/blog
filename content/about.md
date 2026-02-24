+++
title = "About"
date = 2026-04-26
template = "page.html"
+++

Hey, I'm Mario - software developer from Vienna.

I work at [in-tech engineering GmbH](https://www.in-tech.com/) on C++ and Rust stuff.
Before that I spent almost four years at Bosch in embedded software, which is where I picked up
a lasting obsession with systems that have to be correct.

A big chunk of my job right now is massaging legacy C++ codebases into something a future
developer won't curse at - modernizing, cleaning up UB, adding tests where there weren't any.
Unglamorous work, but I like it.

## [Rust](<https://rust-lang.org/>)

I'm the Rust guy at work. I give internal talks on it, advocate for it where it makes sense,
and help people get past the initial "why won't the borrow checker let me do this" phase.
I've talked about ownership, memory safety, the string type situation.
Watching teammates go from skeptical to converted is the best part.

Talks:
- [Rust Ecosystem](<todo::link_to_slides>)
- [Rust Strings](<todo::link_to_slides>)

## [Zig](<https://ziglang.org/>)

Zig has been pulling a lot of my attention lately.
What hooked me is that it's (somewhat) lower level than C - every allocation is explicit, every allocator is passed around as a parameter, nothing happens behind your back.
You can read the code and know exactly what memory does.

Andrew Kelley's talks got me interested, [Ziglings](<https://codeberg.org/ziglings/exercises>) got me writing it.
The language has strong opinions and doesn't apologize for them, which I respect (e.g. no private public in structs, no function colouring).

The project's strict no-AI policy is also a big part of why I like it.

Talks from Andrew Kelley that I recommend:
- [A Practical Guide to Applying Data Oriented Design (DoD)](<https://www.youtube.com/watch?v=IroPQ150F6c>)
- [A Systems-Minded Approach to Creating a Music Player Application by Andrew Kelley](<https://www.youtube.com/watch?v=SCLrNqc9jdE>)
- [Don't Forget To Flush by Andrew Kelley](<https://www.youtube.com/watch?v=f30PceqQWko>)

Talks:
- [Allocators](<todo::link_to_slides>)

## Projects

Outside of work, the projects are all over the place.

I do Advent of Code every year. I've written a C++ argparser, a Twitch bot in both Go and Rust,  
and a devcontainer for GCC's reflection proposal back before it got merged into trunk
(inspired by [Coder2k's](<https://www.twitch.tv/coder2k>) devcontainer for the [clang reflection fork](<https://github.com/mgerhold/reflection-dev-container>)).  
I package [Zig](<https://codeberg.org/MarioMottl/zig-arch/>) and [ZLS](<https://codeberg.org/MarioMottl/zls-arch>) for Arch myself because the official repos are slow to update.  
I built a `Cycling Weather` Android app that ranks the next few days for riding based on rain, wind, and temperature.  
I also sometimes reverse-engineer parts of games I really like. My latest obsession is `Far Far West`,  
where I am porting a save-file editor from loose Python files to a fully fleshed-out [application written in Zig.](<https://codeberg.org/MarioMottl/ffs_save_editor>)  
I wrote a [Minecraft mod](<https://codeberg.org/MarioMottl/BetterAutomatedSortingSystem>) that overhauls hopper logic to make automatic item sorting actually practical in Kotlin.

## Font

This blog uses a single self-hosted typeface for everything - headings, body text, code, labels:

- **[Iosevka Custom](https://codeberg.org/MarioMottl/IosevkaCustom-Plan)** - built from a custom plan with ligatures enabled

## Find me

- [Codeberg](https://codeberg.org/MarioMottl)
- [LinkedIn](https://www.linkedin.com/in/mario-mottl-533074231/)
