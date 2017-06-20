import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class AlertProvider {

  public alertPresented: any;

  constructor(public alertCtrl: AlertController) {
    this.alertPresented = false
  }

  present(title, subTitle, buttonText){
    let vm = this;
    if(!vm.alertPresented) {
      vm.alertPresented = true;
      vm.alertCtrl.create({
        title: title,
        subTitle: subTitle,
        buttons: [{
          text: buttonText,
          handler: () => {
            vm.alertPresented = false;
          }
        }],
      }).present();
    }
  }
}
