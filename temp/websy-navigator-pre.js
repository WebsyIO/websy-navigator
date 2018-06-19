"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebsyNavigator = function () {
  function WebsyNavigator(options) {
    _classCallCheck(this, WebsyNavigator);

    var defaults = {
      menuClass: "nav-item",
      viewClass: "view",
      activeClass: "active",
      viewAttribute: "data-view",
      groupAttribute: "data-group",
      defaultView: "",
      defaultGroup: "main",
      subscribers: []
    };
    window.addEventListener('popstate', this.onPopState.bind(this));
    this.options = Object.assign({}, defaults, options);
    // add any necessary CSS if the viewClass has been changed
    if (this.options.viewClass !== defaults.viewClass || this.options.activeClass !== defaults.activeClass) {
      var style = "\n        <style>\n          ." + this.options.viewClass + "{ display: none; }\n          ." + this.options.viewClass + "." + this.options.activeClass + "{ display: initial; }\n        </style>\n      ";
      document.querySelector("head").innerHTML += style;
    }
    var menuItems = document.getElementsByClassName(this.options.menuClass);
    for (var i = 0; i < menuItems.length; i++) {
      // get the view for each item
      var viewAttr = menuItems[i].attributes[this.options.viewAttribute];
      if (viewAttr && viewAttr.value !== "") {
        // check to see if the item belongs to a group
        // use the group to add an additional class to the item
        // this combines the menuClass and groupAttr properties
        var groupAttr = menuItems[i].attributes[this.options.groupAttribute];
        var group = this.options.defaultGroup;
        if (groupAttr && groupAttr.value !== "") {
          // if no group is found, assign it to the default group
          group = groupAttr.value;
        }
        menuItems[i].classList.add(this.options.menuClass + "-" + group);
        menuItems[i].addEventListener("click", this.navigate.bind(this, viewAttr.value, group));
      }
    }
    // Assign group class to views
    var viewItems = document.getElementsByClassName(this.options.viewClass);
    for (var _i = 0; _i < viewItems.length; _i++) {
      var _groupAttr = viewItems[_i].attributes[this.options.groupAttribute];
      if (!_groupAttr || _groupAttr.value === "") {
        // if no group is found, assign it to the default group
        viewItems[_i].classList.add(this.options.viewClass + "-" + this.options.defaultGroup);
      } else {
        viewItems[_i].classList.add(this.options.viewClass + "-" + _groupAttr.value);
      }
    }
    this.navigate(this.currentPath, this.options.defaultGroup);
  }

  _createClass(WebsyNavigator, [{
    key: "navigate",
    value: function navigate(path, group) {
      if (path == "") {
        path = this.options.defaultView;
      }
      this.hideMenuItems(group);
      this.hideViewItems(group);
      this.activateItem(path, this.options.menuClass);
      this.activateItem(path, this.options.viewClass);
      var oldPath = this.currentPath;
      if (this.currentPath !== path && group === this.options.defaultGroup) {
        history.pushState({
          path: path
        }, path, path);
      }
      this.options.subscribers.forEach(function (item) {
        item.call(null, path, oldPath);
      });
    }
  }, {
    key: "onPopState",
    value: function onPopState(event) {
      this.navigate(event.state.path);
    }
  }, {
    key: "subscribe",
    value: function subscribe(fn) {
      this.options.subscribers.push(fn);
    }
  }, {
    key: "hideMenuItems",
    value: function hideMenuItems(group) {
      var c = this.options.menuClass;
      if (group) {
        c += "-" + group;
      }
      this.hideItems(c);
    }
  }, {
    key: "hideViewItems",
    value: function hideViewItems(group) {
      var c = this.options.viewClass;
      if (group) {
        c += "-" + group;
      }
      this.hideItems(c);
    }
  }, {
    key: "hideItems",
    value: function hideItems(className) {
      var els = document.getElementsByClassName(className);
      if (els) {
        for (var i = 0; i < els.length; i++) {
          els[i].classList.remove(this.options.activeClass);
        }
      }
    }
  }, {
    key: "activateItem",
    value: function activateItem(path, className) {
      var els = document.getElementsByClassName(className);
      if (els) {
        for (var i = 0; i < els.length; i++) {
          if (els[i].attributes[this.options.viewAttribute] && els[i].attributes[this.options.viewAttribute].value === path) {
            els[i].classList.add(this.options.activeClass);
            break;
          }
        }
      }
    }
  }, {
    key: "currentPath",
    get: function get() {
      var path = window.location.pathname.split("/").pop();
      if (path.indexOf(".htm") !== -1) {
        return "";
      }
      return path;
    }
  }]);

  return WebsyNavigator;
}();
