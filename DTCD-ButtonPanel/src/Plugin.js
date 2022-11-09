import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

import { PanelPlugin, LogSystemAdapter, EventSystemAdapter } from './../../DTCD-SDK';

export class VisualizationText extends PanelPlugin {
  #eventSystem;
  #vueComponent;

  static getRegistrationMeta() {
    return pluginMeta;
  }

  constructor(guid, selector) {
    super();

    const logSystem = new LogSystemAdapter('0.5.0', guid, pluginMeta.name);
    const eventSystem = new EventSystemAdapter('0.4.0', guid);

    this.#eventSystem = eventSystem;
    this.#eventSystem.registerPluginInstance(this, ['Clicked']);

    const { default: VueJS } = this.getDependence('Vue');

    const view = new VueJS({
      data: () => ({ guid, logSystem, eventSystem }),
      render: h => h(PluginComponent),
    }).$mount(selector);

    this.#vueComponent = view.$children[0];
  }

  setPluginConfig(config = {}) {
    const { title } = config;

    if (typeof title !== 'undefined') {
      this.#vueComponent.title = title;
    }
  }

  getPluginConfig() {
    const config = {};
    if (this.#vueComponent.title) config.title = this.#vueComponent.title;
    return config;
  }

  setFormSettings(config) {
    return this.setPluginConfig(config);
  }

  getFormSettings() {
    return {
      fields: [
        {
          component: 'title',
          propValue: 'Общие настройки',
        },
        {
          component: 'text',
          propName: 'title',
          attrs: {
            label: 'Отображаемый текст',
            required: true,
          },
        },
      ],
    };
  }

  getState() {
    return this.#vueComponent.getState();
  }

  setState(newState) {
    if (typeof newState !== 'object' ) return;

    for (const key in newState) {
      if (!Object.hasOwnProperty.call(newState, key)) continue;
      this.#vueComponent[key] = newState[key];
    }
  }
}
