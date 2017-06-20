import { Component, ViewChild, ElementRef } from '@angular/core';
import { RemoteProvider } from '../../providers/remote/remote';
import { AlertProvider } from '../../providers/alert/alert';
import { JoystickProvider } from '../../providers/joystick/joystick';
import * as nipplejs from 'nipplejs'
import { JoystickData } from '../../models/joystickData-model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('zone_jpad') zone_jpad: ElementRef;

  connected:boolean = false;
  _connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  jData: JoystickData = {
    angle : '',
    x : '',
    y : '',
    degree: null
  };

  direction:string = null;
  _direction: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(public alert: AlertProvider, public remote: RemoteProvider, public joystick: JoystickProvider) {
    this.remote.connected$.subscribe((response) => {
        this.connected = response;
        this._connected.next(this.connected);
      },
      error => {
        console.log('Could not subscribe direction$ - remote.ts', this.direction, error);
      }
    );
    this.joystick.direction$.subscribe((response) => {
        this.direction = response;
        this._direction.next(this.direction);
        this.sendMessage();
      },
      error => {
        console.log('Could not subscribe direction$ - remote.ts', this.direction, error);
      }
    );
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

    this.joystick.manager = nipplejs.create(joystick_options);
    this.joystick.joystick = this.joystick.manager.get(0);

    this.joystick.joystick.on('start', function (evt, data) {
      self.joystick.updateMessage('start');
    });

    this.joystick.joystick.on('move', function (evt, data) {
      if(typeof data != 'undefined'){
        if(data.pressure >= 0.5 && data.distance > 50){
          self.jData.angle = data.direction.angle;
          self.jData.x = data.direction.x;
          self.jData.y = data.direction.y;
          self.jData.degree = data.angle.degree;
          self.joystick.updateMessage(self.joystick.determineDirection(self.jData.degree));
        }
      }
    });

    this.joystick.joystick.on('end', function (evt, data) {
      self.joystick.updateMessage('stop');
    });
  }

  showAlert() {
    this.alert.present('Not connected!', 'Please connect to the drone!', 'OK');
  }

  sendMessage(){
    if(!this.connected){
      this.showAlert();
    }
    else{
      this.remote.sendData(this.direction);
    }
  }

  testMessage(){
    if(!this.connected){
      this.showAlert();
    }
    else{
      this.remote.sendData('test');
    }
  }

}
