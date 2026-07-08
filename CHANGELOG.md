#### 2.0 - TBA

* Added live input masking for the CPF (`999.999.999-99`) and CNPJ (`XX.XXX.XXX/XXXX-99`) checkout fields, so formatting characters are shown while typing — **experimental, disabled by default**, enable with `add_filter( 'swcbcf_enable_cpf_cnpj_input_mask', '__return_true' )`
* Added a server-side cleanup step (hooking order processing) that strips mask punctuation from the stored CPF/CNPJ order meta, guaranteeing clean data regardless of what the browser sent (same experimental filter)
* The mask script also relaxes each field's native `pattern` attribute to match the masked format, so the browser's own constraint validation doesn't reject the punctuation it just added

#### 1.2 - 2026-07-08

* Added support for the new alphanumeric CNPJ format (letters allowed in the first 12 characters), effective July 2026 per Ato Declaratório Executivo COCAD nº 141102, while still validating the previous all-numeric format
* Updated the bundled CNPJ field definition to accept letters as well as digits

#### 1.1 - 2026-06-17

* Fix required rules for CPF and CNPJ on the field definitions JSON file

#### 1.0 - 2026-06-17

* First release