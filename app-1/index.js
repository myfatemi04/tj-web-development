const express = require("express");
const hbs = require("express-handlebars");

let app = express();

// this is required
app.set("view engine", "hbs");

// configure layouts and partials
app.engine("hbs", hbs({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
}));

app.get("/show/:number", (req, res) => {
    let { number } = req.params;

    res.render("number", {val: number});

    console.log("User landed at number page for:", number);
});

app.get("/", (req, res) => {
    res.render("index");
    console.log("User landed at main page");
});

app.listen(8000, "127.0.0.1", () => console.log("Server started!"));