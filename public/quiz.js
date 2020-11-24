const SVG_WIDTH = 800;

async function loadSVG(url) {
	let response = await fetch(url);
	let text = await response.text();

	document.getElementById('svgWrapper').innerHTML = text;
	let svg = document.getElementsByTagName("svg")[0];
	svg.setAttribute('width', SVG_WIDTH);
	svg.removeAttribute('height');
	for (let child of svg.children) {
		child.setAttribute("fill", "lightgrey");
		child.setAttribute("stroke", "darkgrey");
	}
}

async function getJSON(url) {
	let response = await fetch(url);
	return await response.json();
}

function toHHMMSS(totalSeconds) {
	let hours = Math.floor(totalSeconds / 3600);
	let minutes = Math.floor((totalSeconds % 3600) / 60);
	let seconds = totalSeconds % 60;

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	return `${hours}:${minutes}:${seconds}`;
}

class Quiz {
	constructor(datafile) {
		this.datafile = datafile;
		this.handleGuess = this.handleGuess.bind(this);
		this.handleControlButtonClick = this.handleControlButtonClick.bind(this);
		this.initialize();
		this.status = 'waiting'; // | timing | paused
	}

	handleControlButtonClick() {
		let controlButton = document.getElementById("control");
		if (this.status === 'paused') {
			this.start();
			controlButton.innerHTML = "Pause";
		}
		else if (this.status === 'waiting') {
			this.start();
			controlButton.innerHTML = "Pause";
		}
		else if (this.status === 'timing') {
			this.pause();
			controlButton.innerHTML = "Resume";
		}
	}

	// Function to update how many we need to guess
	// This is a function so we can have the correct proportion before
	// the game starts.
	updateNumberToGuess() {
		document
			.getElementById("proportion")
			.innerHTML = `${this.guessedCorrectly} / ${this.regionCount}`;
	}

	// Update the score
	updateScore() {
		document
			.getElementById("score")
			.innerHTML = `${this.score} points`;
	}

	updateTime() {
		document
			.getElementById('timer')
			.innerHTML = toHHMMSS(this.seconds);
	}

	unblurSVG() {
		document.getElementById("svgWrapper").style.filter = "";
	}

	blurSVG() {
		document.getElementById("svgWrapper").style.filter = "blur(1rem)";
	}
	
	// Function to pause. Every time you pause, a second
	// is added to the counter.
	pause() {
		this.blurSVG();
		this.seconds++;
		this.updateTime();
		clearInterval(this.timeInterval);

		this.status = 'paused';

		// Stop listening for changes in the input
		document
			.getElementById("answer")
			.removeEventListener('input', this.handleGuess);
	}
	
	start() {
		this.timeInterval = setInterval(() => {
			this.seconds++;
			this.updateTime();
		}, 1000);

		this.status = 'timing';

		// Listen for changes in the input
		document
			.getElementById("answer")
			.addEventListener('input', this.handleGuess);

		this.unblurSVG();
	}

	stop() {
		clearInterval(this.timeInterval);
	}

	handleGuess(event) {
		let guess = event.target.value;

		// Check if the typed-in value is a valid region or not
		if (guess in this.regions) {
			// Get the region info
			let regionInfo = this.regions[guess];

			// If it was not guessed yet...
			if (!regionInfo.guessed) {
				// Update the fill color
				document
					.getElementById(regionInfo.id)
					.setAttribute("fill", "#60f542");
				
				// Update the score
				this.score += 100;
				this.guessedCorrectly += 1;

				// Update info
				this.updateScore();
				this.updateNumberToGuess();

				// Remember that we have guessed this now
				regionInfo.guessed = true;

				// Clear the input
				event.target.value = '';

				// Check if we have guessed everything now
				if (this.guessedCorrectly === this.regionCount) {
					this.stop();
				}
			}
		}
	}

	disconnect() {
		clearInterval(this.timeInterval);
		document
			.getElementById("answer")
			.removeEventListener('input', this.handleGuess);
		
		document
			.getElementById("control")
			.removeEventListener('click', this.handleControlButtonClick);
	}

	async initialize() {
		// Gets a dict of {regionName: regionID}
		this.data = await getJSON(this.datafile);

		// Load the map
		await loadSVG(this.data.svg_url);

		// Stores a dict of {regionName: {id: regionID, guessed: (guessed or not)}}
		this.regions = {};
		this.regionCount = 0;
		for (let [regionID, regionName] of Object.entries(this.data.regions)) {
			this.regions[regionName] = {guessed: false, id: regionID};
			this.regionCount++;
		}

		this.guessedCorrectly = 0;
		this.score = 0;
		this.seconds = 0;

		// Handle to the loop running the timer
		// setInterval returns a handle which we can use to stop the loop
		this.timeInterval = 0;

		// Initialize everything
		this.updateNumberToGuess();
		this.updateScore();
		this.updateTime();

		let controlButton = document.getElementById("control");
		controlButton.innerHTML = 'Start';
		controlButton.addEventListener('click', this.handleControlButtonClick);
	}
}
