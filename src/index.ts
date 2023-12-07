require("dotenv").config();
// import * as admin from "firebase-admin";
// import serviceAccount = require("./.json");
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
const express = require("express");
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import bodyParser from "body-parser";
import cors from "cors";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { context, subscriptionContext } from "./graphql/context";

// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// });

const PORT = 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
	server: httpServer,
	path: "/graphql",
});
const serverCleanup = useServer(
	{ schema, context: subscriptionContext },
	wsServer
);

const server = new ApolloServer({
	schema,
	plugins: [
		// Proper shutdown for the HTTP server.
		ApolloServerPluginDrainHttpServer({ httpServer }),

		// Proper shutdown for the WebSocket server.
		{
			async serverWillStart() {
				return {
					async drainServer() {
						await serverCleanup.dispose();
					},
				};
			},
		},
	],
});

server.start().then(() => {
	app.use(
		"/graphql",
		cors<cors.CorsRequest>(),
		bodyParser.json(),
		expressMiddleware(server, {
			context: context,
		})
	);

	httpServer.listen(PORT, () => {
		console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
		console.log(
			`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`
		);
	});
});
