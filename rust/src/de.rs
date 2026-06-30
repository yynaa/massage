use heck::ToSnakeCase;
use proc_macro2::{Span, TokenStream};
use quote::quote;
use syn::Ident;

use crate::format::{ArgumentFormat, Command, Schema};

pub(crate) fn deserialize_message(
  _schema: Schema,
  ident_name: Ident,
  enum_name: Ident,
) -> TokenStream {
  let output = quote! {
    impl #ident_name {
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

  output
}

pub(crate) fn deserialize_enum(
  schema: Schema,
  ident_name: Ident,
  command_names: Vec<Ident>,
) -> TokenStream {
  let command_ids: Vec<u8> = schema.commands.iter().map(|f| f.1.id).collect();

  let output = quote! {
    impl #ident_name {
      pub fn deserialize(mut bytes: Vec<u8>) -> Option<Self> {
        if bytes.len() == 0 {return None;}
        let command_id = bytes.remove(0);
        match command_id {
          #(#command_ids => #command_names::deserialize(bytes).map(|a| Self::#command_names(a)),)*
          _ => None
        }
      }
    }
  };

  output
}

pub(crate) fn deserialize_command(
  command: Command,
  ident_name: Ident,
  argument_names: Vec<Ident>,
) -> TokenStream {
  let argument_variables_length = command
    .arguments
    .iter()
    .map(|f| {
      Ident::new(
        &format!("length_{}", f.name.to_snake_case()),
        Span::call_site(),
      )
    })
    .collect::<Vec<_>>();
  let argument_variables = command
    .arguments
    .iter()
    .map(|f| {
      Ident::new(
        &format!("arg_{}", f.name.to_snake_case()),
        Span::call_site(),
      )
    })
    .collect::<Vec<_>>();

  let argument_format_functions: Vec<Ident> = command
    .arguments
    .iter()
    .map(|f| {
      Ident::new(
        &format!("de_{:?}", f.format).to_snake_case(),
        Span::call_site(),
      )
    })
    .collect();

  let argument_length_generators = command
    .arguments
    .iter()
    .map(|f| argument_length_from_format(f.format.clone()))
    .collect::<Vec<_>>();

  let output = if command.arguments.len() > 0 {
    quote! {
      impl #ident_name {
        pub fn deserialize(bytes: Vec<u8>) -> Option<Self> {
          let mut rpos = Some(0);
          #(
            let #argument_variables_length = #argument_length_generators;
            let #argument_variables = if let Some(pos) = &mut rpos && let Some(length) = #argument_variables_length && *pos + length <= bytes.len() {

              let r = primitives::#argument_format_functions(bytes[*pos..(*pos+length)].to_vec());
              *pos += length;
              r
            } else {
              rpos = None;
              None
            };
          )*
          if rpos.is_some() && #(let Some(#argument_variables) = #argument_variables)&&* {
            Some(Self {
              #(#argument_names: #argument_variables),*
            })
          } else {
            None
          }
        }
      }
    }
  } else {
    quote! {
      impl #ident_name {
        pub fn deserialize(_bytes: Vec<u8>) -> Option<Self> {
          Some(Self {})
        }
      }
    }
  };

  output
}

fn argument_length_from_format(format: ArgumentFormat) -> TokenStream {
  match format {
    ArgumentFormat::U8 | ArgumentFormat::I8 => quote! {Some(1)},
    ArgumentFormat::U16 | ArgumentFormat::I16 => quote! {Some(2)},
    ArgumentFormat::U32 | ArgumentFormat::I32 | ArgumentFormat::F32 => quote! {Some(4)},
    ArgumentFormat::U64 | ArgumentFormat::I64 | ArgumentFormat::F64 => quote! {Some(8)},
    ArgumentFormat::String => quote! {{
      if let Some(pos) = rpos {
        bytes[pos..].iter().position(|&x| x == 0)
      } else {
        None
      }
    }},
  }
}
