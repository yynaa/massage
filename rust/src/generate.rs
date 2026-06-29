use std::{env, fs, path::Path};

use heck::{ToPascalCase, ToSnakeCase};
use proc_macro2::{Ident, Span, TokenStream};
use quote::quote;

use crate::{
  de::{deserialize_command, deserialize_enum},
  format::{Argument, ArgumentFormat, Command, Schema},
  ser::serialize_command,
};

pub fn build_schema(schema: Schema) {
  let schema_code = generate_schema(schema.clone());

  let out =
    Path::new(&env::var("OUT_DIR").unwrap()).join(&format!("{}.rs", schema.name.to_snake_case()));
  fs::write(out, schema_code).unwrap();
}

fn generate_schema(schema: Schema) -> String {
  // main schema
  let description = match schema.description {
    None => TokenStream::new(),
    Some(ref description) => quote! {#[doc = #description]},
  };
  let schema_name = Ident::new(&schema.name.to_pascal_case(), Span::call_site());
  let enum_name = Ident::new(
    &format!("{}Commands", schema.name.to_pascal_case()),
    Span::call_site(),
  );
  let mut total = quote! {
    use std::fmt;

    #description
    #[allow(unused)]
    #[derive(Debug, Clone)]
    pub struct #schema_name {
      pub command: #enum_name
    }

    impl fmt::Display for #schema_name {
      fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.command)
      }
    }

    impl #schema_name {
      pub fn serialize(&self) -> Vec<u8> {
        self.command.serialize()
      }

      pub fn deserialize(bytes: Vec<u8>) -> Option<Self> {
        if let Some(d) = #enum_name::deserialize(bytes) {
          Some(Self {
            command: d
          })
        } else {
          None
        }
      }
    }
  };

  // command enum
  let command_names: Vec<Ident> = schema
    .commands
    .iter()
    .map(|(n, _)| Ident::new(&n.to_pascal_case(), Span::call_site()))
    .collect();

  total.extend(quote! {
    #[derive(Debug, Clone)]
    pub enum #enum_name {
      #(#command_names ( #command_names )),*
    }

    impl fmt::Display for #enum_name {
      fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
          #(Self::#command_names(inner) => write!(f, "{}", inner)),*
        }
      }
    }

    impl #enum_name {
      fn serialize(&self) -> Vec<u8> {
        match self {
          #(Self::#command_names(inner) => inner.serialize()),*
        }
      }
    }
  });

  total.extend(deserialize_enum(schema.clone(), enum_name.clone()));

  // commands
  let commands: Vec<TokenStream> = schema
    .commands
    .iter()
    .map(|(n, c)| generate_command(n.clone(), c.clone()))
    .collect();

  let mut total = commands.iter().fold(total, |mut a, n| {
    a.extend(n.clone().into_iter());
    a
  });

  // froms
  total.extend(quote! {
    #(
      impl From<#command_names> for #schema_name {
        fn from(value: #command_names) -> Self {
          Self { command: #enum_name::#command_names(value) }
        }
      }
    )*
  });

  let parsed: syn::File = syn::parse2(total).unwrap();
  let formatted = prettyplease::unparse(&parsed);
  formatted
}

fn generate_command(name: String, command: Command) -> TokenStream {
  let description = match command.description {
    None => TokenStream::new(),
    Some(ref description) => quote! {#[doc = #description]},
  };
  let arguments: Vec<TokenStream> = command
    .arguments
    .iter()
    .map(|f| generate_argument(f.clone()))
    .collect();
  let ident_name = Ident::new(&name.to_pascal_case(), Span::call_site());

  let mut display_model = format!("{},", name.to_pascal_case());
  display_model.push_str(
    &std::iter::repeat("{}")
      .take(command.arguments.len())
      .collect::<Vec<_>>()
      .join(","),
  );
  let display_arguments = command
    .arguments
    .iter()
    .map(|f| Ident::new(&format!("{}", f.name.to_snake_case()), Span::call_site()))
    .collect::<Vec<_>>();

  let mut output = quote! {
    #description
    #[derive(Debug, Clone)]
    pub struct #ident_name {
      #(#arguments),*
    }

    impl fmt::Display for #ident_name {
      fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, #display_model, #(self.#display_arguments),*)
      }
    }
  };

  output.extend(serialize_command(command.clone(), ident_name.clone()));
  output.extend(deserialize_command(command, ident_name));

  output
}

fn generate_argument(argument: Argument) -> TokenStream {
  let format = generate_argument_format(argument.format);
  let description = match argument.description {
    None => TokenStream::new(),
    Some(description) => quote! {#[doc = #description]},
  };
  let name = Ident::new(&argument.name.to_snake_case(), Span::call_site());
  let output = quote! {
    #description
    pub #name : #format
  };
  output
}

fn generate_argument_format(argument_format: ArgumentFormat) -> TokenStream {
  let output = match argument_format {
    ArgumentFormat::String => quote! {String},
    ArgumentFormat::U8 => quote! {u8},
    ArgumentFormat::U16 => quote! {u16},
    ArgumentFormat::U32 => quote! {u32},
    ArgumentFormat::U64 => quote! {u64},
    ArgumentFormat::I8 => quote! {i8},
    ArgumentFormat::I16 => quote! {i16},
    ArgumentFormat::I32 => quote! {i32},
    ArgumentFormat::I64 => quote! {i64},
  };
  output
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn parsing() {
    let toml = "
        name = \"simple\"
        description = \"a simple schema\"

        [commands.hello]
        id = 1
        description = \"say hello!\"

        [[commands.hello.arguments]]
        format = \"String\"
        name = \"name\"
        description = \"your name\"
      ";
    let schema: Schema = toml::from_str(toml).unwrap();
    generate_schema(schema);
  }
}
