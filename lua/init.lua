--- @class Massage
--- @field _AUTHORS string
--- @field _SOURCE string
--- @field _VERSION string
--- @field _CHANGETAG string
--- @field schema_from_path fun(path: string): Schema
--- @field build_schema fun(schema: Schema, path: string, require_path: string)
local massage = {}

local format = require("format")
local generate = require("generate")

massage.schema_from_path = format.parse_from_path
massage.build_schema = generate.build_schema

massage._AUTHORS = "yyna [yyna.xyz]"
massage._SOURCE = "https://github.com/yynaa/massage"
massage._VERSION = "0.2.0"
massage._CHANGETAG = "0.25.07.1"

return massage
