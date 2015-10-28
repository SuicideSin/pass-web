
import sansSel from "sans-sel";

const names = new Map();

function iterate(root, fn) {
  if (root.children) {
    root.children.forEach((child, i, children) => {
      if (child) iterate(child, fn);
      fn(child, i, children);
    });
  }
}

export default class Component {

  static get sansSelNS() {
    if (this.hasOwnProperty("_sansSelNS")) return this._sansSelNS;

    let name = this.name;
    if (names.has(name)) {
      let id = names.get(name) + 1;
      names.set(name, id);
      name = `${name}_${id}`;
    }
    else {
      names.set(name, 0);
    }

    let ss = (Object.getPrototypeOf(this).sansSelNS || sansSel()).namespace(name);
    Object.defineProperty(this, "_sansSelNS", { value: ss });

    if (this.styles) ss.addAll(this.styles);

    return ss;
  }

  static get controller() {
    Object.defineProperty(this, "controller", {
      value: (...args) => {
        return new this(...args);
      },
    });
    return this.controller;
  }

  static get view() {
    Object.defineProperty(this, "view", {
      value(component) {
        const rendered = component.render();

        const renderss = (child) => {
          if (child.tag && child.attrs && child.attrs.ss) {
            child.attrs.className = component.constructor.sansSelNS.render(child.attrs.ss);
            delete child.attrs.ss;
          }
        };

        iterate(rendered, (child, i, children) => {
          if (!child) children[i] = undefined;
          else renderss(child);
        });

        renderss(rendered);
        return rendered;
      },
    });
    return this.view;
  }

  getStyle() {
    const ns = this.constructor.sansSelNS;
    return ns.get.apply(ns, arguments);
  }

}
