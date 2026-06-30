--- @class Massage
--- @field schema_from_path fun(path: string): Schema
--- @field build_schema fun(schema: Schema, path: string)
local massage = {}

local format = require("format")
local generate = require("generate")

massage.schema_from_path = format.parse_from_path
massage.build_schema = generate.build_schema

return massage
