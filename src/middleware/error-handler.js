const ErrorHandler = ( Error, req, res, next ) => {
	res.status(Error.status || 500); 
	res.send({
		error: true,
		message: Error || "Internal Server Error"
	});
	console.log(Error)
	next();
};

module.exports = ErrorHandler;