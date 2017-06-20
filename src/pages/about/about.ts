import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EnvVars } from '../../env-variables';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  github_url = EnvVars.GITHUB_URL;

  constructor(public navCtrl: NavController) {

  }

}
