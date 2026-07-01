require("generate").build_schema(require("format").parse_from_path("../test/schema.toml"), "tests/gen")

Lu = require("lib.luaunit")

TestParsingSchema = require("tests.parsingSchema")
TestSer = require("tests.ser")
TestDe = require("tests.de")
TestRoundtrip = require("tests.roundtrip")

os.exit(Lu.LuaUnit.run())
