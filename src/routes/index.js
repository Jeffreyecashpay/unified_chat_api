const userRoute = require("./user");
const gunRoute = require("./gun");
const uploadRoute = require("./upload")

const Routes = {
	routers: () => {
		return [
			{
				url: "/user",
				pathName: userRoute
			},
			{
				url: "/upload",
				pathName: uploadRoute
			},
			
			// {
			// 	url: "/gun",
			// 	pathName: gunRoute
			// },
		];
	}
};

module.exports = Routes;