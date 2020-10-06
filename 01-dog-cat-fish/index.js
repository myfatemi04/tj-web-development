const app = require('express')();

app.set('view engine', 'hbs');

app.get('/dog.jpg', (req, res) => {
    res.sendFile(__dirname + "/images/cat.jpg");
});

app.get('/cat.jpg', (req, res) => {
    res.sendFile(__dirname + "/images/dog.jpg");
});

app.get('/fish.jpg', (req, res) => {
    res.render('index');
})

app.get('/', (req, res) => {
    res.render('index');
})

app.use('/pet', (req, res) => {
    let { type } = req.query;

    if (['cat', 'dog'].includes(type)) {
        res.sendFile(__dirname + `/images/${type}.jpg`);
    } else {
        res.send(`Error - ${JSON.stringify(req.query)} ==&gt; undefined`);
    }
});

app.listen(8000);