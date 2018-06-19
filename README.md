## Websy Navigator
The Websy Navigator is a simple JavaScript class that allows developers to build Single-Page-Applications with minimal amounts of JavaScript. It works by allowing the developer to configure 'views', simply by adding the required classes and attributes to their HTML markup. Each item within the navigator effectively consists of 2 HTML elements. The 'trigger' element and the 'view' element. All 'view' elements are hidden by default. When a 'trigger' element is clicked, the corresponding 'view' element is then shown.

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
To build hierarchical views, an additional attribute of `data-group` can be provided to the HTML element. Elements without this attribute are implicitly added to a group called `main`, unless overridden in the options. `View Elements` that belong to the `main` group will also cause the Url to update. For any other group, the Url is not updated. To set a default a `View Element` that belongs to a group other than `main`, add the relevant `active` class to it.
``` html
<div class="view" data-view="home">
  This is the Home page
  <button class="trigger-item" data-view="subviewa" data-group="home">Sub-view A</button>
  <button class="trigger-item" data-view="subviewb" data-group="home">Sub-view B</button>
  <div class="view" data-view="subviewa">
    This is sub-view A
  </div>
  <div class="view" data-view="subviewb">
    This is sub-view B
  </div>
</div>
```

#### Subscribing
To subscribe to the WebsyNavigator and listen for when the current `view` has changed. The provided callback function receives 2 parameters, the id of the current `view` and the id of the previous `view`.
``` javascript
navController.subscribe((newView, oldView)=>{

})
```
