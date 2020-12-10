const { Router } = require("express");
const needLoginURL = "/auth/need_login";
const ionAuthURL = "/auth/ion";
const authRouter = Router();

authRouter.get("/need_login", (req, res) => {
	res.render("need_login");
});

authRouter.get("/ion", (req, res) => {});

module.exports = {
	ionAuthURL,
	needLoginURL,
	redirectIfLoggedOut: (req, res, next) => {
		if ("ion_access_token" in req.session) {
			next();
		} else {
			res.redirect(needLoginURL);
		}
	},
	authRouter,
};
