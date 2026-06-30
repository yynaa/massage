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


## Rust

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

## TS

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

## Lua (LuaJIT & LuaCATS)

> [!IMPORTANT]
> Lua has no 64-bit integer type, so u64 and i64 will:
> - serialize as 0x00000000
> - deserialize as 0

```lua
--- @type Massage
local massage = require("lib.massage")

-- build your message
local schema = massage.schema_from_path("../simple.toml")
massage.build_schema(schema, "generated")

-- use your message as soon as it is built
local Simple = require("generated.simple")

-- create a new message
local message = Simple.Hello.new("Sophie"):_wrap()
print("message:")
print(inspect(message))

-- edit your message
message.command.name = "Not Sophie"

-- serialize your message
local ser = message:_serialize()

-- deserialize your message
local de = Simple.deserialize(ser)
```

### Bundling

Massage is made to be used in various systems, so that it requires to be bundled in a single file.  
it also comes with `_primitives.lua`, the ser/de library used by generated files.  
these two files need to be located **in the same folder** for them to work.

you can bundle Massage yourself with
```sh
make bundle_lua
```
a folder will be created at `lua/dist/` containing the bundled library & runtime library.

## TODO

- [ ] make a proper primitives lib for Rust
- [ ] make a proper primitives lib for TS
- [ ] tests for Lua
- [ ] attempt support for u64/i64/f64 in Lua
