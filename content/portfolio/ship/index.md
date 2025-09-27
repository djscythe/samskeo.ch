+++
categories = ["programming"]
date = "2025-08-26"
title = "ship"
+++

ship (simple hypertext includes preprocessor) is a toy HTML preprocessor
initially built specifically to handle this site, until the page grew too
complex for the payoffs of maintaining my own tool to justify the effort.
nevertheless, it served as an excellent learning exercise for recursive
directory traversal, simple regex-based parsing, and cross-platform
file-handling in Rust.

ship works on server-side includes directives, an interpreted scripting
language that originated in the now-discontinued NCSA HTTPd, and was later
adopted by some of the most popular web servers today, such as Apache HTTP
Server and nginx. they are formed like
`<!--#include virtual="/path/to/file" -->`, which is a very simple syntax that
can be parsed merely using a regex[^1]:

```regex
([ \t]*)<!--#include +virtual= *"(.*?)" *-->
```

this uses two capture groups: one to capture any tabs or spaces before the
directive, so that the included HTML can be correctly indented; and another to
capture the path to the file to be included. it is forgiving with whitespace in
some locations, but not in others, determined according to some empirical
experiments i ran to see where Apache and nginx would accept spurious spaces.

the core of the program is a function called `traverse`, with a signature of:

```rust
pub fn traverse(
    from: impl AsRef<Path>,
    to: impl AsRef<Path>,
    f: &mut impl FnMut(&Path, &Path) -> Result<()>,
    ignore: bool,
) -> Result<()>
```

this function takes four parameters: the path to process files from; the path
to output the results to; a callback to execute on each file; and a boolean
switch to determine if hidden ('dotted') files should be ignored. originally,
the HTML-specific logic was contained within this function, but that lead to
separation-of-concerns issues; therefore, the parameter `f` was added, into
which the function concerned with processing HTML (here called `process`) can
be passed. This is very idiomatic in a functional programming style, and can be
considered a variation on the dependency injection design pattern.

however, this lead to an interesting lifetime issues, because `process`'s
signature was:

```rust
pub fn process(
    path: impl AsRef<Path>,
    target: impl AsRef<Path>,
) -> Result<()>
```

`AsRef` contains a so-called 'hidden' lifetime which isn't apparent to the
caller,  leading to this (simplified for clarity, but still somewhat cryptic)
error:

```samp {class="error"}
implementation of `FnMut` is not general enough
`fn(&'2 Path, &Path) -> Result<()>` must implement `FnMut<(&'1 Path, &Path)>`, for any lifetime `'1`...
...but it actually implements `FnMut<(&'2 Path, &Path)>`, for some specific lifetime `'2`
```

'not general enough' is a pretty wonky way of telling us that the lifetimes in
`process`'s parameters are being bound to early, which errors because
`traverse` is expecting a much more general higher-ranked lifetime. the
solution was to wrap `process` in a closure before passing it to `traverse`:
`|p, t| process(p, t)`. this might look redundant, and the functional
programmer in me is screaming at me to eta-reduce it, but as it turns out the
closure is doing some magic whereby it delays the binding of process's
lifetime, so it is necessary.

i also ran into the perennial issue of the Windows filesystem working
completely differently from anything Unix-derived, which is what i'm used to
working on. on Unix, checking if a file is hidden is very easy: if the first
character of its filename is `.` (a dot), then it is hidden. not is it such on
windows. i ended up having to import a magic constant from the windows-sys
crate, bit-and the file's file attributes[^2] against said constant, and then
check if the whole thing was equal to zero or not.

```rust
fn is_hidden(path: impl AsRef<Path>) -> io::Result<bool> {
    fs::metadata(path)
        .map(|m| m.file_attributes() & FILE_ATTRIBUTE_HIDDEN != 0)
}
```

i then discovered that quite often users will just ignore the whole file
attributes system and use a dot like on Unix, so i ended up having to include a
check for this on Windows as well, making the whole endeavour nearly pointless!
thanks Bill.

as always you can [view the source code](https://codeberg.org/djscythe/ship) on
my Codeberg. the repository has been stagnant for quite a while, but if you
have any ideas for fixes, features, or improvements, issues and PRs are much
appreciated.

[^1]: Rust's official regex crate does have some syntax idiosyncrasies, but as
far as i can tell this one is simple enough to also work in any
PCRE2-compatible regex engine.

[^2]: the getting of which requires an extra `stat` (or whatever it's named on
Windows) call, which has the possibility of erroring.
