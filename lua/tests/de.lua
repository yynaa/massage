--- @diagnostic disable: need-check-nil

local Test = require("tests.gen.test")

return {
	testDeserializeEmpty = function()
		local m = Test.deserialize(string.char(0))
		Lu.assertNotIsNil(m)
	end,

	testDeserializeU8 = function()
		local m = Test.deserialize(string.char(1, 69))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.U8.new(69):_wrap():_serialize())
	end,

	testDeserializeBool = function()
		local m = Test.deserialize(string.char(12, 1))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.Bool.new(true):_wrap():_serialize())
	end,

	testDeserializeU16 = function()
		local m = Test.deserialize(string.char(2, 0x34, 0x12))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.U16.new(0x1234):_wrap():_serialize())
	end,

	testDeserializeU32 = function()
		local m = Test.deserialize(string.char(3, 0x78, 0x56, 0x34, 0x12))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.U32.new(0x12345678):_wrap():_serialize())
	end,

	testDeserializeI8 = function()
		local m = Test.deserialize(string.char(5, 69))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.I8.new(69):_wrap():_serialize())
	end,

	testDeserializeI16 = function()
		local m = Test.deserialize(string.char(6, 0x34, 0x12))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.I16.new(0x1234):_wrap():_serialize())
	end,

	testDeserializeI32 = function()
		local m = Test.deserialize(string.char(7, 0x78, 0x56, 0x34, 0x12))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.I32.new(0x12345678):_wrap():_serialize())
	end,

	testDeserializeI8Negative = function()
		local m = Test.deserialize(string.char(5, 187))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.I8.new(-69):_wrap():_serialize())
	end,

	testDeserializeI16Negative = function()
		local m = Test.deserialize(string.char(6, 0xcc, 0xed))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.I16.new(-0x1234):_wrap():_serialize())
	end,

	testDeserializeI32Negative = function()
		local m = Test.deserialize(string.char(7, 0x88, 0xa9, 0xcb, 0xed))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.I32.new(-0x12345678):_wrap():_serialize())
	end,

	testDeserializeString = function()
		local m = Test.deserialize(string.char(9, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x21, 0))
		Lu.assertNotIsNil(m)
		Lu.assertEquals(m:_serialize(), Test.Str.new("hello!"):_wrap():_serialize())
	end,

	testDeserializeF32 = function()
		local m = Test.deserialize(string.char(10, 0xdb, 0x0f, 0x49, 0x40))
		Lu.assertNotIsNil(m)
	end,

	testDeserializeF64 = function()
		local m = Test.deserialize(string.char(11, 0x18, 0x2d, 0x44, 0x54, 0xfb, 0x21, 0x09, 0x40))
		Lu.assertNotIsNil(m)
	end,

	testNoZeroTermination = function()
		local m = Test.deserialize(string.char(9, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x21))
		Lu.assertIsNil(m)
	end,

	testLength = function()
		local m, l = Test.deserialize(
			string.char(130, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00)
		)
		Lu.assertEquals(l, 16)
	end,
}
