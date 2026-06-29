use massage;

#[test]
fn parsing_simple() {
  massage::format::Schema::from_path("../../../examples/simple.toml").unwrap();
}

#[test]
fn parsing_test() {
  massage::format::Schema::from_path("../../../test/schema.toml").unwrap();
}

#[test]
fn parsing_empty() {
  massage::format::Schema::from_path("../../../test/empty.toml").unwrap();
}
