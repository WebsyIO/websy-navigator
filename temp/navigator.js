class WebsyNavigator {
  constructor(options) {
    const defaults = {
      triggerClass: "trigger-item",
			triggerToggleClass: "trigger-toggle",
      viewClass: "view",
      activeClass: "active",
      viewAttribute: "data-view",
      groupAttribute: "data-group",
			parentAttribute: "data-parent",
      defaultView: "",
      defaultGroup: "main",
      subscribers: { show: [], hide: []}
    }
    window.addEventListener('popstate', this.onPopState.bind(this))
    this.options = Object.assign({}, defaults, options)
    // add any necessary CSS if the viewClass has been changed
    if (this.options.viewClass!==defaults.viewClass || this.options.activeClass!==defaults.activeClass) {
      let style = `
        <style>
          .${this.options.viewClass}{ display: none; }
          .${this.options.viewClass}.${this.options.activeClass}{ display: initial; }
        </style>
      `
      document.querySelector("head").innerHTML += style
    }
		this.groups = {}
    let triggerItems = document.getElementsByClassName(this.options.triggerClass)
    for (let i = 0; i < triggerItems.length; i++) {
      // get the view for each item
      let viewAttr = triggerItems[i].attributes[this.options.viewAttribute]
      if (viewAttr && viewAttr.value!=="") {
        // check to see if the item belongs to a group
        // use the group to add an additional class to the item
        // this combines the triggerClass and groupAttr properties
        let groupAttr = triggerItems[i].attributes[this.options.groupAttribute]
        let group = this.options.defaultGroup
        if (groupAttr && groupAttr.value!=="") {
          // if no group is found, assign it to the default group
          group = groupAttr.value
        }
				let parentAttr = triggerItems[i].attributes[this.options.parentAttribute]
				if (parentAttr && parentAttr.value!=="") {
					triggerItems[i].classList.add(`parent-${parentAttr.value}`)
				}
        triggerItems[i].classList.add(`${this.options.triggerClass}-${group}`)
        triggerItems[i].addEventListener("click", this.navigate.bind(this, viewAttr.value, group))
      }
    }
    // Assign group class to views
    let viewItems = document.getElementsByClassName(this.options.viewClass)
    for (let i = 0; i < viewItems.length; i++) {
      let groupAttr = viewItems[i].attributes[this.options.groupAttribute]
			let viewAttr = viewItems[i].attributes[this.options.viewAttribute]
      if (!groupAttr || groupAttr.value==="") {
        // if no group is found, assign it to the default group
        viewItems[i].classList.add(`${this.options.viewClass}-${this.options.defaultGroup}`)
      }
      else {
				this.addGroup(groupAttr.value)
				if (viewItems[i].classList.contains(this.options.activeClass)) {
					this.groups[groupAttr.value].activeView = viewAttr.value
				}
        viewItems[i].classList.add(`${this.options.viewClass}-${groupAttr.value}`)
      }
			let parentAttr = viewItems[i].attributes[this.options.parentAttribute]
			if (parentAttr && parentAttr.value!=="") {
				viewItems[i].classList.add(`parent-${parentAttr.value}`)
				if (groupAttr && groupAttr.value!=="" && this.groups[groupAttr.value]) {
					this.groups[groupAttr.value].parent = parentAttr.value
				}
			}
    }
    this.navigate(this.currentPath, this.options.defaultGroup)
  }
	addGroup(group) {
		if (!this.groups[group]) {
			this.groups[group] = {
				activeView: null
			}
		}
	}
	getActiveViewsFromParent(parent) {
		let views = []
		for (let g in this.groups) {
			if (this.groups[g].parent===parent) {
				views.push(this.groups[g].activeView)
			}
		}
		return views
	}
  init(){
    this.navigate(this.currentPath)
  }
	hideView(view, group) {
		this.hideTriggerItems(view, group)
    this.hideViewItems(view, group)
		// hide any child items
		if (group===this.options.defaultGroup) {
			let children = document.getElementsByClassName(`parent-${view}`)
			if (children) {
				for (var c = 0; c < children.length; c++) {
					if (children[c].classList.contains(this.options.viewClass)) {
						let viewAttr = children[c].attributes[this.options.viewAttribute]
						let groupAttr = children[c].attributes[this.options.groupAttribute]
						if (viewAttr && viewAttr.value!=="") {
							this.hideView(viewAttr.value, groupAttr.value || this.options.defaultGroup)
						}
					}
				}
			}
		}
		this.publish("hide", view)
	}
	showView(view) {
		this.activateItem(view, this.options.triggerClass)
		this.activateItem(view, this.options.viewClass)
		let children = this.getActiveViewsFromParent(view)
		for (var c = 0; c < children.length; c++) {
			this.activateItem(children[c], this.options.triggerClass)
	    this.activateItem(children[c], this.options.viewClass)
		}
		this.publish("show", view)
	}
  navigate(newPath, group, event){
		let toggle = false
		let groupActiveView
		if (event) {
			event.stopPropagation()
			if (event.target.classList.contains(this.options.triggerToggleClass)) {
				toggle = true
			}
		}
		if (newPath=="") {
      newPath = this.options.defaultView
    }
		if (this.groups[group]) {
			groupActiveView = this.groups[group].activeView
		}
		// if (toggle===true && groupActiveView!=null && newPath!==groupActiveView) {
		//
		// }
		// else {
			this.hideView(group)
			if (group && this.groups[group] && group!==this.options.defaultGroup) {
				this.groups[group].activeView = newPath
			}
		// }
		if (toggle===true && groupActiveView!=null && newPath===groupActiveView) {
			return
		}
		this.showView(newPath)
    if(this.currentPath!==newPath && group===this.options.defaultGroup){
      history.pushState({
        newPath
      }, newPath, newPath)
    }

  }
  onPopState(event){
    this.navigate(event.state.path)
  }
	publish(event, params) {
		this.options.subscribers[event].forEach((item)=>{
      item.call(null, params)
    })
	}
  subscribe(event, fn){
    this.options.subscribers[event].push(fn)
  }
  get currentPath(){
    let path = window.location.pathname.split("/").pop()
    if (path.indexOf(".htm")!==-1) {
      return ""
    }
    return path
  }
  hideTriggerItems(group){
    let className = this.options.triggerClass
    if (group) {
      className += `-${group}`
    }
    this.hideItems(className)
  }
  hideViewItems(group){
    let className = this.options.viewClass
    if (group) {
      className += `-${group}`
    }
    this.hideItems(className)
  }
  hideItems(className){
    let els = document.getElementsByClassName(className)
    if (els) {
      for (var i = 0; i < els.length; i++) {
        els[i].classList.remove(this.options.activeClass)
      }
    }
  }
  activateItem(path, className){
    let els = document.getElementsByClassName(className)
    if (els) {
      for (var i = 0; i < els.length; i++) {
        if(els[i].attributes[this.options.viewAttribute] && els[i].attributes[this.options.viewAttribute].value===path){
          els[i].classList.add(this.options.activeClass)
          break
        }
      }
    }
  }
}
