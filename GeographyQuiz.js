module.exports = (req, res) => {
	let session = req.session;
	if (isNaN(session.visit_count)) {
		session.visit_count = 0;
	}

	session.visit_count++;

	res.render("geography_quiz", { visitCount: session.visit_count });
}
