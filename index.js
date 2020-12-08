const express = require("express");
const exphbs = require("express-handlebars");
const cookieSession = require("cookie-session");
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

app.get("/", (req, res) => {
  res.locals.title = "Welcome to my website!";
  res.render("index");
});

app.listen(process.env.PORT || 3000, () => console.log("Started listening!"));
