<template>
  <div ref="container" class="container">
    <base-button
      ref="btn"
      class="button"
      @click="clickHandler"
      v-text="title"
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
    title: 'Кнопка',
  }),
  mounted() {
    const parent = this.$refs.container.closest('.grid-stack-item-content');
    parent.style.backgroundColor = 'transparent';
  },
  methods: {
    clickHandler() {
      this.eventSystem.publishEvent('Clicked');
      this.logSystem.info(`Button[${this.guid}] clicked`);
      this.logSystem.debug(`Button[${this.guid}] clicked`);
    },
  },
};
</script>

<style lang="sass" scoped>
@import ./styles/component
</style>
