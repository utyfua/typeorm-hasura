# typeorm-hasura

[![npm version](https://badge.fury.io/js/typeorm-hasura.svg)](https://badge.fury.io/js/typeorm-hasura)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


`typeorm-hasura` is a JavaScript library that generates Hasura metadata from TypeORM entities.
This library is designed to automate the process of creating Hasura metadata, 
making it easier to manage complex database schemas and permissions when using Hasura with TypeORM.

## Features

- Generate Hasura metadata from TypeORM entities
- Define permissions for each entity and column
- Add custom actions and inherited roles
- Automatic handling of relationships between entities

## Installation

```bash
npm install typeorm-hasura
```

or

```bash
yarn add typeorm-hasura
```

## Usage

> See the our [developer playground](https://github.com/utyfua/typeorm-hasura/tree/master/dev-playground) for a complete example.

Here's a step-by-step guide on how to use typeorm-hasura:

1. Create a script file (e.g., hasura.ts) and import the required modules:

    ```typescript
    // hasura.ts
    import { MetadataBuilder } from "typeorm-hasura";
    import { currencyConverterAction } from "./action/currencyConverter";
    import { AppDataSource } from "./data-source"
    import { writeFile, mkdir } from "fs/promises"
    ```

2. Define an asynchronous function (e.g., convert) to generate metadata using the MetadataBuilder:

    ```typescript
    async function convert() {
        const generator = new MetadataBuilder()
            .addSource({
                name: "public",
                dataSource: AppDataSource,
                databaseUrl: process.env.HASURA_DATABASE_URL,
            })
            .addActions([
                currencyConverterAction,
            ])
            .addInheritedRoles({
                testUser: ["admin","editor"]
            })

        // make an action with the result of the generator(see below)
    }
    ```

3. Save metadata:

    a. Save metadata to a file:

    ```typescript
    // generate metadata
    const metadata = await generator.getMetadata()
    // save metadata to a file
    await mkdir("metadata", { recursive: true });
    await writeFile("metadata/metadata.json", JSON.stringify(metadata, null, 2));
    ```

    b. Save metadata to Hasura:

    ```typescript
    // generate metadata and apply it to Hasura using the Hasura API
    const result = await generator.applyMetadata({ 
        // example: https://example.com
        // please do not put /v1/graphql at the end of the url
        hasuraUrl: process.env.HASURA_URL,
        adminSecret : process.env.HASURA_ADMIN_SECRET
    })
    console.log(result)
    ```

4. Call the convert function after initializing the AppDataSource:

    Make sure to call the `initialize` method of the AppDataSource before calling the convert function:

    ```typescript
    AppDataSource.initialize()
        .then(convert)
        .catch(error => console.log(error))
    ```

5. Define your TypeORM entities and use the `@HasuraEntity` and `@HasuraColumn` decorators to add Hasura metadata:

    ```typescript
    // entity/Org.ts
    import {
        Entity,
        PrimaryGeneratedColumn,
        Column,
        OneToMany,
        BaseEntity
    } from 'typeorm';
    import { HasuraEntity, HasuraColumn } from 'typeorm-hasura';
    import { Product } from './Product';
    import { User } from './User';
    import { UserRole } from '../UserRole';

    @Entity({ schema: 'public', name: 'Org' })
    @HasuraEntity<Org>({
        customName: 'Org',
        permissions: {
            [UserRole.user]: {
                where: {
                    users: {
                        id: 'X-Hasura-User-Id'
                    }
                },
                select: true,
                update: true,
            }
        },
    })
    export class Org extends BaseEntity {
        @PrimaryGeneratedColumn('uuid')
        @HasuraColumn({
            permissions: {
                [UserRole.user]: ['select']
            }
        })
        id!: string;

        // ...
    }
    ```

6. Now, you can use typeorm-hasura to automatically generate Hasura metadata for your TypeORM entities.

## Contributing

We appreciate your help in improving the "typeorm-hasura" library.
<!-- Please follow our [contributing guidelines](https://github.com/utyfua/typeorm-hasura/CONTRIBUTING.md) to contribute to the project. -->

## License

`typeorm-hasura` is released under the [MIT License](https://github.com/utyfua/typeorm-hasura/LICENSE).
