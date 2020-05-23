let navController = new WebsyNavigator({
  defaultView: "home",
  viewClass: "view"
})

navController.subscribe("show", (view, params)=>{
	console.log(`new is ${view}`);
	console.log(params);
})
navController.subscribe("hide", (view)=>{
	console.log(`old is ${view}`);
})

navController.init()