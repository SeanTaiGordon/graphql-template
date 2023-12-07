import gql from "graphql-tag";

export default gql`
	extend type Mutation {
		testMutation(hello: String): String
	}

	extend type Subscription {
		testSubscription(id: String!): String
	}
`;
