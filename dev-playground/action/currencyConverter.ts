// based on https://hasura.io/docs/latest/actions/quickstart/
import gql from 'graphql-tag';
import { ActionBuilder } from '../../src/builders';
import { UserRole } from '../UserRole';

export const currencyConverterAction = ActionBuilder.buildV1({
    comment: "Convert currency with real-time exchange rates.",
    handler: "https://api.exchangerate.host/convert",
    definitionType: gql`
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
    `,
    permissions: [
        { role: UserRole.user },
    ],
    nativeDefinition: {
        request_transform: {
            method: "GET",
            query_params: {
                "amount": "{{$body.input.CurrencyInfo.amt}}",
                "from": "{{$body.input.CurrencyInfo.from}}",
                "to": "{{$body.input.CurrencyInfo.to}}"
            },
            request_headers: {
                "add_headers": {},
                "remove_headers": [
                    "content-type"
                ]
            },
            template_engine: "Kriti",
            // @ts-ignore types are wrong!
            version: 2,
        },
    },
})
