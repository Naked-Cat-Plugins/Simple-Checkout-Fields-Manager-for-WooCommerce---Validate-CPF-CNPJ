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
| CNPJ | Text (14 characters, alphanumeric) | When Tipo de Pessoa = Pessoa jurídica |
| Inscrição Estadual | Text | When Tipo de Pessoa = Pessoa jurídica |

Import this file once via the main plugin's **Tools → Import field definitions** tool. The fields will then appear on your WooCommerce Blocks checkout for Brazilian customers.

This plugin also adds live input masking to the CPF (`999.999.999-99`) and CNPJ (`XX.XXX.XXX/XXXX-99`) fields on the Blocks checkout, so customers see the formatting characters as they type. Either formatted or unformatted input is accepted (see examples below); the order is always stored with the punctuation stripped, regardless of what was typed or pasted.

**2. Server-side CPF and CNPJ validation**

Once active, the plugin validates CPF and CNPJ values submitted at checkout:

- Checks that the value has the correct number of characters (11 for CPF, 14 for CNPJ)
- Rejects values made up of a single repeated character (e.g. `00000000000`)
- Verifies both check digits using the official Brazilian algorithm

Validation errors are returned to the customer inline, preventing the order from being placed with an invalid tax ID.

### CPF examples

Examples of valid CPFs accepted by this plugin:

| Format | Example |
|---|---|
| Formatted | `479.470.310-45` |
| Unformatted | `86928278005` |

### CNPJ format: old (numeric) and new (alphanumeric)

Starting **July 2026**, Receita Federal allows the CNPJ base (the first 12 characters) to contain uppercase letters as well as digits; the last 2 check digits remain numeric. This is defined in [Ato Declaratório Executivo COCAD nº 141102](https://normasinternet2.receita.fazenda.gov.br/#/consulta/externa/141102).

This plugin validates **both** formats — the previous all-numeric CNPJ and the new alphanumeric one — using the same official check-digit algorithm (each character's value is its ASCII code minus 48, so digits `0`-`9` give values `0`-`9` and letters `A`-`Z` give values `17`-`42`).

Examples of valid CNPJs accepted by this plugin:

| Format | Example |
|---|---|
| Old (numeric) | `34.028.316/0001-03` |
| New (alphanumeric) | `HJ.O82.XOF/KG96-18` |
| New (alphanumeric) | `9D.U12.U2L/LHTW-05` |
| New (alphanumeric, unformatted) | `CRGAJTTG6CK323` |

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

See the accompanying blog post (in Brazilian Portuguese and English) for a step-by-step walkthrough:

[Como adicionar os campos de Pessoa Jurídica, CPF, CNPJ, e Inscrição Estadual no checkout de blocos do WooCommerce](https://nakedcatplugins.com/adicionar-campos-pessoa-juridica-cpf-cnpj-inscricao-estadual-checkout-blocos-woocommerce/)

## Author

[Naked Cat Plugins](https://nakedcatplugins.com) by [Webdados](https://www.webdados.pt)
