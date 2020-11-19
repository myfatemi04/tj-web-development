const router = require("express").Router();

let facts = {
    tokyo: [
        "It is the capital of Japan.",
        "There are over 36 million people in three prefectures.",
        "It is called Tokyo.",
        "You can probably get really good Japanese food there.",
        "<b>Look at this picture of Tokyo!!</b><br/><img src='/tokyo.webp' alt='Tokyo'/>",
    ],
    newyork: [
        "It is also known as the Big Apple.",
        "A little over 8 million people live here.",
        "The UN headquarters are here.",
        "<b>Look at this picture of New York City!!</b><br/><img src='/newyork.jpg' alt='NYC'/>",
    ],
    delhi: [
        "It is the capital of India.",
        "It is also the largest city in India.",
        "<b>Here's a picture of Delhi---</b><br/><img src='/delhi.jpg' alt='Delhi'/>",
    ],
    zaeem: [
        "Zaeem is cool",
    ],
    suhas: [
        "Suhas is cool",
    ],
    michael: [
        "Michael is tha coolest 😎",
        "Also running for class council this year",
        "Runs track and field",
        "Loves coding ML and web dev",
    ]
}

router.get("/", (req, res) => {
    res.locals.title = "Facts!"
    res.render("facts_home");
})

router.get("/facts/:thing", (req, res) => {
    let useJSON = req.query.format == "json"
    let thing = req.params.thing
    let thingFacts = []

    if (!(thing in facts)) {
        thingFacts = ["There are no facts about this thing."]
    } else {
        thingFacts = facts[thing].slice(0, Math.min(req.query.limit || facts[thing].length, facts[thing].length));
    }

    let result = {
        thing,
        facts: thingFacts,
        factCount: thingFacts.length
    }

    if (useJSON) {
        res.json(result)
    } else {
        res.locals.title = "Facts about " + thing;
        res.render("facts_page", result);
    }
})

module.exports = router;
