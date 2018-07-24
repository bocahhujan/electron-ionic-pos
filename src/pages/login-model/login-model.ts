import { Component } from '@angular/core';
import {NavParams , ViewController} from 'ionic-angular';

/**
 * Generated class for the LoginModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { ApiPost } from '../../providers/api-post';

@Component({
  selector: 'page-login-model',
  templateUrl: 'login-model.html',
  providers : [ApiPost]
})
export class LoginModelPage {
  dt = {
    username : '',
    password : ''
  }
  constructor(public navParams: NavParams , public apiPost : ApiPost , public viewCtrl : ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginModelPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  logForm(){
    this.apiPost.loginPage(this.dt)
        .then( data => {
          let dt : any = data ;
          if(dt.status == '200'){
            if(dt.akses == 'admin'){
              this.viewCtrl.dismiss(true);
            }else{
              this.viewCtrl.dismiss(false);
            }
          }else{
            alert(dt.error);
          }

        })
  }

}
