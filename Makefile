example_rust:
	cd examples/rust; cargo run

example_ts:
	cd examples/ts; bun install
	cd examples/ts; bun run build; bun run run

tests_rust:
	cd rust; cargo build -p massage-test; cargo test -p massage-test
