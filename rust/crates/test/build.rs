use massage::format::Schema;

fn main() {
  println!("building schemas");

  let schema = Schema::from_path("../../../test/empty.toml").unwrap();
  massage::generate::build_schema(schema);

  let schema = Schema::from_path("../../../test/schema.toml").unwrap();
  massage::generate::build_schema(schema);
}
