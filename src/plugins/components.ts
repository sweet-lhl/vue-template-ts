import {VueConstructor} from "vue";
// @ts-ignore
const templateModule = require.context('@/components', false, /\.vue$/);

export const components = templateModule.keys().reduce((acc:object, key:string) => { // custom component
  const component = templateModule(key).default;
  return component ? {
    ...acc,
    [component.name.replace(/^\w/, (w:string) => w.toUpperCase())]: component,
  } : acc;
}, {});

const templates = { // global component

};

export default {
  install: (Vue: VueConstructor): void => Object.entries(components)
      // @ts-ignore
    .forEach(([name, component]) => Vue.component(name, component)),
};
