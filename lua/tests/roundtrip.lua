--- @diagnostic disable: need-check-nil

local Test = require("tests.gen.test")

return {
	testRoundtripEmpty = function()
		local msg = Test.Empty.new():_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,

	testRoundtripU8 = function()
		local msg = Test.U8.new(6):_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,

	testRoundtripU16 = function()
		local msg = Test.U16.new(6):_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,

	testRoundtripU32 = function()
		local msg = Test.U32.new(6):_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,

	testRoundtripI8 = function()
		local msg = Test.I8.new(6):_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,

	testRoundtripI16 = function()
		local msg = Test.I16.new(6):_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,

	testRoundtripI32 = function()
		local msg = Test.I32.new(6):_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,

	testRoundtripString = function()
		local msg = Test.Str.new("hello"):_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,

	testRoundtripF32 = function()
		local msg = Test.F32.new(6):_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,

	testRoundtripF64 = function()
		local msg = Test.F64.new(6):_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,

	testRoundtripBool = function()
		local msg = Test.Bool.new(true):_wrap()
		local ser = msg:_serialize()
		local de = Test.deserialize(ser)
		Lu.assertEquals(de:_serialize(), ser)
	end,
}
