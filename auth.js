const { Router } = require("express");
const { AuthorizationCode } = require("simple-oauth2");
const { readFileSync, access } = require("fs");
const fetch = require("node-fetch").default;

const ionAuthSuccessUrl = "http://localhost:3000/auth/ion/success";
// const ionAuthSuccessUrl = "https://mfatemi.sites.tjhsst.edu/auth/ion/success";

const client = JSON.parse(
	readFileSync("./oauth_codes.json", { encoding: "utf-8" })
);

const authorizationCode = new AuthorizationCode({
	client,
	auth: {
		tokenHost: "https://ion.tjhsst.edu/oauth/",
		authorizePath: "https://ion.tjhsst.edu/oauth/authorize",
		tokenPath: "https://ion.tjhsst.edu/oauth/token/",
	},
});

const authorizationUri = authorizationCode.authorizeURL({
	scope: "read",
	redirect_uri: ionAuthSuccessUrl,
});

const needLoginURL = "/auth/need_login";
const ionAuthURL = "/auth/ion";
const authRouter = Router();

authRouter.get("/need_login", (req, res) => {
	res.render("need_login");
});

authRouter.get("/logout", (req, res) => {
	delete req.session["authenticated"];
	delete req.session["accessToken"];

	res.render("logged_out");
});

authRouter.get("/ion/success", async (req, res) => {
	let { code } = req.query;
	try {
		let accessToken = await authorizationCode.getToken({
			code,
			redirect_uri: ionAuthSuccessUrl,
			scope: "read",
		});

		req.session.authenticated = true;
		req.session.accessToken = accessToken;
		res.render("logged_in");
	} catch (e) {
		console.error("Access token error:", e);
		res.status(400);
		res.end();
	}
});

authRouter.get("/ion", (req, res) => {
	res.redirect(authorizationUri);
});

module.exports = {
	ionAuthURL,
	needLoginURL,
	authRouter,
	redirectIfLoggedOut: (req, res, next) => {
		if ("ion_access_token" in req.session) {
			next();
		} else {
			res.redirect(needLoginURL);
		}
	},
	getProfile: async (accessToken) => {
		const profileUrl =
			"https://ion.tjhsst.edu/api/profile?format=json&access_token=" +
			accessToken.access_token;

		return await (await fetch(profileUrl)).json();
	},
};
