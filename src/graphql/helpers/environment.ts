require("dotenv").config();

export default class Environment {
	static PORT: number = parseInt(process.env.PORT);
}
