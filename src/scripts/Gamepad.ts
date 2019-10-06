import { Component, Prop, Vue } from 'vue-property-decorator';
import { GamepadOptions } from '../GamepadOptions';
import { ControllerlyClient } from 'controllerly-core';
import GamepadLayout from '../components/GamepadLayout.vue';
import { ButtonEvent } from './GamepadLayout';

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

  private adjusting: boolean = true;

  private created() {
    // prevent the context menu to show up
    // this might happen on long touch presses
    window.oncontextmenu = function(event: any) {
      event.preventDefault();
      event.stopPropagation();
      return false;
  };
  }

  /**
   * The Gamepad component fired a button event.
   */
  private onButtonEvent(event: ButtonEvent) {
    // send button event
    this.client.sendMessage('buttonEvent', event);
  }

  private toggleAdjustLock() {
    this.adjusting = !this.adjusting;
  }

}
