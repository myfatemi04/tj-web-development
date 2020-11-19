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
        res.render("weather");
    } else {
        getJSON(`https://api.weather.gov/points/${latitude},${longitude}`, parsed => {
            if (parsed.status) {
                res.render("weather", {error: parsed.title});
            } else {
                if (parsed.properties.forecastHourly == null) {
                    res.render(weather, {error: "Not Found: Hourly Forecast URL is null."});
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
            forecast = forecast.map(period => {
                let date = new Date(Date.parse(period.startTime));
                let isRainy = period.shortForecast.toLowerCase().includes("rain");
                let message = 'A nice day';
                let temp = period.temperature;
                if (period.temperatureUnit === 'C') {
                    temp = (temp * 1.8) + 32;
                }
                
                // temperature from 20 deg to 100 deg
                // scale to 200 hue to 0 hue
                // y = -(200/80)x + 250
                let clampedTemperature = Math.min(Math.max(temp, 20), 100);
                let hue = clampedTemperature * -2.5 + 250;

                if (isRainy) {
                    message = 'You might want to bring a raincoat!';
                } else {
                    if (temp < 20) {
                        message = 'Brrrrrr....';
                    } else if (temp < 40) {
                        message = 'Brrr....';
                    } else if (temp < 50) {
                        message = "A little chilly today. Wear long sleeves!";
                    } else if (temp < 60) {
                        message = "It's great for running!";
                    } else if (temp < 70) {
                        message = "It's like room temperature outside.";
                    } else if (temp < 80) {
                        message = "Pleasantly warm!";
                    } else if (temp < 90) {
                        message = "Very warm outside!";
                    } else if (temp < 100) {
                        message = "Getting quite hot. Drink lots of water!";
                    } else if (temp >= 100) {
                        message = "So... hot...";
                    }
                }
                return {
                    ...period,
                    startTimePretty: date.toLocaleString(),
                    message,
                    hue
                }
            });
            res.locals.latitude = req.query.latitude;
            res.locals.longitude = req.query.longitude;
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