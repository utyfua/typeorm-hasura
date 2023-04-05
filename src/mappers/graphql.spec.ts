import gql from "graphql-tag"
import { getGraphQLDefinitions } from "./graphql"

describe("convert graphql document to hasura defs", () => {
    it("Base case", () => expect(getGraphQLDefinitions(gql`
        type Query {
            currencyConverter(CurrencyInfo: ConvertCurrencyInputParams!): ConvertedCurrency
        }

        input ConvertCurrencyInputParams {
            from: String
            to: String
            amt: Int
        }

        type ConvertedCurrency {
            date: String
            info: ConvertedCurrencyInfo
            query: ConvertedCurrencyQuery
            result: Float
            success: Boolean
        }
            
        type ConvertedCurrencyInfo {
            rate: Float
        }

        type ConvertedCurrencyQuery {
            amount: Int
            from: String
            to: String
        }
    `)).toEqual({
        baseActions: [
            {
                name: "currencyConverter",
                definition: {
                    "type": "query",
                    output_type: "ConvertedCurrency",
                    "arguments": [
                        {
                            "name": "CurrencyInfo",
                            "type": "ConvertCurrencyInputParams!"
                        }
                    ],
                }
            }
        ],
        "custom_types": {
            "input_objects": [
                {
                    "name": "ConvertCurrencyInputParams",
                    "fields": [
                        {
                            "name": "from",
                            "type": "String"
                        },
                        {
                            "name": "to",
                            "type": "String"
                        },
                        {
                            "name": "amt",
                            "type": "Int"
                        }
                    ]
                }
            ],
            "objects": [
                {
                    "name": "ConvertedCurrency",
                    "fields": [
                        {
                            "name": "date",
                            "type": "String"
                        },
                        {
                            "name": "info",
                            "type": "ConvertedCurrencyInfo"
                        },
                        {
                            "name": "query",
                            "type": "ConvertedCurrencyQuery"
                        },
                        {
                            "name": "result",
                            "type": "Float"
                        },
                        {
                            "name": "success",
                            "type": "Boolean"
                        }
                    ]
                },
                {
                    "name": "ConvertedCurrencyInfo",
                    "fields": [
                        {
                            "name": "rate",
                            "type": "Float"
                        }
                    ]
                },
                {
                    "name": "ConvertedCurrencyQuery",
                    "fields": [
                        {
                            "name": "amount",
                            "type": "Int"
                        },
                        {
                            "name": "from",
                            "type": "String"
                        },
                        {
                            "name": "to",
                            "type": "String"
                        }
                    ]
                },
            ]
        }
    }))
})
