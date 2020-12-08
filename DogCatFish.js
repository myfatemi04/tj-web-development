const router = require("express").Router();

router.get("/dog.jpg", (req, res) =>
  res.sendFile(__dirname + "/images/cat.jpg")
);

router.get("/cat.jpg", (req, res) =>
  res.sendFile(__dirname + "/images/dog.jpg")
);

router.get("/fish.jpg", (req, res) =>
  res.render("dogcatfish", { layout: false })
);

router.get("/", (req, res) => res.render("dogcatfish", { layout: false }));

router.use("/pet", (req, res) => {
  let { type } = req.query;

  if (["cat", "dog"].includes(type)) {
    res.sendFile(__dirname + `/images/${type}.jpg`);
  } else {
    res.send(`Error - ${JSON.stringify(req.query)} ==&gt; undefined`);
  }
});

module.exports = router;
