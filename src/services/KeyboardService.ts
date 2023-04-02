import { Keycodes } from "../models/Keycodes";

export class KeyboardService {
  private keyPressed: { [key: number]: boolean } = {};
  private wheelDelta: number = 0;

  public Start() {
    // Mouse / Keyboard events
    window.onkeyup = ((that: any) => {
      return (e: KeyboardEvent) => {
        that.keyPressed[e.keyCode] = false;
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
    })(this);
    window.onkeydown = ((that: any) => {
      return (e: KeyboardEvent) => {
        that.keyPressed[e.keyCode] = true;
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
    })(this);
    window.onwheel = ((that: any) => {
      return (e: WheelEvent) => {
        that.wheelDelta = e.deltaY;
      };
    })(this);
  }

  public IsKeyPressed(keycode: Keycodes): boolean {
    return this.keyPressed[keycode];
  }

  public GetWheelDelta(): number {
    return this.wheelDelta;
  }

  // After each "frame" we need to reset all relative variables
  public Reset() {
    this.wheelDelta = 0;
  }
}
