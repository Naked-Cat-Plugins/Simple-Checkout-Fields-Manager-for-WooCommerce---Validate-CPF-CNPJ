# Simple Checkout Fields Manager for WooCommerce – Validate CPF/CNPJ

A companion plugin for [Simple Checkout Fields Manager for WooCommerce](https://nakedcatplugins.com/product/simple-custom-fields-for-woocommerce-blocks-checkout/) that adds Brazilian tax ID fields to the WooCommerce Blocks checkout and validates them server-side.

## What it does

This plugin provides two things:

**1. Bundled field definitions**

The file `swcbcf-fields-cpf-cnpj.json` contains four ready-to-import contact fields:

| Field | Type | Visibility |
|---|---|---|
| Tipo de Pessoa | Select (Pessoa física / Pessoa jurídica) | When billing country = BR |
| CPF | Text (11 digits) | When Tipo de Pessoa = Pessoa física |
| CNPJ | Text (14 digits) | When Tipo de Pessoa = Pessoa jurídica |
| Inscrição Estadual | Text | When Tipo de Pessoa = Pessoa jurídica |

Import this file once via the main plugin's **Tools → Import field definitions** tool. The fields will then appear on your WooCommerce Blocks checkout for Brazilian customers.

**2. Server-side CPF and CNPJ validation**

Once active, the plugin validates CPF and CNPJ values submitted at checkout:

- Checks that the value has the correct number of digits (11 for CPF, 14 for CNPJ)
- Rejects values made up of a single repeated digit (e.g. `00000000000`)
- Verifies both check digits using the official Brazilian algorithm

Validation errors are returned to the customer inline, preventing the order from being placed with an invalid tax ID.

## Requirements

- **WordPress** 6.3 or higher
- **WooCommerce** 8.9 or higher (with the [Blocks checkout](https://woocommerce.com/checkout-blocks/) active)
- **PHP** 7.4 or higher
- **[Simple Checkout Fields Manager for WooCommerce](https://nakedcatplugins.com/product/simple-custom-fields-for-woocommerce-blocks-checkout/)** 7.3 or higher – the main plugin this one extends

## Installation

1. Install and activate [Simple Checkout Fields Manager for WooCommerce](https://nakedcatplugins.com/product/simple-custom-fields-for-woocommerce-blocks-checkout/).
2. In your WordPress admin, go to the main plugin's settings and use **Tools → Import field definitions** to import `swcbcf-fields-cpf-cnpj.json` (found in this plugin's directory).
3. Install and activate this plugin. Validation is enabled automatically — no further configuration needed.

## Further reading

See the accompanying blog post (in Brazilian Portuguese) for a step-by-step walkthrough:

[Como adicionar os campos de Pessoa Jurídica, CPF, CNPJ, e Inscrição Estadual no checkout de blocos do WooCommerce](https://nakedcatplugins.com/adicionar-campos-pessoa-juridica-cpf-cnpj-inscricao-estadual-checkout-blocos-woocommerce/)

## Author

[Naked Cat Plugins](https://nakedcatplugins.com) by [Webdados](https://www.webdados.pt)
