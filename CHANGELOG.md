#### 1.2 - 2026-07-08

* Added support for the new alphanumeric CNPJ format (letters allowed in the first 12 characters), effective July 2026 per Ato Declaratório Executivo COCAD nº 141102, while still validating the previous all-numeric format
* Updated the bundled CNPJ field definition to accept letters as well as digits
* Fixed the CNPJ `pattern` in the bundled field definitions JSON, which previously did not enforce the 14-character length requirement

#### 1.1 - 2026-06-17

* Fix required rules for CPF and CNPJ on the field definitions JSON file

#### 1.0 - 2026-06-17

* First release