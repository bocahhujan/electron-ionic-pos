import { Component } from '@angular/core';
import { NavController , LoadingController ,AlertController} from 'ionic-angular';


import { ApiPost } from '../../providers/api-post';

import { Setting } from '../setting/setting';
import { Table } from '../table/table';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers : [ApiPost]
})

export class LoginPage {
  dt = {
    username : '',
    password : ''
  }

  constructor(public navCtrl: NavController ,
              public apiPost : ApiPost ,
              public alertCtrl: AlertController ,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  logForm(){
    //console.log(window.localStorage.getItem('server_url'));
    if(window.localStorage.getItem('server_url') != '' && window.localStorage.getItem('server_url') != null ){
    this.apiPost.loginPage(this.dt)
        .then( data => {
          let dt : any = data ;
          if(dt.status == '200'){
            window.localStorage.setItem('id_user' , dt.user_id);
            window.localStorage.setItem('akses' , dt.akses);
            this.navCtrl.setRoot(Table);
          }else{
            let alert = this.alertCtrl.create({
              title: 'Gagal Login',
              subTitle: dt.error,
              buttons: ['ok']
            });
            alert.present();
          }

        })
    }else{
      let alert = this.alertCtrl.create({
        title: 'Alamat Server Belom di setting',
        subTitle: 'Mohon isi alamat server di menu setting',
        buttons: ['ok']
      });
      alert.present();

    }
  }

  goSetting(){
    this.navCtrl.push(Setting);
  }

}
