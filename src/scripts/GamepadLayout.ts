
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { GamepadOptions } from '../GamepadOptions';
import { ControllerlyClient } from 'controllerly-core';
import { LayoutConfig, layoutConfigToHtml } from './LayoutConfig';
import $ from 'jquery';
import LayoutButton from '../components/layout/LayoutButton.vue';

/**
 * Name of fired button event.
 * Listen to it with v-on:button-event.
 */
export const EVENT_BUTTON_EVENT: string = 'button-event';

export enum ButtonEventType {
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

export interface ButtonEvent {
    /**
     * Name of the button.
     */
    name: string;
    type: ButtonEventType;
    pressed: boolean;
    timestamp: number;
}
/**
 * Event button type.
 */
export function createButtonEvent(name: string, type: ButtonEventType, pressed: boolean): ButtonEvent {
    return {
        name,
        type,
        pressed,
        timestamp: Date.now()
    };
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

    /**
     * Creates html from the gamepad layout configuration.
     */
    public get layoutHtml(): string {
        return layoutConfigToHtml(this.layoutConfig);
    }
    /**
     * As long as adjusting is true, the user can adjust the gamepad layout.
     */
    @Prop() public adjusting!: boolean;
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
     * Map off pointers that are currently pressed.
     */
    private pressedPointers: { [identifier: number]: boolean } = {};
    /**
     * Locked sliders, that are currently being dragged.
     */
    private movingSliders: { [identifier: number]: { verticalPosition: number, horizontalPosition: number, startX: number, startY: number, element: Element }} = {};

    public mounted() {
        // trigger initial adjusting value
        this.onAdjustChange(this.adjusting, !this.adjusting);
    }

    /* Dynamic adjusting */

    @Watch('adjusting')
    private onAdjustChange(val: boolean, oldVal: boolean) {
        if (val) {
            this.enableAdjusting();
        } else {
            this.disableAdjusting();
        }
    }

    private enableAdjusting() {
        // add slider for all vertical splits on left side
        const vSplits = $('#gamepadLayout .v-split');
        // add slider between first and second child
        // positioning is defined in gamepad-layout.scss
        const secondChild = vSplits.children().eq(1);
        // add slider on second child to adjust width
        const hSlider = $('<div>');
        hSlider.addClass('h-slider');
        secondChild.append(hSlider);

        // add slider
        const hSplits = $('#gamepadLayout .h-split');
        hSplits.each(function() {
            const secondVChild = $(this).children().eq(1);
            const vSlider = $('<div>');
            vSlider.addClass('v-slider');
            secondVChild.append(vSlider);
        });
    }

    private disableAdjusting() {
        $('#gamepadLayout .v-slider').remove();
        $('#gamepadLayout .h-slider').remove();
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
                const buttonEvent = createButtonEvent(buttonName, ButtonEventType.ACTIVE, true);
                this.$emit(EVENT_BUTTON_EVENT, buttonEvent);
            }
        } else {
            if (hasPressedClass) {
                // switch to unpressed
                buttonEl.removeClass(PRESSED_CLASS_NAME);
                const buttonEvent = createButtonEvent(buttonName, ButtonEventType.INACTIVE, false);
                this.$emit(EVENT_BUTTON_EVENT, buttonEvent);
            }
        }
    }

    /**
     * Called as a touch, mouse down, touch move, or mouse move event occurs.
     * Handles and updates the pressed state of all buttons.
     */
    private handlePointerDown(x: number, y: number, identifier: number) {
        this.pressedPointers[identifier] = true;
        // find touched element
        const element = document.elementFromPoint(x, y);

        if (this.movingSliders[identifier]) {
            // locked -> but should not call this function
            // probably pointerUp hasn't been called properly
            return;
        } else if (element && this.adjusting) {
            // check if a slider is touched
            const $element = $(element);
            const $area = $element.parent().parent();
            const firstWidth = $area.children().eq(0).width() || 0;
            const firstHeight = $area.children().eq(0).height() || 0;
            const parentWidth = $area.width() || 0;
            const parentHeight = $area.height() || 0;

            if ($element.hasClass('h-slider')) {
                // lock slider of identifier
                this.movingSliders[identifier] = {
                    verticalPosition: $element.position().top / parentHeight,
                    horizontalPosition: firstWidth / parentWidth,
                    startX: x,
                    startY: y,
                    element
                };
                return;
            } else if ($element.hasClass('v-slider')) {
                // lock slider of identifier
                this.movingSliders[identifier] = {
                    verticalPosition: firstHeight / parentHeight,
                    horizontalPosition: $element.position().left / parentWidth,
                    startX: x,
                    startY: y,
                    element
                };
                return;
            } else {
                // no slider has been selected
                // check if button has been pressed
            }
        }

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
        if (!this.pressedPointers[identifier]) {
            // pointer is not pressed
            // FIXME on mouse events: if user leaves window it is not recognized by the pointer up event
            return;
        }
        const movingSlider = this.movingSliders[identifier];
        if (movingSlider) {
            // locked on slider
            // update slider drag
            const $element = $(movingSlider.element);
            // get drag delta
            const deltaX = x - movingSlider.startX;
            const deltaY = y - movingSlider.startY;

            // get parent areas
            const parent = $element.parent().parent();
            const firstChild = parent.children().eq(0);
            const secondChild = parent.children().eq(1);

            // calculate
            const parentWidth = parent.width() || 0;
            const parentHeight = parent.height() || 0;
            const deltaXPercentage = deltaX / parentWidth;
            const deltaYPercentage = deltaY / parentHeight;

            // calculate width related
            let firstChildWidth = movingSlider.horizontalPosition + deltaXPercentage;
            // min and max percentages
            firstChildWidth = firstChildWidth < 0.1 ? 0.1 : firstChildWidth;
            firstChildWidth = firstChildWidth > 0.9 ? 0.9 : firstChildWidth;
            // convert to a percentage
            firstChildWidth *= 100;

            // calculate height related
            let firstChildHeight = movingSlider.verticalPosition + deltaYPercentage;
            // min and max percentages
            firstChildHeight = firstChildHeight < 0.1 ? 0.1 : firstChildHeight;
            firstChildHeight = firstChildHeight > 0.9 ? 0.9 : firstChildHeight;
            // convert to a percentage
            firstChildHeight *= 100;

            // set area width
            if ($element.hasClass('h-slider')) {
                firstChildHeight = firstChildHeight > 80 ? 80 : firstChildHeight;
                $element.css('top', firstChildHeight + '%');
                // set width
                firstChild.css('width', firstChildWidth + '%');
                secondChild.css('width', (100 - firstChildWidth) + '%');
            } else if ($element.hasClass('v-slider')) {
                firstChildWidth = firstChildWidth > 80 ? 80 : firstChildWidth;
                $element.css('left', firstChildWidth + '%');
                // set width
                firstChild.css('height', firstChildHeight + '%');
                secondChild.css('height', (100 - firstChildHeight) + '%');
            }
        } else {
            // TODO implement swipe behavior
            // handle button change

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
    }

    /**
     * Mouse or touch as been released.
     */
    private handlePointerUp(identifier: number) {
        delete this.pressedPointers[identifier];
        if (this.movingSliders[identifier]) {
            // release slider
            delete this.movingSliders[identifier];
        }
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
            this.handlePointerMove(event.clientX, event.clientY, 0);
        }
    }
    private leftButtonMouseUp() {
        this.handlePointerUp(0);
    }

    private onTouchStart(event: TouchEvent) {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            this.handlePointerDown(touch.pageX, touch.pageY, touch.identifier);
        }
    }

    private onTouchMove(event: TouchEvent) {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            this.handlePointerMove(touch.pageX, touch.pageY, touch.identifier);
        }
    }

    private onTouchEnd(event: TouchEvent) {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            this.handlePointerUp(touch.identifier);
        }
    }
}
