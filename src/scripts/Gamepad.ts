import { Component, Prop, Vue } from 'vue-property-decorator';
import { GamepadOptions } from '../GamepadOptions';
import { ControllerlyClient } from 'controllerly-core';
import GamepadLayout from '../components/GamepadLayout.vue';
import { BUTTON_EVENT_TYPE } from './GamepadLayout';

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


  /**
   * The Gamepad component fired a button event.
   */
  onButtonEvent(event: BUTTON_EVENT_TYPE) {
    console.log('button event', event);
  }
  
}