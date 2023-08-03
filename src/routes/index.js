const userRoute = require("./user");
const gunRoute = require("./gun");
const uploadRoute = require("./upload")
const generalRoute = require("./general")

const Routes = {
	routers: () => {
		return [
			{
				url: "/user",
				pathName: userRoute
			},
			{
				url: "/general",
				pathName: generalRoute
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