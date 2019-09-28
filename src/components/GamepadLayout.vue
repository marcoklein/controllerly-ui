<template lang="pug">
div.fullsize
  div.left
  div.center
  div.right

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
.left {
  position: absolute;
  width: 40%;
  height: 100%;
  left: 0;
  background-color: red;
}
.center {
  position: absolute;
  width: 20%;
  height: 100%;
  left: 40%;
  background-color: green;
}
.right {
  position: absolute;
  width: 40%;
  height: 100%;
  right: 0;
  background-color: red;
}
</style>