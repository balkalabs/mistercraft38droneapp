import { Component, ViewChild, ElementRef } from '@angular/core';
import { RemoteProvider } from '../../providers/remote/remote';
import * as nipplejs from 'nipplejs'
import { EnvVars } from '../../env-variables';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('zone_jpad') zone_jpad: ElementRef;

  engine:any = EnvVars.ENGINE_DIRECTION;
  manager: any = null;
  joystick: any = null;

  direction:string = null;

  adress:string=null;
  port:string=null;

  constructor( public remote: RemoteProvider) {
    this.adress = this.remote.default_adress;
    this.port = this.remote.default_port;
  }

  ngAfterViewInit() {
    let self=this;
    let joystick_options = {
      mode: 'static',
      position: {
        left: '50%',
        top: '50%'
      },
      size: 150,
      color: 'black',
      zone: this.zone_jpad.nativeElement
    };

    this.manager = nipplejs.create(joystick_options);
    this.joystick = this.manager.get(0);

    this.joystick.on('move', (evt, data) => {
      if(typeof data != 'undefined'){
        if(data.pressure >= 0.5 && data.distance > 45){
          let newDirection = self.determineDirection(data.angle.degree);
          self.updateDirection(newDirection);
        }
      }
    });

    this.joystick.on('end', () => {
      let newDirection = 'idle';
      self.updateDirection(newDirection);
    });
  }

  updateDirection(newDirection:string){
    if(this.direction != newDirection){
      this.direction = newDirection;
      this.remote.sendData(this.engine[this.direction]);
    }
  }

  testMessage(){
    this.remote.sendData('128 128');
  }


  private between(x, min, max) {
    return x >= min && x <= max;
  }

  /*emulate 360° on direct orthonormed system (x' x y' y) with 0-360 on x axis
   *     \  90° /
   *      \    /
   * 180°       0°/360°
   *      /    \
   *     / 270° \
   */
  determineDirection(degree){
    if( this.between(degree, 67, 112) ){
      return 'up';
    }
    if( this.between(degree, 112, 157) ){
      return 'upleft';
    }
    if( this.between(degree, 22, 67) ){
      return 'upright';
    }
    if( this.between(degree, 157, 202) ){
      return 'left';
    }
    if( this.between(degree, 337, 360) || this.between(degree, 0, 22) ){
      return 'right';
    }
    if( this.between(degree, 202, 246) ){
      return 'downleft';
    }
    if( this.between(degree, 292, 337) ){
      return 'downright';
    }
    if( this.between(degree, 246, 292) ){
      return 'down';
    }
    return 'idle';
  }

}
