import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable()
export class JoystickProvider {

  manager: any = null;
  joystick: any = null;

  private direction: string;
  private _direction: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public direction$: Observable<string> = this._direction.asObservable();

  constructor() {
  }

  updateMessage(value){
    this.direction = value;
    this._direction.next(this.direction);
  }

  between(x, min, max) {
    return x >= min && x <= max;
  }

  /*emulate 360° on direct orthonormed system (x' x y' y) with 0-360 on x axis
   *     \  90° /
   *      \    /
   * 180°       0°/360°
   *      /    \
   *     / 270° \
   */
  //6 directions: downleft & downright not implemented
  determineDirection(degree){
    if( this.between(degree, 67.5, 112.5) ){
      return 'up';
    }
    if( this.between(degree, 112.5, 157.5) ){
      return 'upleft';
    }
    if( this.between(degree, 22.5, 67.5) ){
      return 'upright';
    }
    if( this.between(degree, 157.5, 202.5) ){
      return 'left';
    }
    if( this.between(degree, 337.5, 360) || this.between(degree, 0, 22.5) ){
      return 'right';
    }
    if( this.between(degree, 247.5, 292.5) ){
      return 'down';
    }
    return 'stop';
  }

}
