<template lang="pug">
div.fullsize
  div#layout.fullsize
    GamepadLayout
  div#overlay.fullsize
    button#adjustLock.btn.btn-primary.btn-sm Unlock
    div#menuToggle.v-align.text-center Menu


</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { GamepadOptions } from '../GamepadOptions';
import { ControllerlyClient } from 'controllerly-core';
import GamepadLayout from './GamepadLayout.vue';

/**
 * User enters the connection code that the server provides.
 */
@Component({
    components: {
        GamepadLayout
    }
})
export default class Gamepad extends Vue {
  @Prop() private client!: ControllerlyClient;
  @Prop() private options!: GamepadOptions;

  
}

</script>
<style lang="scss" scoped>
@import '../styles/gamepad.scss';
</style>