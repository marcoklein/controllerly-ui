<template lang="pug">
div.fullsize#gamepadLayout(
  @touchstart="onTouchStart",
  @touchmove="onTouchMove",
  @touchend="onTouchEnd",
  @mousedown="leftButtonMouseDown",
  @mousemove="leftButtonMouseMove",
  @mouseup="leftButtonMouseUp"
  v-html="layoutHtml"
  )
  // TODO change mouse move to mouse drag
  
  //div.left.v-split.area
    div.input.v-align(button-name='left') Left
    div.input.v-align(button-name='right') Right
  //div.center.h-split.area
    div.input.v-align(button-name='start') Start
    div.input.v-align(button-name='select') Select
  //div.right.h-split.area
    div.input.v-align(button-name='actionB') B
    div.input.v-align(button-name='actionA') A
  //div.left.v-split.area
      div.v-split.area
      div.input.v-align(button-name='right') Right

</template>
<script lang="ts">
import GamepadLayout from '../scripts/GamepadLayout';
export default GamepadLayout;
</script>
<style lang="scss">
@import '../styles/gamepad-layout.scss';
</style>