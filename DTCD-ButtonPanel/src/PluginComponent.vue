<template>
  <div ref="container" class="Container">
    <div 
      v-if="config.titleLeft"
      class="TextLeft"
      v-text="config.titleLeft"
    >
    </div>
    <base-button 
      class="buttonMain" 
      :class="!this.config.titleLeft ? 'size_full' : 'size_small'"
      ref="btn"
      size="big"
      :theme="config.buttonColor"
      @click="clickHandler"
      v-text="config.title"
    >
    </base-button>
  </div>
</template>

<script>
export default {
  name: 'PluginComponent',
  data: (self) => ({
    guid: self.$root.guid,
    logSystem: self.$root.logSystem,
    eventSystem: self.$root.eventSystem,
    config: {
      title: 'Кнопка',
      titleLeft: '',
      buttonColor: 'theme_blueSec',
    }, 
  }),
  methods: {
    clickHandler() {
      this.eventSystem.publishEvent('Clicked');
      this.logSystem.info(`Button[${this.guid}] clicked`);
      this.logSystem.debug(`Button[${this.guid}] clicked`);
    },
    setTitle(value = '') {
      this.config.title = value;
    },
    setTitleLeft(value = '') {
      this.config.titleLeft = value;
    },
    setButtonColor(value = '') {
      this.config.buttonColor = value;
    },
  },
};
</script>

<style lang="sass" scoped>
@import ./styles/component
</style>
