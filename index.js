const express = require("express");
const exphbs = require("express-handlebars");
const cookieSession = require("cookie-session");
const { getProfile } = require("./auth");
const app = express();

app.set("view engine", "hbs");
app.use(
	cookieSession({
		name: "session",
		secret: "NotASecret",
		secure: false,
	})
);
app.use("/", express.static("public"));

app.engine(
	"hbs",
	exphbs({
		extname: "hbs",
		helpers: {
			inc: (value, options) => parseInt(value) + 1,
			dec: (value, options) => parseInt(value) - 1,
		},
	})
);

app.use("/facts", require("./Facts"));
app.use("/dogcatfish", require("./DogCatFish"));
app.use("/weather", require("./Weather"));
app.use("/geography_quiz", require("./GeographyQuiz"));
app.use("/auth", require("./auth").authRouter);

app.get("/", async (req, res) => {
	let title = "Welcome to my website!";
	if (req.session.accessToken) {
		let profile = await getProfile(req.session.accessToken);
		title = "Welcome back, " + profile.short_name + "!";
	}

	res.render("index", {
		isLoggedIn: !!req.session.accessToken,
		title,
	});
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Started listening on port", port));
