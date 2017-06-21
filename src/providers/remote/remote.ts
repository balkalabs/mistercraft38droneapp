import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';
import { AlertProvider } from '../alert/alert';
import { LoadingController } from 'ionic-angular'
// import * as io from 'socket.io-client';

@Injectable()
export class RemoteProvider {

  ws:any = null;
  options:any = [];
  adress:string = '192.168.0.6';
  port:string = '234';

  loading:any = null;

  private connected: boolean = false;
  private _connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public connected$: Observable<boolean> = this._connected.asObservable();

  constructor(public alert: AlertProvider, public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });
  }

  updateConnected(value:boolean){
    this.connected = value;
    this._connected.next(this.connected);
  }

  connect(){
    this.loading.present();

    // WEBSOCKET
    // this.ws = io("http://"+this.adress+":"+this.port, { 'forceNew': true, 'reconnection': false, 'autoConnect': false });
    //
    // this.ws.on('connect', () => {
    //   console.log('connect_id: '+ this.ws.id);
    //   this.isConnected();
    // });
    //
    // this.ws.on('connect_error', (error) => {
    //   console.log('connect_error: '+ error);
    //   this.alert.present('Connection error!', error, 'OK');
    //   this.disconnect();
    //   this.isConnected();
    // });
    //
    // this.ws.on('message', (message) => {
    //   console.log('send message: '+ message);
    // });
    //
    // this.ws.on('disconnect', () => {
    //   console.log('disconnect_id: '+ this.ws.id);
    //   this.disconnect();
    //   this.isConnected();
    // });
    //
    // this.ws.open();(

    // SOCKET TCP
    this.ws = new (<any>window).Socket();


    this.ws.open(this.adress,this.port,
      () => {
        // invoked after successful opening of socket
        console.log('connecté');
        this.loading.dismiss();
        this.updateConnected(true);
      },
      (error) => {
        // invoked after unsuccessful opening of socket
        console.log('connect_error: '+ error);
        this.loading.dismiss();
        this.disconnect();
        this.alert.present('Connection error!', error, 'OK');
      });

    this.ws.onData = (message) =>{
      // invoked after new batch of data is received (typed array of bytes Uint8Array)
      console.log('sent message: '+ message);
    };
    this.ws.onError = (error) => {
      // invoked after error occurs during connection
      console.log('connect_error: '+ error);
      this.disconnect();
      this.alert.present('Connection error!', error, 'OK');
    };
    this.ws.onClose = (hasError) => {
      this.disconnect();
      // invoked after connection close
      console.log('disconnecting, error: ' + hasError);
    };

  }

  disconnect(){
    this.loading.present();
    if(this.ws){
      this.ws.close();
      this.ws = null;
    }
    this.updateConnected(false);
    this.loading.dismiss();
  }

  sendData(message){
    if(!this.connected){
      this.alert.present('Not connected!', 'Please connect to the drone!', 'OK');
    }
    if(message != ''){
      // this.ws.emit('message', message);
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
