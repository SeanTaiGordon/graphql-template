import gql from "graphql-tag";

import otherSchema from "./other";

const linkSchema = [
	gql`
		scalar Date
		scalar JSON

		type Query {
			_: Boolean
		}

		type Mutation {
			_: Boolean
		}

		type Subscription {
			_: Boolean
		}
	`,
];

export const SCHEMA_TYPES: any[] = [otherSchema];

export const typeDefs = linkSchema.concat(SCHEMA_TYPES);
