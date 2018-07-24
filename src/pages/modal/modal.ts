import { Component } from '@angular/core';
import {  NavController, NavParams , ToastController } from 'ionic-angular';

import { ApiPost } from '../../providers/api-post';

import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
  providers : [ApiPost]
})
export class ModalPage {
  dt = {
    type : '' ,
    nilai : '' ,
    ket : ''
  }
  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              public apiPost : ApiPost ,
              private _electronService: ElectronService ,
              public toastCtrl : ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

  simpanInOut(){
    this.apiPost.add_in_out(this.dt)
        .then(data => {
          let dt : any = data ;
          if( dt.status = 200 ){
            
                if( this.dt.type == '1' ) this.dt.type = 'Masuk'; else this.dt.type = 'Keluar' ;
                let data_in_out = {
                              'user' : dt.user ,
                              'nilai' : this.dt.nilai ,
                              'ket' : this.dt.ket ,
                              'type' : this.dt.type
                          };

                if(this._electronService.isElectronApp) {
                  this._electronService.ipcRenderer.send('print-modal' , window.localStorage.getItem('print_kasir'));
                }

                localStorage.setItem('data_in_out' , JSON.stringify(data_in_out));
                let toast = this.toastCtrl.create({
                  message: 'Data Tersimpan !',
                  duration: 3000 ,
                  position : 'middle'
                });
                toast.present();
                this.dt.type = "";
                this.dt.nilai = "" ;
                this.dt.ket = "";
          }else{
            alert('Data Gagal Tersimpan !');
          }
        });
  }

}
