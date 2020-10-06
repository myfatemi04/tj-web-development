const express = require("express")
const exphbs = require("express-handlebars")
const app = express()

app.set('view engine', 'hbs')
app.use('/', express.static('public'))

app.engine('hbs', exphbs({
    extname: "hbs",
    helpers: {
        inc: (value, options) => parseInt(value) + 1,
        dec: (value, options) => parseInt(value) - 1,
    }
}))

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

app.get("/", (req, res) => {
    res.render("index", {layout: false});
})

app.get("/facts/:thing", (req, res) => {
    let useJSON = req.query.json
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
        res.render("facts", {... result, layout: false})
    }
})

app.listen(process.env.PORT || 3000);