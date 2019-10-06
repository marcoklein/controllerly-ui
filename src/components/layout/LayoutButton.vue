<template lang="pug">
div
  h1 ASDF

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ControllerlyClient } from 'controllerly-core';
import { GamepadOptions } from '../../GamepadOptions';

/**
 * Represents a button input.
 */
@Component
export default class LayoutButton extends Vue {
  @Prop() private client!: ControllerlyClient;
  @Prop() private options!: GamepadOptions;

}
</script>
<style lang="scss">
</style>