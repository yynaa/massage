local format = {}

--- @class Schema
--- @field name string
--- @field description string | nil
--- @field commands table<string, Command>

--- @class Command
--- @field id integer
--- @field description string | nil
--- @field arguments Argument[]

--- @class Argument
--- @field name string
--- @field description string | nil
--- @field format ArgumentFormat

--- @alias ArgumentFormat "String" | "U8" | "U16" | "U32" | "U64" | "I8" | "I16" | "I32" | "I64" | "F32" | "F64"

local tinytoml = require("lib.tinytoml")

--- @param path string
--- @return Schema
function format.parse_from_path(path)
	--- @type Schema
	local obj = tinytoml.parse(path)
	if not obj.commands then
		obj.commands = {}
	end
	for name, command in pairs(obj.commands) do
		if not command.arguments then
			command.arguments = {}
		end
	end
	return obj
end

return format
