# Massage
*it hurts my back to look into so many **wires**, I'd well need a **massage**...*

a simple command-like tailor-made message library for a handful of languages

```toml
# this Massage example shows a few simple messages you might want to send.

name = "simple" # this will be the name of your structures
description = "a simple communication protocol"

[commands.hello]
id = 1 # unique command identifier
description = "say hello!"

[[commands.hello.arguments]]
format = "U8" # may be string, u8, u16, u32, u64, i8, i16, i32, i64
name = "name" # unique argument identifier
description = "your name"

[commands.goodbye]
id = 2
description = "say goodbye :("

[[commands.goodbye.arguments]]
format = "U8"
name = "name"
description = "your name"
```

## Rationale 

- no runtime dependencies, only generated files to ensure maximum compatibility in embedded systems
- minimum build dependencies, for the same reason as above
- language L generates code for language L, don't make existing stacks more complex
- MIDI-like messages
- no schema version control (who needs that?)

## Packages

### Rust

```rs
// build.rs
use massage::format::Schema;

fn main() {
  let schema = Schema::from_path("<path to .toml>").unwrap();
  massage::generate::build_schema(schema);
}
```
```rs
// main.rs
pub mod simple {
  include!(concat!(env!("OUT_DIR"), "/<name of your message>.rs"));
}
```

You can run the example with:
```sh
cargo run
```

### TS

```ts
// build.ts -- or wherever you build your app or might run setup scripts
import { schema_from_path, generate_schema } from "massage";

let schema = await schema_from_path("<path to .toml>");
await generate_schema(schema);
```
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@massage/*": [".generated/*"],
    },
  }
}
```
```ts
import { ... } from "@massage/<Name of your message>";
```

## TODO

- [ ] floating point numbers
- [ ] use nil-terminated strings for arbitrary string sizes
- [ ] message prefixes
- [ ] Lua support
- [ ] testing
  - [ ] Rust
  - [ ] TS
  - [ ] inter-language
