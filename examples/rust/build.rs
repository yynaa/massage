use massage::format::Schema;

fn main() {
  let schema = Schema::from_path("../simple.toml").unwrap();
  massage::generate::build_schema(schema);
}
