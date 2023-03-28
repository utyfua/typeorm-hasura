import { TypeormHasuraMetadataGenerator } from "../src"
import { AppDataSource } from "./data-source"
import { writeFile, mkdir } from "fs/promises"

async function convert() {
    const metadata = await new TypeormHasuraMetadataGenerator()
        .addSource({
            name: "public",
            dataSource: AppDataSource,
            databaseUrl: process.env.HASURA_DATABASE_URL
        })
        .getMetadata()

    await mkdir("tmp/output", { recursive: true })
        .catch(error => console.log(error));
    await writeFile(
        `tmp/output/metadata-${Date.now()}.json`,
        JSON.stringify(metadata, null, 2)
    )
    console.log("Done and done");
}

convert()
    .catch(error => console.log(error))
