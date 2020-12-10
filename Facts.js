const router = require("express").Router();

let factsMap = {
	tokyo: [
		"It is the capital of Japan.",
		"There are over 36 million people in three prefectures.",
		"It is called Tokyo.",
		"You can probably get really good Japanese food there.",
		"<b>Look at this picture of Tokyo!!</b><br/><img src='/image/tokyo.webp' alt='Tokyo'/>",
	],
	newyork: [
		"It is also known as the Big Apple.",
		"A little over 8 million people live here.",
		"The UN headquarters are here.",
		"<b>Look at this picture of New York City!!</b><br/><img src='/image/newyork.jpg' alt='NYC'/>",
	],
	delhi: [
		"It is the capital of India.",
		"It is also the largest city in India.",
		"<b>Here's a picture of Delhi---</b><br/><img src='/image/delhi.jpg' alt='Delhi'/>",
	],
	zaeem: ["Zaeem is cool"],
	suhas: ["Suhas is cool"],
	michael: [
		"Michael is tha coolest 😎",
		"Also running for class council this year",
		"Runs track and field",
		"Loves coding ML and web dev",
	],
};

router.get("/", (req, res) => {
	res.locals.title = "Facts!";
	res.render("facts_home");
});

function getFacts(name) {
	if (!(name in factsMap)) {
		return ["There are no facts about this thing."];
	} else {
		return factsMap[name].slice(0, req.query.limit || factsMap[name].length);
	}
}

router.get("/facts/:name", (req, res) => {
	let name = req.params.name;
	let facts = getFacts(name);
	let result = {
		name,
		facts,
		count: facts.length,
	};

	if (req.query.format === "json") {
		res.json(result);
	} else {
		res.locals.title = "Facts about " + name;
		res.render("facts_page", result);
	}
});

module.exports = router;
