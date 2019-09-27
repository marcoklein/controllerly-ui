<template>
<div>
    <h2 v-if="!reconnecting">Connecting...</h2>
    <h2 v-if="reconnecting">Reconnecting...</h2>
    <h3>to {{ options.connectionCode }}</h3>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { GamepadOptions } from '../GamepadOptions';
import { ControllerlyClient } from 'controllerly-core';

/**
 * User enters the connection code that the server provides.
 */
@Component
export default class Connecting extends Vue {
  @Prop() private client!: ControllerlyClient;
  @Prop() private reconnecting!: boolean;
  @Prop() private options!: GamepadOptions;
}

</script>