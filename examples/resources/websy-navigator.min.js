"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebsyNavigator = function () {
  function WebsyNavigator(options) {
    _classCallCheck(this, WebsyNavigator);

    var defaults = {
      triggerClass: "trigger-item",
      triggerToggleClass: "trigger-toggle",
      viewClass: "view",
      activeClass: "active",
      viewAttribute: "data-view",
      groupAttribute: "data-group",
      parentAttribute: "data-parent",
      defaultView: "",
      defaultGroup: "main",
      subscribers: { show: [], hide: [] }
    };
    window.addEventListener('popstate', this.onPopState.bind(this));
    this.options = Object.assign({}, defaults, options);
    // add any necessary CSS if the viewClass has been changed
    if (this.options.viewClass !== defaults.viewClass || this.options.activeClass !== defaults.activeClass) {
      var style = "\n        <style>\n          ." + this.options.viewClass + "{ display: none; }\n          ." + this.options.viewClass + "." + this.options.activeClass + "{ display: initial; }\n        </style>\n      ";
      document.querySelector("head").innerHTML += style;
    }
    this.groups = {};
    var triggerItems = document.getElementsByClassName(this.options.triggerClass);
    for (var i = 0; i < triggerItems.length; i++) {
      // get the view for each item
      var viewAttr = triggerItems[i].attributes[this.options.viewAttribute];
      if (viewAttr && viewAttr.value !== "") {
        // check to see if the item belongs to a group
        // use the group to add an additional class to the item
        // this combines the triggerClass and groupAttr properties
        var groupAttr = triggerItems[i].attributes[this.options.groupAttribute];
        var group = this.options.defaultGroup;
        if (groupAttr && groupAttr.value !== "") {
          // if no group is found, assign it to the default group
          group = groupAttr.value;
        }
        var parentAttr = triggerItems[i].attributes[this.options.parentAttribute];
        if (parentAttr && parentAttr.value !== "") {
          triggerItems[i].classList.add("parent-" + parentAttr.value);
        }
        triggerItems[i].classList.add(this.options.triggerClass + "-" + group);
        triggerItems[i].addEventListener("click", this.navigate.bind(this, viewAttr.value, group));
      }
    }
    // Assign group class to views
    var viewItems = document.getElementsByClassName(this.options.viewClass);
    for (var _i = 0; _i < viewItems.length; _i++) {
      var _groupAttr = viewItems[_i].attributes[this.options.groupAttribute];
      var _viewAttr = viewItems[_i].attributes[this.options.viewAttribute];
      if (!_groupAttr || _groupAttr.value === "") {
        // if no group is found, assign it to the default group
        viewItems[_i].classList.add(this.options.viewClass + "-" + this.options.defaultGroup);
      } else {
        this.addGroup(_groupAttr.value);
        if (viewItems[_i].classList.contains(this.options.activeClass)) {
          this.groups[_groupAttr.value].activeView = _viewAttr.value;
        }
        viewItems[_i].classList.add(this.options.viewClass + "-" + _groupAttr.value);
      }
      var _parentAttr = viewItems[_i].attributes[this.options.parentAttribute];
      if (_parentAttr && _parentAttr.value !== "") {
        viewItems[_i].classList.add("parent-" + _parentAttr.value);
        if (_groupAttr && _groupAttr.value !== "" && this.groups[_groupAttr.value]) {
          this.groups[_groupAttr.value].parent = _parentAttr.value;
        }
      }
    }
    this.navigate(this.currentPath, this.options.defaultGroup);
  }

  _createClass(WebsyNavigator, [{
    key: "addGroup",
    value: function addGroup(group) {
      if (!this.groups[group]) {
        this.groups[group] = {
          activeView: null
        };
      }
    }
  }, {
    key: "getActiveViewsFromParent",
    value: function getActiveViewsFromParent(parent) {
      var views = [];
      for (var g in this.groups) {
        if (this.groups[g].parent === parent) {
          views.push(this.groups[g].activeView);
        }
      }
      return views;
    }
  }, {
    key: "init",
    value: function init() {
      this.navigate(this.currentPath);
    }
  }, {
    key: "hideView",
    value: function hideView(view, group) {
      this.hideTriggerItems(view, group);
      this.hideViewItems(view, group);
      // hide any child items
      if (group === this.options.defaultGroup) {
        var children = document.getElementsByClassName("parent-" + view);
        if (children) {
          for (var c = 0; c < children.length; c++) {
            if (children[c].classList.contains(this.options.viewClass)) {
              var viewAttr = children[c].attributes[this.options.viewAttribute];
              var groupAttr = children[c].attributes[this.options.groupAttribute];
              if (viewAttr && viewAttr.value !== "") {
                this.hideView(viewAttr.value, groupAttr.value || this.options.defaultGroup);
              }
            }
          }
        }
      }
      this.publish("hide", view);
    }
  }, {
    key: "showView",
    value: function showView(view) {
      this.activateItem(view, this.options.triggerClass);
      this.activateItem(view, this.options.viewClass);
      var children = this.getActiveViewsFromParent(view);
      for (var c = 0; c < children.length; c++) {
        this.activateItem(children[c], this.options.triggerClass);
        this.activateItem(children[c], this.options.viewClass);
      }
      this.publish("show", view);
    }
  }, {
    key: "navigate",
    value: function navigate(newPath, group, event) {
      var toggle = false;
      var groupActiveView = void 0;
      if (event) {
        event.stopPropagation();
        if (event.target.classList.contains(this.options.triggerToggleClass)) {
          toggle = true;
        }
      }
      if (newPath == "") {
        newPath = this.options.defaultView;
      }
      if (this.groups[group]) {
        groupActiveView = this.groups[group].activeView;
      }
      // if (toggle===true && groupActiveView!=null && newPath!==groupActiveView) {
      //
      // }
      // else {
      this.hideView(group);
      if (group && this.groups[group] && group !== this.options.defaultGroup) {
        this.groups[group].activeView = newPath;
      }
      // }
      if (toggle === true && groupActiveView != null && newPath === groupActiveView) {
        return;
      }
      this.showView(newPath);
      if (this.currentPath !== newPath && group === this.options.defaultGroup) {
        history.pushState({
          newPath: newPath
        }, newPath, newPath);
      }
    }
  }, {
    key: "onPopState",
    value: function onPopState(event) {
      this.navigate(event.state.path);
    }
  }, {
    key: "publish",
    value: function publish(event, params) {
      this.options.subscribers[event].forEach(function (item) {
        item.call(null, params);
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(event, fn) {
      this.options.subscribers[event].push(fn);
    }
  }, {
    key: "hideTriggerItems",
    value: function hideTriggerItems(group) {
      var className = this.options.triggerClass;
      if (group) {
        className += "-" + group;
      }
      this.hideItems(className);
    }
  }, {
    key: "hideViewItems",
    value: function hideViewItems(group) {
      var className = this.options.viewClass;
      if (group) {
        className += "-" + group;
      }
      this.hideItems(className);
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
