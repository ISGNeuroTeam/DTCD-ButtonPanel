import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

import {
  PanelPlugin,
  LogSystemAdapter,
  EventSystemAdapter,
} from './../../DTCD-SDK';

export class VisualizationText extends PanelPlugin {

  #title;
  #eventSystem;

  static getRegistrationMeta() {
    return pluginMeta;
  }

  constructor (guid, selector) {
    super();

    const logSystem = new LogSystemAdapter('0.4.0', guid, pluginMeta.name);
    const eventSystem = new EventSystemAdapter('0.3.0', guid);

    this.#eventSystem = eventSystem;
    this.#eventSystem.registerPluginInstance(this, ['Clicked']);

    const { default: VueJS } = this.getDependence('Vue');

    const view = new VueJS({
      data: () => ({ guid, logSystem, eventSystem }),
      render: h => h(PluginComponent),
    }).$mount(selector);

    this.vueComponent = view.$children[0];
    this.#title = 'Кнопка';
  }

  setPluginConfig(config = {}) {
    const { title } = config;

    if (typeof title !== 'undefined') {
      this.#title = title;
      this.vueComponent.setTitle(title);
    }

  }

  getPluginConfig() {
    const config = {};
    if (this.#title) config.title = this.#title;
    return config;
  }

  setFormSettings() {}

  getFormSettings() {}

}
