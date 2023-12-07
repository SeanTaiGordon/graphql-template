import { PubSub } from "graphql-subscriptions";
import Environment from "../helpers/environment";
import * as admin from "firebase-admin";

const testMutation = async (
	parent: any,
	args: { question: string },
	actions: { pubsub: PubSub; uid: string }
) => {
	console.log(actions);
	actions.pubsub.publish("ahmad", {
		testSubscription: "Beautiful",
	});
	return "SUCCESS";
};

export default {
	Mutation: {
		testMutation,
	},
	Subscription: {
		testSubscription: {
			subscribe: (_, args: { id: string }, actions: any) => {
				return actions.pubsub.asyncIterator(args.id);
			},
		},
	},
};
