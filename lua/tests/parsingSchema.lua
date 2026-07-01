local format = require("format")

return {
	testParsingSimple = function()
		format.parse_from_path("../examples/simple.toml")
	end,
}
