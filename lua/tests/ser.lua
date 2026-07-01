local Test = require("tests.gen.test")

return {
	testSerializeEmpty = function()
		local msg = Test.Empty.new():_wrap()
		msg:_serialize()
	end,

	testSerializeU8 = function()
		local msg = Test.U8.new(69):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 69)
		Lu.assertEquals(#ser, 2)
	end,

	testSerializeBool = function()
		local msg = Test.Bool.new(true):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 1)
		Lu.assertEquals(#ser, 2)
	end,

	testSerializeU16 = function()
		local msg = Test.U16.new(0x1234):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 0x34)
		Lu.assertEquals(ser:sub(3, 3):byte(), 0x12)
		Lu.assertEquals(#ser, 3)
	end,

	testSerializeU32 = function()
		local msg = Test.U32.new(0x12345678):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 0x78)
		Lu.assertEquals(ser:sub(3, 3):byte(), 0x56)
		Lu.assertEquals(ser:sub(4, 4):byte(), 0x34)
		Lu.assertEquals(ser:sub(5, 5):byte(), 0x12)
		Lu.assertEquals(#ser, 5)
	end,

	testSerializeI8 = function()
		local msg = Test.I8.new(69):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 69)
		Lu.assertEquals(#ser, 2)
	end,

	testSerializeI16 = function()
		local msg = Test.I16.new(0x1234):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 0x34)
		Lu.assertEquals(ser:sub(3, 3):byte(), 0x12)
		Lu.assertEquals(#ser, 3)
	end,

	testSerializeI32 = function()
		local msg = Test.I32.new(0x12345678):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 0x78)
		Lu.assertEquals(ser:sub(3, 3):byte(), 0x56)
		Lu.assertEquals(ser:sub(4, 4):byte(), 0x34)
		Lu.assertEquals(ser:sub(5, 5):byte(), 0x12)
		Lu.assertEquals(#ser, 5)
	end,

	testSerializeI8Negative = function()
		local msg = Test.I8.new(-69):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 187)
		Lu.assertEquals(#ser, 2)
	end,

	testSerializeI16Negative = function()
		local msg = Test.I16.new(-0x1234):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 0xcc)
		Lu.assertEquals(ser:sub(3, 3):byte(), 0xed)
		Lu.assertEquals(#ser, 3)
	end,

	testSerializeI32Negative = function()
		local msg = Test.I32.new(-0x12345678):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 0x88)
		Lu.assertEquals(ser:sub(3, 3):byte(), 0xa9)
		Lu.assertEquals(ser:sub(4, 4):byte(), 0xcb)
		Lu.assertEquals(ser:sub(5, 5):byte(), 0xed)
		Lu.assertEquals(#ser, 5)
	end,

	testSerializeString = function()
		local msg = Test.Str.new("hello!"):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 0x68)
		Lu.assertEquals(ser:sub(8, 8):byte(), 0x00)
		Lu.assertEquals(#ser, 8)
	end,

	testSerializeF32 = function()
		local msg = Test.F32.new(math.pi):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 0xda)
		Lu.assertEquals(ser:sub(3, 3):byte(), 0x0f)
		Lu.assertEquals(ser:sub(4, 4):byte(), 0x49)
		Lu.assertEquals(ser:sub(5, 5):byte(), 0x40)
		Lu.assertEquals(#ser, 5)
	end,

	testSerializeF64 = function()
		local msg = Test.F64.new(math.pi):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(2, 2):byte(), 0x18)
		Lu.assertEquals(ser:sub(3, 3):byte(), 0x2d)
		Lu.assertEquals(ser:sub(4, 4):byte(), 0x44)
		Lu.assertEquals(ser:sub(5, 5):byte(), 0x54)
		Lu.assertEquals(ser:sub(6, 6):byte(), 0xfb)
		Lu.assertEquals(ser:sub(7, 7):byte(), 0x21)
		Lu.assertEquals(ser:sub(8, 8):byte(), 0x09)
		Lu.assertEquals(ser:sub(9, 9):byte(), 0x40)
		Lu.assertEquals(#ser, 9)
	end,

	testSerializeZeroTermination = function()
		local msg = Test.ZeroTermination.new("hello!", 69):_wrap()
		local ser = msg:_serialize()
		Lu.assertEquals(ser:sub(8, 8):byte(), 0x00)
		Lu.assertEquals(#ser, 9)
	end,
}
