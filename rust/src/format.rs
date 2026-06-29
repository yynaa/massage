use std::{collections::HashMap, fs::read_to_string, path::Path};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Schema {
  pub name: String,
  pub description: Option<String>,
  #[serde(default)]
  pub commands: HashMap<String, Command>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Command {
  pub id: u8,
  pub description: Option<String>,
  #[serde(default)]
  pub arguments: Vec<Argument>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Argument {
  pub name: String,
  pub description: Option<String>,
  pub format: ArgumentFormat,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ArgumentFormat {
  String,
  U8,
  U16,
  U32,
  U64,
  I8,
  I16,
  I32,
  I64,
  F32,
  F64,
}

impl Schema {
  pub fn from_path<P: AsRef<Path>>(path: P) -> crate::Result<Schema> {
    let path = path.as_ref();
    let toml_string = read_to_string(path)?;
    let schema = toml::from_str(&toml_string)?;
    Ok(schema)
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn parsing() {
    let toml = "
        name = \"simple_messages\"

        [commands.hello]
        id = 1
        description = \"say hello!\"

        [[commands.hello.arguments]]
        format = \"String\"
        name = \"name\"
        description = \"your name\"
      ";
    let schema: Schema = toml::from_str(toml).unwrap();
  }
}
