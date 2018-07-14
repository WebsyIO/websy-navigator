let navController = new WebsyNavigator({
  defaultView: "home",
  viewClass: "view"
})

navController.subscribe("show", (view)=>{
	console.log(`new is ${view}`);
})
navController.subscribe("hide", (view)=>{
	console.log(`old is ${view}`);
})
