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
#overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  top: 0;
  left: 0;

  & > * {
    pointer-events: initial;
  }
  
  #adjustLock {
    position: absolute;
    //width: 3.5em;
    //height: 3em;
    color: white;
    white-space: nowrap;
    text-overflow: clip;
    //background-color: gray;
    top: 4px;
    left: 4px;
  }
  #menuToggle {
    /*position: absolute;
    top: 0;
    left: 45%;
    width: 10%;
    height: 32px;*/
    margin: 0 auto;
    width: 4em;
    height: 2em;
    background-color: red;
    border-bottom-left-radius: 2em;
    border-bottom-right-radius: 2em;
    cursor: pointer;
  }
}
</style>