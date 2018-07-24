import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CekTransaksiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
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

  constructor(public navCtrl: NavController, public navParams: NavParams , public apiPost : ApiPost) {
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
            alert('KOneksi error mohan coba lagi ');
          }
        });
  }

}
