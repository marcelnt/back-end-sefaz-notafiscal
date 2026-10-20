# XSD Schema Assembler

This project aims to assemble, merge, and resolve dependencies in XSD files, allowing complex schemas with multiple `<xs:include>` and `<xs:import>` references to be processed and combined into a single XSD document.

## Overview

The `XSD Schema Assembler` is a TypeScript library that simplifies the merging of multiple XSD files, resolving dependencies, including schema attributes, and merging properties as needed. It is designed for scenarios where schemas reference each other using `<xs:include>` or `<xs:import>`, such as in systems following the Brazilian Fiscal Portal standards.

## Key Features

- **Resolution of `<xs:include>` and Processing of `<xs:import>`**: Automatically loads and merges schema dependencies, replacing `<xs:include>` statements with the contents of the referenced files. For `<xs:import>`, the statement is retained, and the referenced file must be in the same directory as the main file for proper resolution.
- **Preservation of Main Schema Attributes**: Attributes from the main XSD file, such as `targetNamespace`, are retained, while attributes from imported files are only added if they do not conflict with the main schema.
- **Removal of XML Declarations and `<xs:schema>` Tags**: During assembly, the `schema` tags from imported files are removed, ensuring a single `schema` tag in the final XSD.
import xsdAssembler from 'xsd-assembler';

## Usage

Install the lib:

```bash
npm install xsd-assembler
```

Usage:
```typescript
import xsdAssembler from 'xsd-assembler';

const pathToYourFile = '/schemas/enviNFe_v4.00.xsd';

const assembledXSD = await xsdAssembler.assemble(pathToYourFile);
```

**Rembember**: All .xsd files should be in the same folder as your main file, as the example:

```
└── 📁schemas
    └── enviNFe_v4.00.xsd
    └── leiauteNFe_v4.00.xsd
    └── tiposBasico_v4.00.xsd
    └── xmldsig-core-schema_v1.01.xsd
```

## Buy Me a Coffee ☕

Love this project? If you find it useful and would like to show your support, consider buying me a coffee (or a few!). Your contribution helps keep this project going strong and fuels me to keep pushing out new features, improvements, and bug fixes.

### Why Buy Me a Coffee?

- ☕ **Express Appreciation**: Show your support and appreciation for the time and effort that goes into maintaining this project.
- 🚀 **Boost Development**: Your support helps fund the time needed to bring new features and improvements.
- 🍼 **Support a New Parent**: My first child arrived earlier this year, and those late-night coding sessions go great with some extra coffee (and maybe a few diapers)! 

### How to Buy Me a Coffee

You can "buy me a coffee" through these options:

- [Buy Me a Coffee on GitHub Sponsors](https://github.com/sponsors/Maurelima?frequency=recurring&sponsor=Maurelima)
- **Pix Donation**: Prefer Pix? Use this key:

    ```
    Pix Key: 944ce2f2-e90f-400a-a388-bb1fe6719e02
    Name: Marco Lima
    ```

Thank you for your support! Every bit helps keep this project growing and evolving. ☕💻

### Other Ways to Support

Not in a position to donate financially? No problem! Here are a few other ways to support:

- **Report Issues**: Found a bug? Let us know!
- **Contribute Code**: Submit a pull request to improve the project.
- **Share with Friends**: Spread the word about the project.

Thank you for helping make this project better for everyone!

## Creators

| [<img src="https://avatars.githubusercontent.com/u/59918400?s=400&u=3554ebcf0f75263637516867945ebd371e68da71&v=4" width="75px;"/>](https://github.com/Maurelima) |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                            [Marco Lima](https://github.com/Maurelima)                                                            |

## License

Designed with ♥ by [Marco Lima](https://github.com/Maurelima). Licensed under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).
