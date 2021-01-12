let qrFound = false;
(async () => {
	const cameras = await Html5Qrcode.getCameras();
	// 'cameras' is an array of {id: string, label: string}
	if (!cameras) {
		alert("No cameras found");
		return;
	}

	const [{ id, label }] = cameras;

	const scanner = new Html5Qrcode("reader");

	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	function foundQRCode(qrCode) {
		document.getElementById("qrResult").innerHTML =
			"Found QR code: " + escapeHtml(qrCode);

		qrFound = true;

		scanner.stop().then(() => {
			document.getElementById("reader").remove();
		});
	}

	function didNotFindQRCode(error) {}

	scanner
		.start(id, { fps: 10, qrbox: 250 }, foundQRCode, didNotFindQRCode)
		.catch((error) => {});

	setTimeout(() => {
		if (!qrFound) {
			document.getElementById("qrResult").innerHTML =
				"QR code not found after 60 seconds";
		}
	}, 60000);
})();
