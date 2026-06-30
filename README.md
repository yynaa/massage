# Massage
*it hurts my back to look into so many **wires**, I'd well need a **massage**...*

**a simple command-like tailor-made message library for a handful of languages**

[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)

write a schema...
```toml
# this Massage example shows a few simple messages you might want to send.

name = "simple" # this will be the name of your structures
description = "a simple communication protocol"

[commands.hello]
id = 1 # unique command identifier
description = "say hello!"

[[commands.hello.arguments]]
format = "String" # may be String, U8, U16, U32, U64, I8, I16, I32, I64, F32, F64
name = "name" # unique argument identifier
description = "your name"

[commands.goodbye]
id = 2
description = "say goodbye..."
```

...and now, for your language of choice, build and import your messages:
```rs
let mut message: Simple = Hello {
  name: "Sophie".into(),
}
.into()
```
```ts
const message = new Simple(new Hello("Sophie"));
```
```lua
local message = Simple.Hello.new("Sophie"):_wrap()
```

## Rationale 

- easy communication between languages by any networking means possible, as long as it can send bytes
- no runtime dependencies, only generated files to ensure maximum compatibility in embedded systems
- minimum build dependencies, for the same reason as above
- language L generates code for language L, don't make existing stacks more complex
- MIDI-like messages
- no schema version control (who needs that?)

## Features table

| **feature** | **Rust** | **TS** | **LuaJIT + LuaCATS** |
|---:|:---:|:---:|:---:|
| building message definitions | ✅ | ✅ | ✅ |
| post-build instant availability | ✅<br>through build.rs | ❌<br>requires a build script | ✅<br>through require() |
| building for external crate | ✅ | ✅ | ✅ |
| manipulating messages | ✅ | ✅ | ✅ |
| ser/de | ✅ | ✅ | ✅ |
| ser/de of large integer types<br>(u64 and i64) | ✅ | ✅ | ❌<br>Lua only has f64 |

## Rust

```rs
// build.rs
fn main() {
  // generate your schema
  let schema = Schema::from_path("../simple.toml").unwrap();
  // build it, it will appear in the crate's OUT_DIR
  massage::generate::build_schema(schema);
}
```
```rs
// include your message to your crate
mod simple {
  include!(concat!(env!("OUT_DIR"), "/simple.rs"));
}

fn main() {
  // create a new message
  let mut message: Simple = Hello {
    name: "Sophie".into(),
  }
  .into();

  // edit your message
  if let SimpleCommands::Hello(hello) = &mut message.command {
    hello.name = "Not Sophie".into();
  }

  // serialize your message
  let ser = message.serialize();

  // deserialize your message
  let de = Simple::deserialize(ser).unwrap();
}
```

### Implementations

your messages all implement:
- Debug
- Display
- Clone
- PartialEq

your messages **DO NOT** implement:
- Eq
  - Massage supports f32 & f64, which aren't Eq.
  - messages weren't made to be compared directly, and are more so meant to be matched.

## TS

```ts
// build.ts -- or wherever you build your app or wherever you might run setup scripts
import { schema_from_path, generate_schema } from "massage";

// generate the schema
let schema = await schema_from_path("../simple.toml");
// build it
await generate_schema(schema, "./.generated");
```
In `tsconfig.json`:
```json
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
// import your message
import { Hello, Simple } from "@massage/Simple";

// create your message
const message = new Simple(new Hello("Sophie"));

// edit your message
(message.command as Hello).name = "Not Sophie";

// serialize your message
const ser = message.serialize();

// deserialize your message
const de = Simple.deserialize(ser);
```

## LuaJIT & LuaCATS

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

## Technicals/How it works

Massage will generate one file per message. it contains:
- definitions and types
- serialization functions
- deserialization functions

it will also package another file, often imported by name `_primitives`, which contains ser/des for all argument formats.
