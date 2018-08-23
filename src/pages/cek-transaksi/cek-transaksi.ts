import { Component } from '@angular/core';
import {  NavController, NavParams , AlertController } from 'ionic-angular';

import { ElectronService } from 'ngx-electron';

import { ApiPost } from '../../providers/api-post';
@Component({
  selector: 'page-cek-transaksi',
  templateUrl: 'cek-transaksi.html',
  providers : [ApiPost]
})
export class CekTransaksiPage {
  start : any ;
  end : any ;
  transaksi : any = [] ;
  total : any ;

  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              public apiPost : ApiPost ,
              public alertCtrl : AlertController,
              private _electronService: ElectronService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CekTransaksiPage');
  }

  ambildata(){
    this.apiPost.cek_transaksi(this.start , this.end)
        .then( data => {
          let dt : any = data ;
          if(dt.status == 200){
            this.transaksi = dt.transaksi ;
            this.total = dt.total;
          }else{
            alert('Koneksi error mohan coba lagi ');
          }
        });
  }

  printdata(){

    if(this.transaksi.length > 0){
      console.log(this.transaksi);
      let dt_tran = [];
      var jum = this.transaksi.length;
      var i = 0 ;
      while (i < jum) {

          if(!isNaN(this.transaksi[i].meja)){
            dt_tran.push(this.transaksi[i]);
          }

          i++;
      }
      if(this._electronService.isElectronApp) {
        this._electronService.ipcRenderer.send('print-transaksi' , window.localStorage.getItem('print_kasir') ,  dt_tran );
      }

    }else{
      let alert = this.alertCtrl.create({
        title: 'Data Belom kosong',
        subTitle: 'Klik button ambil data terlebih dulu sembelom print data',
        buttons: ['ok']
      });
      alert.present();
    }
  }

}
