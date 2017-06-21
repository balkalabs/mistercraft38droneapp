import { Injectable } from '@angular/core';
import { AlertProvider } from '../alert/alert';
import { LoadingController } from 'ionic-angular'

@Injectable()
export class RemoteProvider {

  ws:any = null;
  options:any = [];
  default_adress:string = '192.168.0.6';
  default_port:string = '234';

  loading:any = null;
  connected: boolean = false;

  constructor(public alert: AlertProvider, public loadingCtrl: LoadingController) {
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });
    this.loading.present();
  }

  dismissLoading(){
    if(this.loading){
      this.loading.dismiss();
    }
  }

  connect(adress:string=this.default_adress, port:string=this.default_port ){
    this.presentLoading();

    this.ws = new (<any>window).Socket();
    this.ws.open(adress,port,
      () => {
        console.log('connecté');
        this.dismissLoading();
        this.connected = true;
      },
      (error) => {
        console.log('connect_error: '+ error);
        this.dismissLoading();
        this.disconnect();
        this.alert.present('Connection error!', error, 'OK');
      });

    this.ws.onData = (message) =>{
      console.log('sent message: '+ message);
    };
    this.ws.onError = (error) => {
      console.log('connect_error: '+ error);
      this.disconnect();
      this.alert.present('Connection error!', error, 'OK');
    };
    this.ws.onClose = (hasError) => {
      this.disconnect();
      console.log('disconnecting, error: ' + hasError);
    };

  }

  disconnect(){
    this.presentLoading();
    if(this.ws){
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.dismissLoading();
  }

  sendData(message){
    if(!this.connected){
      this.alert.present('Not connected!', 'Please connect to the drone!', 'OK');
    }
    if(message != ''){
      let data = new Uint8Array(message.length);
      for (let i = 0; i < data.length; i++) {
        data[i] = message.charCodeAt(i);
      }
      console.log('message: '+message);
      console.log('data: '+data);
      this.ws.write(data);
    }
  }

}
