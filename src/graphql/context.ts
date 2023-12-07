import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import * as admin from "firebase-admin";

const pubsub = new PubSub();

export async function context({ req }) {
	const token = req.headers.token;

	const approved = isApproved(req.body.query);
	if (approved) {
		return returnApproved();
	}

	return verifyApollo(token);
}

async function returnApproved() {
	return { uid: String(""), pubsub: pubsub };
}
export async function subscriptionContext(
	ctx: { authorization: string },
	message: { payload: { query: string } }
) {
	const approved = isApproved(message.payload.query);

	if (approved) {
		return returnApproved();
	} else {
		const authHeader = ctx?.authorization || "";
		console.log(authHeader);
		return verifyApollo(authHeader);
	}
}

async function verifyApollo(token: string) {
	if (!token) throw new GraphQLError("UNAUTHENTICATED");

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);

		return { uid: decodedToken.sub, pubsub };
	} catch (error) {
		console.error(error);
		throw new GraphQLError("UNAUTHENTICATED");
	}
}

function isApproved(query: string) {
	let name = query.replace(/\s/g, "").split("{")[1];
	if (name.includes("(")) name = name.split("(")[0];
	if (name.includes("{")) name = name.split("{")[0];
	if (name.includes("}")) name = name.split("}")[0];

	var approvedMethods = ["testMutation", "testSubscription", "__schema"];
	return approvedMethods.includes(name);
}
