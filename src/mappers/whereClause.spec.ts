import { Not, In, BaseEntity, IsNull, EntityMetadata } from "typeorm"

import { convertWhereClause } from "./whereClause"
import { User } from "../../dev-playground/entity";
import { Where, Filter } from "../types";

type Case<T extends BaseEntity> = {
    input: Where<T>;
    output: Filter<T>
}
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
} as EntityMetadata

const cases: Case<User>[] = [
    {
        input: {
            id: "1",
        },
        output: {
            id: { _eq: "1" }
        }
    },
    {
        input: {
            id: "1",
            name: "test"
        },
        output: {
            _and: [
                { id: { _eq: "1" } },
                { name: { _eq: "test" } }
            ]
        }
    },
    {
        input: [
            { id: "1", name: "test" },
            { id: "2", name: "test" }
        ],
        output: {
            _or: [
                { _and: [{ id: { _eq: "1" } }, { name: { _eq: "test" } }] },
                { _and: [{ id: { _eq: "2" } }, { name: { _eq: "test" } }] }
            ]
        }
    },
    {
        input: {
            id: Not("1")
        },
        output: {
            id: { _neq: "1" }
        }
    },
    {
        input: [
            { id: Not("1"), name: "test" },
            { id: "2", name: In(["test"]) }
        ],
        output: {
            _or: [
                { _and: [{ id: { _neq: "1" } }, { name: { _eq: "test" } }] },
                { _and: [{ id: { _eq: "2" } }, { name: { _in: ["test"] } }] }
            ],

        },
    },
    {
        input: {
            products: {
                id: "1"
            }
        },
        output: {
            products: {
                id: { _eq: "1" },
            }
        }
    },
    {
        input: {
            products: [
                {
                    id: "1"
                },
                {
                    id: "2"
                }
            ]
        },
        output: {
            products: {
                _or: [
                    { id: { _eq: "1" } },
                    { id: { _eq: "2" } }
                ]
            }
        }
    },
    {
        input: {
            products: {
                id: Not(IsNull())
            }
        },
        output: {
            products: {
                id: { _is_null: false },
            }
        }
    },
    {
        input: {
            products: {
                id: Not("test")
            }
        },
        output: {
            products: {
                id: { _neq: "test" },
            }
        }
    },
    {
        input: {
            products: {
                id: IsNull()
            }
        },
        output: {
            products: {
                id: { _is_null: true },
            }
        }
    },
    {
        input: {
            testJsonB: {
                name: "test"
            }
        },
        output: {
            testJsonB: {
                _contains: {
                    name: "test"
                }
            }
        }
    },
    {
        input: {
            testJsonB: Not({
                name: "test"
            })
        },
        output: {
            _not: {
                testJsonB: {
                    _contains: {
                        name: "test"
                    }
                }
            }
        }
    }
]

describe("convert whereTypeorm to hasuraObj", () => {
    cases.forEach(({ input, output }) =>
        it("input to Equal output", () => expect(convertWhereClause(table, input)).toEqual(output))
    )
})
