const router = require("express").Router();
const https = require("https");

let requestOptions = {
    method: "GET",
    headers: {
        Accept: "application/json",
        "User-Agent": "TJHSST"
    }
};

function getForecastURL(req, res, next) {
    let { latitude, longitude } = req.query;

    if (latitude == null || longitude == null) {
        res.send("Not Found");
    } else {
        https.get(`https://api.weather.gov/points/${latitude},${longitude}`, requestOptions, apiRes => {
            let data = '';

            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                let parsed = JSON.parse(data);
                if (parsed.status) {
                    res.send(parsed.title);
                } else {
                    if (parsed.properties.forecastHourly == null) {
                        res.send("Not Found: Hourly Forecast URL is null.");
                    } else {
                        res.locals.url = parsed.properties.forecastHourly;
                        next()
                    }
                }
            });
        });
    }
}

function getForecast(req, res, next) {
    let url = res.locals.url;
    https.get(url, requestOptions, apiRes => {
        let data = '';

        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
            let parsed = JSON.parse(data);

            if (parsed.status) {
                res.send(parsed.title);
            } else {
                let forecast = parsed.properties.periods;
                res.locals.forecast = forecast;
                next();
            }
        });
    });
}

function renderForecast(req, res) {
    res.locals.title = "Weather forecast!"
    res.render("weather");
}

router.get("/", [getForecastURL, getForecast, renderForecast]);

module.exports = router;