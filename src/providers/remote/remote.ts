import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable()
export class RemoteProvider {


  ws:any = null;
  options:any = [];
  adress:string = '127.0.0.1';
  port:string = '7007';

  private connected: boolean = false;
  private _connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public connected$: Observable<boolean> = this._connected.asObservable();

  constructor() {
  }

  isConnected(){
    this.connected = (this.ws != null);
    this._connected.next(this.connected);
  }
  connect(){
    this.ws = new WebSocket("ws://"+this.adress+":"+this.port, this.options);
    this.isConnected();
  }

  disconnect(){
    this.ws.close(1000, "Deliberate disconnection");
    this.ws = null;
    this.isConnected();
  }

  sendData(message){
    this.ws.send(message);
  }

}
