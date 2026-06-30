local casing = {}

local function split(str)
	str = str:gsub("(%l)(%u)", "%1\001%2")
	str = str:gsub("(%u)(%u%l)", "%1\001%2")
	str = str:gsub("[-_./\\ ]", "\001")
	local words = {}
	for word in str:gmatch("[^\001]+") do
		words[#words + 1] = word:lower()
	end
	return words
end

function casing.snake(str)
	return table.concat(split(str), "_")
end

function casing.pascal(str)
	local words = split(str)
	for i, w in ipairs(words) do
		words[i] = w:sub(1, 1):upper() .. w:sub(2)
	end
	return table.concat(words)
end

function casing.constant(str)
	local words = split(str)
	for i, w in ipairs(words) do
		words[i] = w:upper()
	end
	return table.concat(words, "_")
end

return casing
