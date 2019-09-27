/**
 * User-defined options for the Gamepad.
 *
 * Contains options for appearence and server-side options.
 */
export class GamepadOptions {

    public connectionTries: number = 0;
    public connectionError: string | null = null;

    public connectionCode: string = '';
    public text: string = '';
}
