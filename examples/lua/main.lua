local inspect = require("inspect")

-- welcome to Massage!

--- @type Massage
--- @diagnostic disable-next-line: assign-type-mismatch
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
print("serialized:")
print(inspect(ser))

-- deserialize your message

local de = Simple.deserialize(ser)
print("deserialized:")
print(inspect(de))
