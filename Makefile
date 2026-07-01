.PHONY: bundle_lua

bundle_lua:
	cd lua/; luabundler bundle init.lua -p '?.lua' -o "dist/massage.lua"; cp _primitives.lua dist/_primitives.lua

example_rust:
	cd examples/rust; cargo run

example_ts:
	cd examples/ts; bun install; bun run build; bun run run

example_lua: bundle_lua
	rm -r examples/lua/lib
	cp -r lua/dist examples/lua/
	mv examples/lua/dist examples/lua/lib
	mkdir -p examples/lua/generated
	cd examples/lua; luajit main.lua

tests_rust:
	cd rust; cargo build -p massage-test; cargo test -p massage-test -- --nocapture

tests_ts:
	cd ts; bun install; bun run tests/setup; bun test --verbose

tests_lua:
	mkdir -p lua/tests/gen/
	cd lua; luajit tests/init.lua -v
