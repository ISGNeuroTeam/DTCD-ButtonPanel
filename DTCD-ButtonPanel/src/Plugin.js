import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

import { 
  PanelPlugin, 
  LogSystemAdapter, 
  EventSystemAdapter 
} from './../../DTCD-SDK';

export class VisualizationText extends PanelPlugin {

  #eventSystem;
  #vueComponent;

  #config = {
    title: '',
    titleLeft:'',
    buttonColor: 'theme_blueSec',
  };

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

  setVueComponentPropValue(prop, value) {
    const methodName = `set${prop.charAt(0).toUpperCase() + prop.slice(1)}`;
    if (this.#vueComponent[methodName]) {
      this.#vueComponent[methodName](value)
    } else {
      throw new Error(`В компоненте отсутствует метод ${methodName} для присвоения свойства ${prop}`)
    }
  }

  setPluginConfig(config = {}) {
    const configProps = Object.keys(this.#config);

    for (const [prop, value] of Object.entries(config)) {
      if (!configProps.includes(prop)) continue;
      this.setVueComponentPropValue(prop, value)

      this.#config[prop] = value;
    }
  }

  getPluginConfig() {
    return { ...this.#config };
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
            label: 'Текст в кнопке',
            required: true,
          },
        },
        {
          component: 'text',
          propName: 'titleLeft',
          attrs: {
            label: 'Текст слева от кнопки',
          },
        },
        {
          component: 'select',
          propName: 'buttonColor',
          attrs: {
            label: 'Выбрать цвет кнопки',
          },
          options: () => [
            { label: 'Зеленый', value: 'theme_green' },
            { label: 'Синий', value: 'theme_blueSec' },
            { label: 'Красный', value: 'theme_red' },
            { label: 'Серый', value: 'theme_secondary' },
            { label: 'Прозрачный', value: 'theme_alfa' },
          ],
        },
      ],
    };
  }

  getState() {
    return this.getPluginConfig();
  }

  setState(newState) {
    if (typeof newState !== 'object' ) return;

    this.setPluginConfig(newState);
  }
}
