const auth = require("./auth");

module.exports = async (req, res) => {
	let session = req.session;

	if (isNaN(session.visit_count)) {
		session.visit_count = 0;
	}
	session.visit_count++;

	let welcomeMessage = "Hello!";
	if (session.accessToken) {
		let profile = await auth.getProfile(session.accessToken);
		welcomeMessage = "Hey " + profile.short_name + "! Welcome back!";
	}

	res.locals.title = "Geography Quiz";
	res.render("geography_quiz", {
		visitCount: session.visit_count,
		welcomeMessage,
	});
};
