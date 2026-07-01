local generate = {}

local etlua = require("lib.etlua")

local casing = require("casing")
local ser = require("ser")
local de = require("de")

--- @param arg_format ArgumentFormat
--- @return string
local function generate_argument_format(arg_format)
	if arg_format == "String" then
		return "string"
	elseif arg_format == "F32" or arg_format == "F64" then
		return "number"
	elseif arg_format == "Bool" then
		return "boolean"
	else
		return "integer"
	end
end

--- @param name string
--- @param command Command
--- @return string
local function generate_command(schema, name, command)
	local arguments = {}
	for i, arg in ipairs(command.arguments) do
		local description = ""
		if arg.description then
			description = "--- " .. arg.description .. "\n"
		end

		table.insert(arguments, {
			name = casing.snake(arg.name),
			format = generate_argument_format(arg.format),
			description = description,
		})
	end

	local argument_names = {}
	for i, arg in ipairs(command.arguments) do
		table.insert(argument_names, casing.snake(arg.name))
	end

	local command_description = ""
	if command.description then
		command_description = "--- " .. command.description .. "\n"
	end

	local template = etlua.compile([[
<%- command_description -%>
--- @class <%- command_name %>
<% for i, arg in ipairs(arguments) do -%>
<%- arg.description -%>
--- @field <%- arg.name %> <%- arg.format %>
<% end -%>
--- @field _id integer
--- @field _wrap fun(self: <%- command_name %>): <%- schema_name %>
--- @field _serialize fun(self: <%- command_name %>): string

<%- command_description -%>
--- @class <%- command_name %>Interface
--- @field id integer
--- @field deserialize fun(bytes: string): <%- command_name %> | nil
<%- schema_name %>.<%- command_name %> = {}
<%- schema_name %>.<%- command_name %>.id = <%- command_id %>
<%- schema_name %>.<%- command_name %>.deserialize = <%- deserializer %>

<% for i, arg in ipairs(arguments) do -%>
--- @param <%- arg.name %> <%- arg.format %>
<% end -%>
--- @return <%- command_name %>
function <%- schema_name %>.<%- command_name %>.new(<%- table.concat(argument_names, ", ") -%>)
  return {
<% for i, arg in ipairs(arguments) do -%>
    <%- arg.name -%> = <%- arg.name %>,
<% end -%>
    _id = <%- command_id %>,
    _wrap = function(self) return <%- schema_name %>.new(self) end,
    _serialize = <%- serializer %>
  }
end
]])
	local output = template({
		schema_name = casing.pascal(schema.name),
		command_name = casing.pascal(name),
		command_id = command.id,
		command_description = command_description,
		arguments = arguments,
		argument_names = argument_names,
		serializer = ser.serialize_command(schema, name, command),
		deserializer = de.deserialize_command(schema, name, command),
	})
	return output
end

--- @param schema Schema
--- @param require_path string
--- @return string
function generate.generate_schema(schema, require_path)
	local commands = {}
	for name, command in pairs(schema.commands) do
		commands[name] = {
			raw = command,
			code = generate_command(schema, name, command),
			name = casing.pascal(name),
		}
	end

	local command_names = {}
	for name, _ in pairs(schema.commands) do
		table.insert(command_names, casing.pascal(name))
	end

	local schema_description = ""
	if schema.description then
		schema_description = "--- " .. schema.description .. "\n"
	end

	local template = etlua.compile([[
local primitives = require("<%- require_path -%>._primitives")

<%- schema_description -%>
--- @class <%- schema_name %>
--- @field command <%- schema_name %>Command
--- @field _serialize fun(self: <%- schema_name %>): string

<%- schema_description -%>
--- @class <%- schema_name %>Interface
<% for name, command in pairs(commands) do -%>
--- @field <%- command.name %> <%- command.name %>Interface
<% end -%>
--- @field deserialize fun(bytes: string): <%- schema_name %> | nil
local <%- schema_name %> = {}
<%- schema_name %>.deserialize = <%- deserializer %>

--- @alias <%- schema_name %>Command <%- table.concat(command_names, " | ") %>

--- @param inner <%- schema_name %>Command
--- @return <%- schema_name %>
function <%- schema_name %>.new(inner)
  return {
    command = inner,
    _serialize = <%- serializer %>
  }
end

<% for name, command in pairs(commands) do -%>
<%- command.code %>
<% end -%>

return <%- schema_name %>
]])
	local output = template({
		schema_name = casing.pascal(schema.name),
		schema_description = schema_description,
		commands = commands,
		command_names = command_names,
		serializer = ser.serialize_schema(schema),
		deserializer = de.deserialize_schema(schema),
		require_path = require_path,
	})

	return output
end

--- @param schema Schema
--- @param folder string
--- @param require_path string
function generate.build_schema(schema, folder, require_path)
	local code = generate.generate_schema(schema, require_path)
	local file = io.open(folder .. "/" .. casing.snake(schema.name) .. ".lua", "w")
	if file then
		file:write(code)
		file:close()
	end

	local module_dir = debug.getinfo(1, "S").source:match("@?(.*/)")
	local primitives_src_file = io.open(module_dir .. "_primitives.lua", "r")
	local primitives_target_file = io.open(folder .. "/_primitives.lua", "w")
	if primitives_src_file and primitives_target_file then
		local src = primitives_src_file:read("*a")
		primitives_src_file:close()
		primitives_target_file:write(src)
		primitives_target_file:close()
	end
end

return generate
