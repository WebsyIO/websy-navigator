## Websy Navigator
The Websy Navigator is a simple JavaScript class that allows developers to build Single-Page-Applications with minimal amounts of JavaScript. It works by allowing the developer to configure 'views', simply by adding the required classes and attributes to their HTML markup. Each item within the navigator effectively consists of 2 HTML elements. The 'trigger' element and the 'view' element. All 'view' elements are hidden by default. When a 'trigger' element is clicked, the corresponding 'view' element is then shown.

#### Installation
The package can be installed using NPM.
``` javascript
npm install websy-navigator
```
You should then include both the JS and CSS files in your web application.
``` html
<link rel="stylesheet" href="<pathTo>/websy-navigator.min.css">
<script src="<pathTo>/websy-navigator.min.js" charset="utf-8"></script>
```

#### Defining Trigger Elements
To define a `Trigger Element`, you need to add a class of `trigger-item` and a `data-view` attribute to the desired element. The value for the `data-view` attribute should correspond with that of a `View Element`.
``` html
<ul>
  <li class="trigger-item" data-view="home">Home</li>
  <li class="trigger-item" data-view="blog">Blog</li>
</ul>
```

#### Defining View Elements
To define a `View Element`, you need to add a class of `view` and a `data-view` attribute to the desired element. The value for the `data-view` attribute should correspond with that of a `Trigger Element`.
``` html
<div class="view" data-view="home">
  This is the Home page
</div>
<div class="view" data-view="blog">
  This is the Blog page
</div>
```

#### Initializing the Navigator
Once included in the page, a global Class called `WebsyNavigator` will be available. To instantiate a new instance of the class, simply call a `new` version of the class, passing in any desired `options`.
``` javascript
const options = {}
let navController = new WebsyNavigator(options)
navController.init()
```

#### Options
The following options are available on the WebsyNavigator:
* **triggerClass** - Change the class used to specify `Trigger Elements`.
* **viewClass** - Change the class used to specify `View Elements`.
* **activeClass** - Change the class used to specify an active/visible `View Elements`.
* **viewAttribute** - Change the attribute used to specify a view name.
* **groupAttribute** - Change the attribute used to specify a group name.
* **defaultView** - Set the default view.
* **defaultGroup** - Set the default group.

#### Grouping
To build hierarchical views, an additional attribute of `data-group` can be provided to the HTML element. Elements without this attribute are implicitly added to a group called `main`, unless overridden in the options. `View Elements` that belong to the `main` group will also cause the Url to update. For any other group, the Url is not updated. To set a default a `View Element` that belongs to a group other than `main`, add the relevant `active` class to it. A `data-parent` attribute should also be assigned, providing the desired parent `view` as the value. This will ensure that all views and child views are opened/closed correctly when navigating.
``` html
<div class="view" data-view="home">
  This is the Home page
  <button class="trigger-item" data-view="subviewa" data-group="mygroup" data-parent="home">Sub-view A</button>
  <button class="trigger-item" data-view="subviewb" data-group="mygroup" data-parent="home">Sub-view B</button>
  <div class="view" data-view="subviewa">
    This is sub-view A
  </div>
  <div class="view" data-view="subviewb">
    This is sub-view B
  </div>
</div>
```

#### Flippable Objects
It's possible to build a `flippable` element which has a front and back. Clicking on it will cause it to rotate and reveal whatever is on the other side. To configure the HTML structure, you will need an outer element to act as the parent to the front and back faces. As a minimum, this element should be styles with `position: relative;`. The `front` and `back` should then be children of this element and be assigned the classes `trigger-item` and `flippable-item`. The designated `back` element should be assigned the `active` class. They should also have a unique `data-group` attribute and each have their own `data-view` attribute. A corresponding `view` element is **NOT** required. Here is a simple example implementation:
``` html
<!-- containing element -->
<div style="position: relative; height: 200px; width: 200px;">
	<!-- front -->
	<div class="trigger-item flippable-item" style="background-color: red;" data-view="front" data-group="flippable">
	</div>
	<!-- back -->
	<div class="trigger-item flippable-item active" style="background-color: blue;" data-view="back" data-group="flippable">
	</div>
</div>
```

#### Toggle Behaviour
To create views that can be toggled on and off, simply add an the `trigger-toggle` class to each applicable `Trigger Element`.

#### Subscribing
To subscribe to the WebsyNavigator and listen for when the current `view` has changed. The provided callback function receives 2 parameters, the id of the current `view` and the id of the previous `view`.
``` javascript
navController.subscribe((newView, oldView)=>{

})
```
