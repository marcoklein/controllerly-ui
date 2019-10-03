<template lang="pug">
// TODO use jquery to align content!
div.container.d-flex.h-100
  div.row.justify-content-center.align-self-center.w-100
    div.col-12
      h2.text-center Enter a Connection Code
      div.input-group
        input.form-control(maxLength="5" v-on:keyup.enter="connect" @input="onConnectionCodeChange" v-model='options.connectionCode', placeholder='Connection code')
        div.input-group-append
          button.btn.btn-primary(
            v-on:click='connect'
            v-bind:class=" { disabled: options.connectionCode.length < 5 }")
            | Connect
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

  constructor() {
      super();
  }

  private created() {
    // nothing
  }

  /**
   * Updated everytime the connection code input field changes.
   * Automatically connects if there are 5 characters.
   */
  private onConnectionCodeChange() {
    console.log('on change');
    // always convert to uppercase
    this.options.connectionCode = this.options.connectionCode.toUpperCase();
    if (this.options.connectionCode.length >= 5) {
      this.connect();
    }
  }

  private connect() {
    this.options.connectionTries++;
    this.client.connect(this.options.connectionCode).then(() => {
      console.log('connection successfull');
    }).catch((err) => {
      console.error(err);
      this.options.connectionError = err;
    });
  }

}

</script>
<style scoped>
</style>