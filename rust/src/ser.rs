use heck::ToSnakeCase;
use proc_macro2::{Span, TokenStream};
use quote::quote;
use syn::Ident;

use crate::format::{Argument, ArgumentFormat, Command};

pub(crate) fn serialize_command(command: Command, ident_name: Ident) -> TokenStream {
  let command_id = command.id;
  let argument_generators: Vec<TokenStream> = command
    .arguments
    .iter()
    .map(|f| serialize_argument(f.clone()))
    .collect();

  let output = quote! {
    impl #ident_name {
      pub fn serialize(&self) -> Vec<u8> {
        let mut r = vec![#command_id];
        #(r.append(&mut #argument_generators);)*
        r
      }
    }
  };

  output
}

fn serialize_argument(argument: Argument) -> TokenStream {
  let var_name = Ident::new(&argument.name.to_snake_case(), Span::call_site());
  let value_access = quote! {self.#var_name};

  match argument.format {
    ArgumentFormat::U8 | ArgumentFormat::I8 => quote! {vec![#value_access]},
    ArgumentFormat::U16
    | ArgumentFormat::U32
    | ArgumentFormat::U64
    | ArgumentFormat::I16
    | ArgumentFormat::I32
    | ArgumentFormat::I64 => quote! {#value_access.to_be_bytes().to_vec()},
    ArgumentFormat::String => quote! {{
      let mut v = vec![#value_access.len() as u8];
      v.extend(#value_access.clone().into_bytes());
      v
    }},
  }
}
