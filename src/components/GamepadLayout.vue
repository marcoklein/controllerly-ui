<template lang="pug">
div.fullsize#gamepadLayout
  div.left.v-split.area
    div.input.v-align Left
    div.input.v-align Right
  div.center.h-split.area
    div.input.v-align Start
    div.input.v-align Select
  div.right.h-split.area
    div.input.v-align B
    div.input.v-align A

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
<style lang="scss" scoped>
</style>