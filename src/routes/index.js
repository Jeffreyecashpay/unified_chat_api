const userRoute = require("./user");
const gunRoute = require("./gun");


const Routes = {
	routers: () => {
		return [
			{
				url: "/user",
				pathName: userRoute
			},
			// {
			// 	url: "/gun",
			// 	pathName: gunRoute
			// },
		];
	}
};

module.exports = Routes;