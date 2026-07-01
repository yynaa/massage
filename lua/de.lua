local de = {}

local etlua = require("lib.etlua")

local casing = require("casing")

--- @param schema Schema
--- @return string
function de.deserialize_schema(schema)
	local command_helpers = {}
	for name, command in pairs(schema.commands) do
		command_helpers[name] = {
			name = casing.pascal(name),
			id = command.id,
		}
	end

	local template = etlua.compile([[
function(bytes)
  if #bytes < 1 then return nil end
  local command_id = bytes:byte()
  bytes = bytes:sub(2)
  local result
<% for name, command in pairs(command_helpers) do -%>
  if command_id == <%- command.id -%> then result = <%- schema_name -%>.<%- command.name -%>.deserialize(bytes) end
<% end -%>
  if result then return <%- schema_name -%>.new(result) end 
  return nil
end]])
	local output = template({
		command_helpers = command_helpers,
		schema_name = casing.pascal(schema.name),
	})
	return output
end

--- @param format ArgumentFormat
--- @return string
local function format_length(format)
	if format == "U8" or format == "I8" or format == "Bool" then
		return "function(bytes) return 1 end"
	elseif format == "U16" or format == "I16" then
		return "function(bytes) return 2 end"
	elseif format == "U32" or format == "I32" or format == "F32" then
		return "function(bytes) return 4 end"
	elseif format == "U64" or format == "I64" or format == "F64" then
		return "function(bytes) return 8 end"
	elseif format == "String" then
		return [[
function(bytes)
  return bytes:find(string.char(0))
end
]]
	end
	return "function(bytes) return 0 end"
end

--- @param schema Schema
--- @param name string
--- @param command Command
--- @return string
function de.deserialize_command(schema, name, command)
	local argument_helpers = {}
	for i, arg in ipairs(command.arguments) do
		table.insert(argument_helpers, {
			name_field = casing.snake(arg.name),
			format_ser = casing.snake(arg.format),
			format_length = format_length(arg.format),
		})
	end

	local argument_names = {}
	for i, arg in ipairs(command.arguments) do
		table.insert(argument_names, casing.snake(arg.name))
	end

	local template = etlua.compile([[
function(bytes)
<% for i, arg in ipairs(argument_helpers) do -%>
  local <%- arg.name_field -%>_length = (<%- arg.format_length -%>)(bytes)
  if not <%- arg.name_field -%>_length or #bytes < <%- arg.name_field -%>_length then return nil end
  local <%- arg.name_field -%>_bytes = bytes:sub(1, <%- arg.name_field -%>_length)
  bytes = bytes:sub(<%- arg.name_field -%>_length + 1)
  local <%- arg.name_field -%> = primitives.de_<%- arg.format_ser -%>(<%- arg.name_field -%>_bytes)
<% end -%>
  return <%- schema_name -%>.<%- command_name %>.new(<%- table.concat(argument_names, ", ") -%>)
end]])
	local output = template({
		command_name = casing.pascal(name),
		arguments = command.arguments,
		argument_helpers = argument_helpers,
		argument_names = argument_names,
		schema_name = casing.pascal(schema.name),
	})
	return output
end

return de
