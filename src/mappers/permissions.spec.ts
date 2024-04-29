import * as TypeORM from "typeorm";
import { EntityOptions, ColumnMetadata, DataSourceOptions } from "../types";
import { generatePermissions, PermissionResult } from "./permissions"
import { User } from "../../dev-playground/entity"

type Cases<Entity extends TypeORM.BaseEntity> = {
    input: EntityOptions<Entity>,
    output: PermissionResult
}

const dataSourceOptions = {} as unknown as DataSourceOptions

const table = {
    columns: [
        { databaseName: "id", type: 'uuid' },
        { databaseName: "name", type: 'text' },
        { databaseName: "orgId", type: 'uuid' },
        { databaseName: "testJsonB", type: 'jsonb' }
    ],
    relations: [
        {
            propertyName: "org",
            inverseEntityMetadata: {
                columns: [
                    { databaseName: "id", type: 'uuid' },
                    { databaseName: "name", type: 'text' },
                ],
                relations: [{}]
            }
        },
        {
            propertyName: "products",
            inverseEntityMetadata: {
                columns: [
                    { databaseName: "id", type: 'uuid' },
                    { databaseName: "name", type: 'text' },
                    { databaseName: "orgId", type: 'uuid' },
                    { databaseName: "userId", type: 'uuid' },
                ],
                relations: [{}]
            }
        }
    ]
} as TypeORM.EntityMetadata

let TestColumns: ColumnMetadata[] = [
    {
        object: 1,
        propertyName: "id",
        options: {
            permissions: {
                user: ["select", "update"]
            }
        }
    }
]

const cases: Cases<User>[] = [
    {
        input: {
            permissions: {
                user: {
                    where: {
                        id: "1"
                    },
                    select: true,
                }
            }
        },
        output: {
            insert_permissions: [],
            select_permissions: [{
                role: "user",
                permission: {
                    allow_aggregations: undefined,
                    columns: ["id"],
                    filter: {
                        id: { _eq: "1" }
                    },
                    limit: undefined
                }
            }],
            update_permissions: [],
            delete_permissions: [],
        }
    },
    {
        input: {
            permissions: {
                user: {
                    where: {
                        id: "1"
                    },
                    select: true,
                    update: true,
                }
            }
        },
        output: {
            insert_permissions: [],
            select_permissions: [{
                role: "user",
                permission: {
                    allow_aggregations: undefined,
                    columns: ["id"],
                    filter: {
                        id: { _eq: "1" }
                    },
                    limit: undefined
                }
            }],
            update_permissions: [{
                role: "user",
                permission: {
                    check: {},
                    columns: ["id"],
                    filter: {
                        id: { _eq: "1" }
                    },
                    set: undefined
                }
            }],
            delete_permissions: [],
        }
    },
    {
        input: {
            permissions: {
                user: {
                    where: {
                        id: "1"
                    },
                    select: true,
                    update: {
                        where: {
                            products: {
                                id: "1"
                            }
                        },
                    },
                }
            }
        },
        output: {
            insert_permissions: [],
            select_permissions: [{
                role: "user",
                permission: {
                    allow_aggregations: undefined,
                    columns: ["id"],
                    filter: {
                        id: { _eq: "1" }
                    },
                    limit: undefined
                }
            }],
            update_permissions: [{
                role: "user",
                permission: {
                    check: {},
                    columns: ["id"],
                    filter: {
                        _and: [
                            { id: { _eq: "1" } },
                            {
                                products: {
                                    id: { _eq: "1" }
                                }
                            }
                        ]
                    },
                    set: undefined
                }
            }],
            delete_permissions: [],
        }
    }
]

describe("convert whereTypeorm to hasuraObj", () => {
    cases.forEach(({ input, output }) =>
        it("input to Equal output", () =>
            expect(generatePermissions(dataSourceOptions, table, { entityOptions: input, columnMetadata: TestColumns }))
                .toEqual(output))
    )
})
