<template lang="pug">
div.fullsize
  // show connection page if there is no client (client undefined)
  ConnectionCode(v-if='client.isDisconnected', v-bind:client='client', v-bind:options='options')
  // show other screens only if there is a client

  // show connecting if the ui is currently on state CONNECTING
  Connecting(v-if='client.isConnecting', v-bind:client='client', v-bind:options='options', v-bind:reconnecting='false')

  Gamepad(v-if='client.isConnected', v-bind:client='client', v-bind:options='options')

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ControllerlyClient, ConnectionState, ControllerlyServer } from 'controllerly-core';
import ConnectionCode from './components/ConnectionCode.vue';
import Connecting from './components/Connecting.vue';
import Gamepad from './components/Gamepad.vue';
import GamepadMenu from './components/GamepadMenu.vue';
import { GamepadOptions } from './GamepadOptions';

@Component({
  components: {
    ConnectionCode,
    Connecting,
    Gamepad,
    GamepadMenu,
  },
})
export default class App extends Vue {
  private client: ControllerlyClient = new ControllerlyClient();
  /**
   * Each component has access to the options.
   */
  private options: GamepadOptions | null = null;

  constructor() {
    super();

    // test server
    const server: ControllerlyServer = new ControllerlyServer();
    server.start('ASDFE');
  }

  private created() {
    // TODO load options from localStorage/cache
    this.options = new GamepadOptions();
  }


}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
