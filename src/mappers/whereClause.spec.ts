import { Equal, Not, MoreThan, LessThan, MoreThanOrEqual, LessThanOrEqual, Like, ILike, In, BaseEntity } from "typeorm"

import { convertWhereClause } from "./whereClause"
import { User, Org, Product } from "../../dev-playground/entity";
import { Where, Filter } from "../types";

type Case<T extends BaseEntity> = {
    input: Where<T>;
    output: Filter<T>
}

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
    }
]

describe("convert whereTypeorm to hasuraObj", () => {
    cases.forEach(({ input, output }) =>
        it("input to Equal output", () => expect(convertWhereClause(input)).toEqual(output))
    )

})
