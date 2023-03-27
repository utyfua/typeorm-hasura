import { generateHasuraMetadata } from "../src"
import { AppDataSource } from "./data-source"
import { writeFile, mkdir } from "fs/promises"

AppDataSource.initialize().then(async () => {
    const metadata = generateHasuraMetadata({
        name: "public",
        dataSource: AppDataSource,
        databaseUrl: process.env.HASURA_DATABASE_URL
    })

    await mkdir("tmp/output", { recursive: true })
        .catch(error => console.log(error));
    await writeFile(
        `tmp/output/metadata-${Date.now()}.json`,
        JSON.stringify(metadata, null, 2)
    )

    AppDataSource.close()
}).catch(error => console.log(error))
