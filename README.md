## Websy Navigator
The Websy Navigator is a simple JavaScript class that allows developers to build Single-Page-Applications with minimal amounts of JavaScript. It works by allowing the developer to configure 'views', simply by adding the required classes and attributes to their HTML markup. Each item within the navigator effectively consists of 2 HTML elements. The 'trigger' element and the 'view' element. All 'view' elements are hidden by default. When a 'trigger' element is clicked, the corresponding 'view' element is then shown.

#### Defining Trigger Elements
To define a `Trigger Element`, you need to add a class of `trigger-item` and a `data-view` attribute to the desired element. The value for the `data-view` attribute should correspond with that of a `View Element`.
```
<ul>
  <li class="trigger-item" data-view="home">Home</li>
  <li class="trigger-item" data-view="blog">Blog</li>
</ul>
```

#### Defining View Elements
To define a `View Element`, you need to add a class of `view` and a `data-view` attribute to the desired element. The value for the `data-view` attribute should correspond with that of a `Trigger Element`.
```
<div class="view" data-view="home">
  This is the Home page
</div>
<div class="view" data-view="blog">
  This is the Blog page
</div>
```

#### Initializing the Navigator
Once included in the page, a global Class called `WebsyNavigator` will be available. To instantiate a new instance of the class, simply call a `new` version of the class, passing in any desired `options`.
```
let navController = new WebsyNavigator()
```

#### Options


#### Grouping
