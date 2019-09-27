<template lang="pug">
div
  h1 Enter a Connection Code
  input(v-on:keyup.enter="connect" v-model='options.connectionCode', placeholder='Connection code')
  button(v-on:click='connect') Connect
  div(v-if='options.connectionTries > 0') Error: 
    span(v-if='options.connectionError') {{ options.connectionError }}

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { GamepadOptions } from '../GamepadOptions';
import { ControllerlyClient } from 'controllerly-core';

/**
 * User enters the connection code that the server provides.
 */
@Component
export default class ConnectionCode extends Vue {
  @Prop() private client!: ControllerlyClient;
  @Prop() private options!: GamepadOptions;
  private connectionCode: string = '';

  constructor() {
      super();
  }

  private created() {
    // nothing
  }

  private connect() {
    this.options.connectionTries++;
    this.client.connect(this.options.connectionCode).catch((err) => {
      this.options.connectionError = err;
    });
  }

}

</script>