import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  github_url = "https://github.com/Mistercraft38/Drone-rainbow-six"

  constructor(public navCtrl: NavController) {

  }

}
