import { EntityOptions, ColumnMetadata, DataSourceOptions } from "../types";
import { BaseEntity } from "typeorm"
import { generatePermissions, PermissionResult } from "./permissions"
import { Org } from "../../dev-playground/entity"

type Cases<Entity extends BaseEntity> = {
    input: EntityOptions<Entity>,
    output: PermissionResult
}

const dataSourceOptions = {} as unknown as DataSourceOptions

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

const cases: Cases<Org>[] = [
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
                    columns: ["id"],
                    filter: {
                        id: { _eq: "1" }
                    }
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
                    columns: ["id"],
                    filter: {
                        id: { _eq: "1" }
                    }
                }
            }],
            update_permissions: [{
                role: "user",
                permission: {
                    columns: ["id"],
                    filter: {
                        id: { _eq: "1" }
                    }
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
                            users: {
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
                    columns: ["id"],
                    filter: {
                        id: { _eq: "1" }
                    }
                }
            }],
            update_permissions: [{
                role: "user",
                permission: {
                    columns: ["id"],
                    filter: {
                        _and: [
                            { id: { _eq: "1" } },
                            {
                                users: {
                                    id: { _eq: "1" }
                                }
                            }
                        ]
                    }
                }
            }],
            delete_permissions: [],
        }
    }
]

describe("convert whereTypeorm to hasuraObj", () => {
    cases.forEach(({ input, output }) =>
        it("input to Equal output", () =>
            expect(generatePermissions(dataSourceOptions, { entityOptions: input, columnMetadata: TestColumns }))
                .toEqual(output))
    )
})
