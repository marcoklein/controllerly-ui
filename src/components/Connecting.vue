<template lang="pug">
div.container.d-flex.h-100
  div.row.justify-content-center.align-self-center.w-100
    div.col-12
      h3(v-if='!reconnecting') Connecting to
      h3(v-if='reconnecting') Reconnecting to
      h2 {{ options.connectionCode }}
      h3 ...
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { GamepadOptions } from '../GamepadOptions';
import { ControllerlyClient } from 'controllerly-core';

/**
 * Screen active as long as the client is connecting or reconnecting to the server.
 */
@Component
export default class Connecting extends Vue {
  @Prop() private client!: ControllerlyClient;
  @Prop() private reconnecting!: boolean;
  @Prop() private options!: GamepadOptions;
}

</script>