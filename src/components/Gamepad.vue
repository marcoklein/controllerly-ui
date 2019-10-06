<template lang="pug">
div.fullsize
  div#layout.fullsize
    GamepadLayout(v-on:button-event='onButtonEvent' v-bind:adjusting='adjusting')
  div#overlay.fullsize
    div#adjustLock(v-on:click='toggleAdjustLock' v-bind:class='{unlocked: adjusting}')
    div#menuToggle.v-align.text-center Menu


</template>
<script lang="ts">
import Gamepad from '../scripts/Gamepad';
export default Gamepad;

</script>
<style lang="scss" scoped>
html, body {
    /* Disable scrolling */
    overflow: hidden;
}
@import '../styles/gamepad.scss';
</style>