<template lang="pug">
// TODO use jquery to align content!
div.container
  div.mt-2
    h1 Controllerly 
    h5.text-muted Remote Gamepad for the Smartphone

  div.card.card-primary.bg-light.mt-3
    div.card-body
      div.float-left Enter Your Connection Code
      //div.float-right
        a.btn.btn-sm.btn-outline-primary(href="https://docs.controllerly.com" role="button") What is this?
      div.input-group.card-body
        input.form-control(maxLength="5" v-on:keyup.enter="connect" @input="onConnectionCodeChange" v-model='options.connectionCode', placeholder='Connection code')
        div.input-group-append
          button.btn.btn-primary(
            v-on:click='connect'
            v-bind:class=" { disabled: options.connectionCode.length < 5 }")
            | Connect
      div.alert.alert-danger(v-if='options.connectionTries > 0' role="alert")
        span(v-if='options.connectionError') {{ options.connectionError }}

  div.mt-3.mb-3
    h5 Let's make gaming social again! 
    p.text-muted Controllerly is an Open Source Smartphone Gamepad. It leverages the power of WebRTC and allows direct Browser to Browser connection without the need of a server!
  
    a.btn.btn-outline-primary(href="https://docs.controllerly.com" role="button") More Info
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { GamepadOptions } from '../GamepadOptions';
import { ControllerlyClient } from 'controllerly-core';

/**
 * This is the landing page of controllerly.com!
 * It is the first visible page to the user!
 * 
 * Users get redirected to that page from projects that implement Controllerly.
 * However, it may also happen that users would like to inform themselves about the Controllerly project.
 * 
 * Therefore this page contains a link to the Controllerly documentation page (docs.controllerly.com).
 * There users can inform themselves about the project.
 * 
 * Otherwise, the user simply enters the connection code to connect to a server.
 * The Gamepad user interface is optimized for smartphone usage.
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
   * 
   * FIXME on smartphone the on change event is not triggered on every input..
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