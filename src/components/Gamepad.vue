<template>
<div>
  <h2>Gamepad</h2>
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
export default class Gamepad extends Vue {
  @Prop() private client!: ControllerlyClient;
  @Prop() private options!: GamepadOptions;
}

</script>