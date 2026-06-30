use heck::ToSnakeCase;
use proc_macro2::{Span, TokenStream};
use quote::quote;
use syn::Ident;

use crate::format::{Command, Schema};

pub(crate) fn serialize_message(_schema: Schema, ident_name: Ident) -> TokenStream {
  quote! {
    impl #ident_name {
      pub fn serialize(&self) -> Vec<u8> {
        self.command.serialize()
      }
    }
  }
}

pub(crate) fn serialize_enum(
  _schema: Schema,
  ident_name: Ident,
  command_names: Vec<Ident>,
) -> TokenStream {
  quote! {
    impl #ident_name {
      fn serialize(&self) -> Vec<u8> {
        match self {
          #(Self::#command_names(inner) => inner.serialize(),)*
          #[allow(unreachable_patterns)]
          _ => Vec::new()
        }
      }
    }
  }
}

pub(crate) fn serialize_command(
  command: Command,
  ident_name: Ident,
  argument_names: Vec<Ident>,
) -> TokenStream {
  let command_id = command.id;
  let argument_format_functions: Vec<Ident> = command
    .arguments
    .iter()
    .map(|f| {
      Ident::new(
        &format!("ser_{:?}", f.format).to_snake_case(),
        Span::call_site(),
      )
    })
    .collect();

  let output = quote! {
    impl #ident_name {
      pub fn serialize(&self) -> Vec<u8> {
        #[allow(unused_mut)]
        let mut r = vec![#command_id];
        #(r.append(&mut primitives::#argument_format_functions(self.#argument_names.clone()));)*
        r
      }
    }
  };

  output
}
