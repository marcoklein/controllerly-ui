
import { Component, Prop, Vue } from 'vue-property-decorator';
import { GamepadOptions } from '../GamepadOptions';
import { ControllerlyClient } from 'controllerly-core';
import { LayoutConfig, layoutConfigToHtml } from './LayoutConfig';
import $ from 'jquery';
import LayoutButton from '../components/layout/LayoutButton.vue';

export enum BUTTON_EVENT_TYPE {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    /**
     * A short tap.
     */
    TAP = 'tap',
    LONGPRESS = 'longPress',
    SWIPE_UP = 'swipeUp',
    SWIPE_LEFT = 'swipeLeft',
    SWIPE_RIGHT = 'swipeRight',
    SWIPE_DOWN = 'swipeDown'
}

/**
 * Name of fired button event.
 * Listen to it with v-on:button-event.
 */
export const EVENT_BUTTON_EVENT: string = 'button-event';
export type EVENT_BUTTON_TYPE = {
    /**
     * Name of the button.
     */
    name: string;
    type: BUTTON_EVENT_TYPE;
    pressed: boolean;
    timestamp: number;
};
/**
 * Event button type.
 */
export function createButtonEvent(name: string, type: BUTTON_EVENT_TYPE, pressed: boolean): EVENT_BUTTON_TYPE {
    return {
        name,
        type,
        pressed,
        timestamp: Date.now()
    }
}

/**
 * Script part of the Gamepad.vue component.
 * It creates and provides a gamepad layout and fires a button-event on button updates.
 * 
 * Parent components can listen to the button events and process them accordingly.
 */
@Component({
    components: {
        LayoutButton
    }
})
export default class GamepadLayout extends Vue {
    @Prop() private client!: ControllerlyClient;
    @Prop() private options!: GamepadOptions;

    /**
     * Layout configuration the gamepad is based on.
     */
    private layoutConfig: LayoutConfig = {
        center: {
            divider: {
                type: 'horizontal',
                initialPosition: 33
            },
            areaA: {
                type: 'button',
                name: 'start',
                text: 'Start'
            },
            areaB: {
                divider: {
                    type: 'horizontal',
                    initialPosition: 50
                },
                areaA: {
                    type: 'button',
                    name: 'select',
                    text: 'Select'
                },
                areaB: {
                    type: 'button',
                    name: 'select',
                    text: 'Select'
                }
            }
        },
        left: {
            divider: {
                type: 'vertical',
                initialPosition: 50
            },
            areaA: {
                type: 'button',
                name: 'left',
                text: 'Left'
            },
            areaB: {
                type: 'button',
                name: 'right',
                text: 'Right'
            }
        },
        right: {
            divider: {
                type: 'horizontal',
                initialPosition: 50
            },
            areaA: {
                type: 'button',
                name: 'left',
                text: 'Left'
            },
            areaB: {
                type: 'button',
                name: 'right',
                text: 'Right'
            }
        }
    };

    /**
     * Array with all previous touches.
     * Each touch has a unique identifier, directly mapped to a certain button id.
     */
    private lastButtonTouches: { [identifier: number]: string } = {};


    /**
     * Creates html from the gamepad layout configuration.
     */
    public get layoutHtml(): string {
        return layoutConfigToHtml(this.layoutConfig);
    }

    /* Input handling */

    /**
     * Changes the state of the button with the given name.
     * 
     * @param buttonName Defined in the config. button-name
     * @param pressed Pressed state.
     */
    private changeButtonState(buttonName: string, pressed: boolean) {
        // TODO cache buttons within object
        const buttonEl = $(`#gamepadLayout [button-name="${buttonName}"]`);
        const PRESSED_CLASS_NAME = 'pressed';
        const hasPressedClass = buttonEl.hasClass(PRESSED_CLASS_NAME);
        if (pressed) {
            if (!hasPressedClass) { // only emit event if there are two different events
                // switch to pressed
                buttonEl.addClass(PRESSED_CLASS_NAME);
                const buttonEvent = createButtonEvent(buttonName, BUTTON_EVENT_TYPE.ACTIVE, true);
                this.$emit(EVENT_BUTTON_EVENT, buttonEvent);
            }
        } else {
            if (hasPressedClass) {
                // switch to unpressed
                buttonEl.removeClass(PRESSED_CLASS_NAME);
                const buttonEvent = createButtonEvent(buttonName, BUTTON_EVENT_TYPE.INACTIVE, false);
                this.$emit(EVENT_BUTTON_EVENT, buttonEvent);
            }
        }
    }

    /**
     * Called as a touch, mouse down, touch move, or mouse move event occurs.
     * Handles and updates the pressed state of all buttons.
     */
    private handlePointerDown(x: number, y: number, identifier: number) {
        // find touched element
        const element = document.elementFromPoint(x, y);
        // extract button info
        const buttonName = !element ? null : element.getAttribute('button-name');

        // uncheck the last button if existing
        const lastButton = this.lastButtonTouches[identifier];
        if (lastButton !== buttonName) {
            this.changeButtonState(lastButton, false);
        } // else, lastButton is null or undefined

        if (buttonName) {
            // mark button as pressed
            this.changeButtonState(buttonName, true);
            // set last button in map
            this.lastButtonTouches[identifier] = buttonName;
        } else {
            this.changeButtonState(lastButton, false);
        }
    }

    private handlePointerMove(x: number, y: number, identifier: number) {
        // TODO implement swipe behavior
        this.handlePointerDown(x, y, identifier);
    }

    /**
     * Mouse or touch as been released.
     */
    private handlePointerUp(identifier: number) {
        // uncheck the last button if existing
        const lastButton = this.lastButtonTouches[identifier];
        if (lastButton) {
            this.changeButtonState(lastButton, false);
        } // else, lastButton is null or undefined
    }


    /* Handle mouse and touch input */

    private leftButtonMouseDown(event: MouseEvent) {
        this.handlePointerDown(event.clientX, event.clientY, 0);
    }

    private leftButtonMouseMove(event: MouseEvent) {
        if (event.which >= 1) {
            this.handlePointerDown(event.clientX, event.clientY, 0);
        }
    }
    private leftButtonMouseUp() {
        this.handlePointerUp(0);
    }

    private onTouchStart(event: TouchEvent) {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            this.handlePointerDown(touch.pageX, touch.pageY, touch.identifier);
        }
    }

    private onTouchMove(event: TouchEvent) {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            this.handlePointerMove(touch.pageX, touch.pageY, touch.identifier);
        }
    }

    private onTouchEnd(event: TouchEvent) {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            let touch = event.changedTouches[i];
            this.handlePointerUp(touch.identifier);
        }
    }
}
