const router = require("express").Router();
const { RSA_SSLV23_PADDING } = require("constants");
const https = require("https");

let requestOptions = {
    method: "GET",
    headers: {
        Accept: "application/json",
        "User-Agent": "TJHSST"
    }
};

function getJSON(url, callback) {
    https.get(url, requestOptions, response => {
        if (response.headers.location) {
            let url2 = new URL(url);
            url2.pathname = response.headers.location;
            getJSON(url2.href, callback);
        } else {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                callback(JSON.parse(data));
            });
        }
    });
}

function getForecastURL(req, res, next) {
    let { latitude, longitude } = req.query;

    if (latitude == null || longitude == null) {
        res.render("weather_home");
    } else {
        getJSON(`https://api.weather.gov/points/${latitude},${longitude}`, parsed => {
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
    }
}

function getForecast(req, res, next) {
    let url = res.locals.url;
    getJSON(url, parsed => {
        if (parsed.status) {
            res.send(parsed.title);
        } else {
            let forecast = parsed.properties.periods;
            res.locals.forecast = forecast;
            next();
        }
    });
}

function renderForecast(req, res) {
    res.locals.title = "Weather forecast!"
    res.render("weather");
}

router.get("/", [getForecastURL, getForecast, renderForecast]);

module.exports = router;