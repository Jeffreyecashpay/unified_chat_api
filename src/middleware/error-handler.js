const ErrorHandler = ( Error, req, res, next ) => {
	res.status(Error.status || 500); 
	res.send({
		error: true,
		message: Error.message || "Internal Server Error"
	});
	next();
};

module.exports = ErrorHandler;