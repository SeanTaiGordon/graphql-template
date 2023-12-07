import { GraphQLJSONObject } from "graphql-type-json";
import testResolvers from "./test";

const customScalarResolvers: any[] = [
	{
		JSON: GraphQLJSONObject,
	},
];

export const APP_RESOLVERS: any[] = [testResolvers];

export const resolvers = customScalarResolvers.concat(APP_RESOLVERS);
