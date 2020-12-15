"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebsyNavigator =
/*#__PURE__*/
function () {
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
      subscribers: {
        show: [],
        hide: []
      }
    };
    this.triggerIdList = [];
    this.viewIdList = [];
    this.previousPath = '';
    this.previousView = '';
    this.currentView = '';
    this.currentParams = {};
    this.controlPressed = false;
    this.usesHTMLSuffix = window.location.pathname.indexOf('.htm') !== -1;
    window.addEventListener('popstate', this.onPopState.bind(this));
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('focus', this.handleFocus.bind(this));
    window.addEventListener('click', this.handleClick.bind(this));
    this.options = _extends({}, defaults, options); // add any necessary CSS if the viewClass has been changed

    if (this.options.viewClass !== defaults.viewClass || this.options.activeClass !== defaults.activeClass) {
      var style = "\n        <style>\n          .".concat(this.options.viewClass, "{ display: none; }\n          .").concat(this.options.viewClass, ".").concat(this.options.activeClass, "{ display: initial; }\n\t\t\t\t\t.").concat(triggerClass, "{cursor: pointer;}\n        </style>\n      ");
      document.querySelector("head").innerHTML += style;
    } // this.navigate(this.currentPath, this.options.defaultGroup)

  }

  _createClass(WebsyNavigator, [{
    key: "addGroup",
    value: function addGroup(group) {
      if (!this.groups[group]) {
        this.groups[group] = {
          activeView: ''
        };
      }
    }
  }, {
    key: "formatParams",
    value: function formatParams(params) {
      var output = {
        path: params,
        items: {}
      };

      if (typeof params === 'undefined') {
        return;
      }

      var parts = params.split('&');

      for (var i = 0; i < parts.length; i++) {
        var bits = parts[i].split('=');
        output.items[bits[0]] = bits[1];
      }

      this.currentParams = output;
      return output;
    }
  }, {
    key: "generateId",
    value: function generateId(item) {
      var chars = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
      var value = [];
      var len = chars.length;

      for (var i = 0; i < 6; i++) {
        var rnd = Math.floor(Math.random() * 62);
        value.push(chars[rnd]);
      }

      return "".concat(item, "_").concat(value.join(''));
    }
  }, {
    key: "getActiveViewsFromParent",
    value: function getActiveViewsFromParent(parent) {
      var views = [];

      for (var g in this.groups) {
        if (this.groups[g].parent === parent) {
          if (this.groups[g].activeView) {
            views.push(this.groups[g].activeView);
          }
        }
      }

      return views;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      // const id = event.target.id		
      if (event.target.classList.contains(this.options.triggerClass)) {
        var view = event.target.getAttribute(this.options.viewAttribute);
        var group = event.target.getAttribute(this.options.groupAttribute);
        this.navigate(view, group || 'main', event);
      }
    }
  }, {
    key: "init",
    value: function init() {
      this.registerElements(document);
      var view = "";
      var params = this.formatParams(this.queryParams);
      var url;

      if (this.currentPath === "" && this.options.defaultView !== "") {
        view = this.options.defaultView;
      } else if (this.currentPath !== "") {
        view = this.currentPath;
      }

      url = view;

      if (typeof params !== 'undefined') {
        url += "?".concat(params.path);
      }

      this.currentView = view;

      if (this.currentView === '/' || this.currentView === '') {
        this.currentView = this.options.defaultView;
      }

      if (view !== "") {
        this.showView(view, params); // console.log('pushing state', url)      
        // history.pushState({
        // 	url
        // }, url, url)
      }
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(event) {
      this.controlPressed = false;
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      switch (event.key) {
        case 'Control':
        case 'Meta':
          this.controlPressed = true;
          break;
      }
    }
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event) {
      this.controlPressed = false;
    }
  }, {
    key: "hideView",
    value: function hideView(view, group) {
      // if (group===this.options.defaultGroup) {
      // this.hideTriggerItems(view, group)
      // this.hideViewItems(view, group)
      this.hideTriggerItems(view, group);
      this.hideViewItems(view, group); // }
      // hide any child items

      if (group === this.options.defaultGroup) {
        var children = document.getElementsByClassName("parent-".concat(view));

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
      } else {
        if (this.groups[group] && this.groups[group].activeView === view) {
          this.groups[group].activeView = null;
        }
      }

      this.publish("hide", [view]);
    }
  }, {
    key: "registerElements",
    value: function registerElements(root) {
      if (root.nodeName === '#document') {
        this.groups = {};
      }

      var triggerItems = root.getElementsByClassName(this.options.triggerClass);

      for (var i = 0; i < triggerItems.length; i++) {
        if (!triggerItems[i].id) {
          triggerItems[i].id = this.generateId('trigger');
        }

        if (this.triggerIdList.indexOf(triggerItems[i].id) !== -1) {
          continue;
        }

        this.triggerIdList.push(triggerItems[i].id); // get the view for each item

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
            triggerItems[i].classList.add("parent-".concat(parentAttr.value));
          }

          triggerItems[i].classList.add("".concat(this.options.triggerClass, "-").concat(group)); //triggerItems[i].addEventListener("click", this.navigate.bind(this, viewAttr.value, group))
        }
      } // Assign group class to views


      var viewItems = root.getElementsByClassName(this.options.viewClass);

      for (var _i = 0; _i < viewItems.length; _i++) {
        var _groupAttr = viewItems[_i].attributes[this.options.groupAttribute];
        var _viewAttr = viewItems[_i].attributes[this.options.viewAttribute];

        if (!_groupAttr || _groupAttr.value === "") {
          // if no group is found, assign it to the default group
          viewItems[_i].classList.add("".concat(this.options.viewClass, "-").concat(this.options.defaultGroup));
        } else {
          this.addGroup(_groupAttr.value);

          if (viewItems[_i].classList.contains(this.options.activeClass)) {
            this.groups[_groupAttr.value].activeView = _viewAttr.value;
          }

          viewItems[_i].classList.add("".concat(this.options.viewClass, "-").concat(_groupAttr.value));
        }

        var _parentAttr = viewItems[_i].attributes[this.options.parentAttribute];

        if (_parentAttr && _parentAttr.value !== "") {
          viewItems[_i].classList.add("parent-".concat(_parentAttr.value));

          if (_groupAttr && _groupAttr.value !== "" && this.groups[_groupAttr.value]) {
            this.groups[_groupAttr.value].parent = _parentAttr.value;
          }
        }
      }
    }
  }, {
    key: "showView",
    value: function showView(view, params) {
      this.activateItem(view, this.options.triggerClass);
      this.activateItem(view, this.options.viewClass);
      var children = this.getActiveViewsFromParent(view);

      for (var c = 0; c < children.length; c++) {
        this.activateItem(children[c], this.options.triggerClass);
        this.activateItem(children[c], this.options.viewClass);
        this.publish("show", [children[c]]);
      }

      this.publish("show", [view, params]);
    }
  }, {
    key: "navigate",
    value: function navigate(inputPath, group, event, popped) {
      if (typeof popped === 'undefined') {
        popped = false;
      }

      var toggle = false;
      var groupActiveView;
      var params = {};
      var newPath = inputPath;

      if (inputPath === this.options.defaultView && this.usesHTMLSuffix === false) {
        inputPath = inputPath.replace(this.options.defaultView, '/');
      }

      if (this.usesHTMLSuffix === true) {
        inputPath = "?view=".concat(inputPath);
      }

      var previousParamsPath = this.currentParams.path;

      if (this.controlPressed === true && group === this.options.defaultGroup) {
        // Open the path in a new browser tab
        window.open("".concat(window.location.origin, "/").concat(inputPath), '_blank');
        return;
      }

      if (inputPath.indexOf('?') !== -1 && group === this.options.defaultGroup) {
        var parts = inputPath.split('?');
        params = this.formatParams(parts[1]);
        inputPath = parts[0];
      } else if (group === this.options.defaultGroup) {
        this.currentParams = {};
      }

      if (event) {
        // event.stopPropagation()
        if (event.target && event.target.classList.contains(this.options.triggerToggleClass)) {
          toggle = true;
        } else if (typeof event === 'boolean') {
          toggle = event;
        }
      }

      if (toggle === true && this.groups[group].activeView !== "") {
        newPath = "";
      }

      this.previousView = this.currentView;
      this.previousPath = this.currentPath;

      if (this.groups[group]) {
        if (toggle === false) {
          groupActiveView = this.groups[group].activeView;
        }

        this.previousPath = this.groups[group].activeView;
      } // if (toggle===true && groupActiveView!=null && newPath!==groupActiveView) {
      //
      // }
      // else {


      if (toggle === true && this.previousPath !== '') {
        this.hideView(this.previousPath, group);
      } else {
        this.hideView(this.previousView, group);
      } // this.hideView(group)
      // }
      // if (toggle===true) {
      // 	this.groups[group].activeView = newPath
      // }


      if (toggle === true && newPath === groupActiveView) {
        return;
      }

      if (group && this.groups[group] && group !== this.options.defaultGroup) {
        this.groups[group].activeView = newPath;
      }

      if (toggle === false) {
        this.currentView = newPath;
      }

      if (this.currentView === '/') {
        this.currentView = this.options.defaultView;
      }

      if (toggle === false) {
        this.showView(this.currentView, this.currentParams);
      } else {
        this.showView(newPath);
      }

      if (this.usesHTMLSuffix === true) {
        inputPath = window.location.pathname.split("/").pop() + inputPath;
      }

      if ((this.currentPath !== newPath || previousParamsPath !== this.currentParams.path) && group === this.options.defaultGroup) {
        console.log('popped', popped);

        if (popped === false) {
          console.log('pushing state', inputPath);
          history.pushState({
            inputPath: inputPath
          }, inputPath, inputPath);
        } else {
          console.log('NOT pushing state', inputPath);
        }
      }
    }
  }, {
    key: "onPopState",
    value: function onPopState(event) {
      if (event.state) {
        this.navigate(event.state.url || event.state.inputPath, 'main', null, true);
      } else {
        this.navigate(this.options.defaultView || '/', 'main', null, true);
      }
    }
  }, {
    key: "publish",
    value: function publish(event, params) {
      this.options.subscribers[event].forEach(function (item) {
        item.apply(null, params);
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(event, fn) {
      this.options.subscribers[event].push(fn);
    }
  }, {
    key: "hideTriggerItems",
    value: function hideTriggerItems(view, group) {
      this.hideItems(this.options.triggerClass, group);
    }
  }, {
    key: "hideViewItems",
    value: function hideViewItems(view, group) {
      this.hideItems(view, group);
    }
  }, {
    key: "hideItems",
    value: function hideItems(view, group) {
      var els;

      if (group && group !== 'main') {
        els = _toConsumableArray(document.querySelectorAll("[".concat(this.options.groupAttribute, "=\"").concat(group, "\"]")));
      } else {
        els = _toConsumableArray(document.querySelectorAll("[".concat(this.options.viewAttribute, "=\"").concat(view, "\"]")));
      }

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
  }, {
    key: "queryParams",
    get: function get() {
      if (window.location.search.length > 1) {
        return window.location.search.substring(1);
      }

      return;
    }
  }]);

  return WebsyNavigator;
}();
