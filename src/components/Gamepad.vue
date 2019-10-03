<template lang="pug">
div.fullsize
  div#layout.fullsize
    GamepadLayout(v-on:button-event='onButtonEvent' v-bind:adjusting='adjusting')
  div#overlay.fullsize
    button#adjustLock.btn.btn-primary.btn-sm(v-on:click=('toggleAdjustLock')) {{ adjusting ? 'Lock' : 'Unlock'}}
    div#menuToggle.v-align.text-center Menu


</template>
<script lang="ts">
import Gamepad from '../scripts/Gamepad';
export default Gamepad;

</script>
<style lang="scss" scoped>
@import '../styles/gamepad.scss';
</style>