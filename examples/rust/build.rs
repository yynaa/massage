use massage::format::Schema;

fn main() {
  // generate your schema
  let schema = Schema::from_path("../simple.toml").unwrap();
  // build it, it will appear in the crate's OUT_DIR
  massage::generate::build_schema(schema);
}
