local ser = {}

local etlua = require("lib.etlua")

local casing = require("casing")

--- @param schema Schema
--- @return string
function ser.serialize_schema(schema)
	local template = etlua.compile([[
function(self) return self.command:_serialize() end]])
	local output = template({})
	return output
end

--- @param schema Schema
--- @param name string
--- @param command Command
--- @return string
function ser.serialize_command(schema, name, command)
	local argument_fields_cased = {}
	for i, arg in ipairs(command.arguments) do
		table.insert(
			argument_fields_cased,
			{ name_field = casing.snake(arg.name), format_ser = casing.snake(arg.format) }
		)
	end

	local template = etlua.compile([[
function(self)
  local bytes = string.char(<%- command_id %>)
<% for i, arg in ipairs(arguments) do -%>
  bytes = bytes .. primitives.ser_<%- argument_fields_cased[i].format_ser -%>(self.<%- argument_fields_cased[i].name_field -%>)
<% end -%>
  return bytes
end]])
	local output = template({
		command_id = command.id,
		arguments = command.arguments,
		argument_fields_cased = argument_fields_cased,
	})
	return output
end

return ser
