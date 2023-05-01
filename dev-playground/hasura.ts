import gql from "graphql-tag";
import { writeFile, mkdir } from "fs/promises"
import { MetadataBuilder } from "../src";
import { currencyConverterAction } from "./action/currencyConverter";
import { AppDataSource } from "./data-source"

async function convert() {
    const generator = new MetadataBuilder()
        .addSource({
            name: "public",
            dataSource: AppDataSource,
            databaseUrl: process.env.HASURA_DATABASE_URL,
            defaultSelectPermissionLimit: 50,
        })
        .addActions([
            currencyConverterAction,
        ])
        .addGraphQLDefinitions(gql`
            scalar JSON
        `)
        .addInheritedRoles({
            // testUser: ["admin", "editor"]
        })
    const metadata = generator.getMetadata();

    await mkdir("tmp/output", { recursive: true })
        .catch(error => console.log(error));
    await writeFile(
        `tmp/output/metadata-${Date.now()}.json`,
        JSON.stringify(metadata, null, 2)
    )
    AppDataSource.close();
    console.log("Done and done");
}

AppDataSource.initialize()
    .then(convert)
    .catch(error => console.log(error))

if (process.env.DEV_KEEP_ALIVE) {
    setInterval(() => 1, 1000 * 60 * 60)
}
