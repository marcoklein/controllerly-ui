<template lang="pug">
div.fullsize#gamepadLayout
  div.left.v-split.area
    div.input
    div.area.h-split
      div.input
      div.input
  div.center.h-split.area
    div.input
    div.input
  div.right.h-split.area
    div.input
    div.input

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { GamepadOptions } from '../GamepadOptions';
import { ControllerlyClient } from 'controllerly-core';

/**
 * User enters the connection code that the server provides.
 */
@Component
export default class GamepadLayout extends Vue {
  @Prop() private client!: ControllerlyClient;
  @Prop() private options!: GamepadOptions;
}

</script>
<style scoped>
</style>