<template lang="pug">
div.fullsize#gamepadLayout
  div.left.v-split.area
    div.input Left
    div.input Right
  div.center.h-split.area
    div.input Start
    div.input Select
  div.right.h-split.area
    div.input B
    div.input A

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