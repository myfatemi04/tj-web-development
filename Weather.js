const router = require("express").Router();
const https = require("https");

let requestOptions = {
	method: "GET",
	headers: {
		Accept: "application/json",
		"User-Agent": "TJHSST",
	},
};

function getJSON(url, callback) {
	https.get(url, requestOptions, (response) => {
		if (response.headers.location) {
			let url2 = new URL(url);
			url2.pathname = response.headers.location;
			getJSON(url2.href, callback);
		} else {
			let data = "";
			response.on("data", (chunk) => (data += chunk));
			response.on("end", () => {
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
		getJSON(
			`https://api.weather.gov/points/${latitude},${longitude}`,
			(parsed) => {
				if (parsed.status) {
					res.render("weather", { error: parsed.title });
				} else {
					if (parsed.properties.forecastHourly == null) {
						res.render(weather, {
							error: "Not Found: Hourly Forecast URL is null.",
						});
					} else {
						res.locals.url = parsed.properties.forecastHourly;
						next();
					}
				}
			}
		);
	}
}

function getWeatherMessage(temperature) {
	if (temperature < 20) {
		return "Brrrrrr....";
	} else if (temperature < 40) {
		return "Brrr....";
	} else if (temperature < 50) {
		return "A little chilly today. Wear long sleeves!";
	} else if (temperature < 60) {
		return "It's great for running!";
	} else if (temperature < 70) {
		return "It's like room temperature outside.";
	} else if (temperature < 80) {
		return "Pleasantly warm!";
	} else if (temperature < 90) {
		return "Very warm outside!";
	} else if (temperature < 100) {
		return "Getting quite hot. Drink lots of water!";
	} else if (temperature >= 100) {
		return "So... hot...";
	}
}

function clamp(min, max, value) {
	return Math.min(Math.max(min, value), max);
}

function getForecast(req, res, next) {
	let url = res.locals.url;
	getJSON(url, (parsed) => {
		if (parsed.status) {
			res.send(parsed.title);
		} else {
			let forecast = parsed.properties.periods;
			let dates = [];
			let currentDateTimePeriods = [];
			let lastDate = null;
			for (let period of parsed.properties.periods) {
				let date = new Date(Date.parse(period.startTime));
				let isRainy = period.shortForecast.toLowerCase().includes("rain");

				let temperature;
				if (period.temperatureUnit === "C") {
					temperature = temperature * 1.8 + 32;
				} else if (period.temperatureUnit === "F") {
					temperature = period.temperature;
				}

				// temperature from 20 deg to 100 deg
				// scale to 200 hue to 0 hue
				// y = -(200/80)x + 250
				let clampedTemperature = clamp(20, 100, temperature);
				let hue = clampedTemperature * -2.5 + 250;

				let message;
				if (isRainy) {
					message = "You might want to bring a raincoat!";
				} else {
					message = getWeatherMessage(temperature);
				}

				if (lastDate == null) {
					lastDate = date.getDate();
				} else {
					if (lastDate != date.getDate()) {
						dates.push({
							date: date.toLocaleDateString(),
							times: currentDateTimePeriods,
						});
						currentDateTimePeriods = [];
						lastDate = date.getDate();
					}
				}

				currentDateTimePeriods.push({
					...period,
					time: date.toLocaleTimeString(),
					message,
					hue,
				});
			}

			res.locals.latitude = req.query.latitude;
			res.locals.longitude = req.query.longitude;
			res.locals.dates = dates;
			next();
		}
	});
}

function renderForecast(req, res) {
	res.locals.title = "Weather forecast!";
	res.render("weather");
}

router.get("/", [getForecastURL, getForecast, renderForecast]);

module.exports = router;
