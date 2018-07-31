import { Component } from '@angular/core';
import {ModalController , NavController , NavParams , ViewController , ToastController } from 'ionic-angular';


import { ApiPost } from '../../providers/api-post';
import { HomePage } from '../home/home';
import { LoginModelPage } from '../login-model/login-model';
import { NoteOrderPage } from '../note-order/note-order';
import { Table } from '../table/table';

import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
  providers: [ApiPost]
})

export class Detail {
  order : any ;
  detail : any ;
  totalorder : number = 0;
  ppn : number = 0 ;
  totalPlusPPN : number = 0;
  kembalian : number = 0 ;
  bayar : number = 0 ;
  discount : number = 0 ;
  meja : number = 0 ;

  constructor(public navCtrl: NavController ,
              public navParams: NavParams ,
              public modalCtrl : ModalController ,
              public viewCtrl: ViewController ,
              public apiPost : ApiPost ,
              public toastCtrl : ToastController ,
              private _electronService: ElectronService ) {
    this.order = this.navParams.get('order');
    this.detail = this.navParams.get('detail');


    console.log(this.detail);
    this.totalorder = parseInt(this.order.total) ;
    this.ppn = parseInt(this.order.ppn) ;
    this.totalPlusPPN = this.totalorder + this.ppn ;
    this.totalPlusPPN = Math.ceil(this.totalPlusPPN / 100) * 100;
    this.discount = parseInt(this.order.discount) ;
    this.bayar = parseInt(this.order.uang_diterima) ;
    this.kembalian = this.bayar - this.totalPlusPPN ;
    this.kembalian = Math.floor(this.kembalian);
    this.meja = this.order.ruang ;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Detail');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onOrder(item) {
    this.viewCtrl.dismiss(item);
  }

  updateBayar(){
    this.kembalian = this.bayar - this.totalPlusPPN;
    this.kembalian = Math.floor(this.kembalian);
  }

  detail_proses(detail){
    let men =  new Array ;
    let plus = new Array ;
    let jadi = new Array ;
    let ba_c : any ;

    for(let dt in detail){
      if(detail[dt].harga <= 0)
        men.push(detail[dt]);
      else
        plus.push(detail[dt]);
    }

    if(men.length >= 1 ){

      for(let i in plus){
        ba_c = men.filter((item) => {
          return (item.barang_id.toLowerCase().indexOf(plus[i].barang_id.toLowerCase()) > -1);
        })

        if(ba_c.length >= 1 ){
          plus[i].qty -= ba_c[0].qty ;
        }

        if(plus[i].qty > 0) {
          jadi.push(plus[i]);
          console.log('lebih besar :'+plus[i].qty);
        }
      }

    }else{
      jadi = plus;
    }

    return jadi ;
  }

  bayarOrder(){
    if(this.bayar >= this.totalPlusPPN ){
        this.apiPost.updateOrder( this.order.transaksi_id , this.bayar , 1 )
            .then(data => {
              console.log(data);
              let dt : any = data ;
              if( dt.status == '200' ){
                this.PrintOrder();
                let toast = this.toastCtrl.create({
                  message: 'Pembayaran Order Berhasil di masukan!',
                  duration: 3000 ,
                  position : 'middle'
                });

                this.dismiss();
                toast.present();
              }else{
                alert(dt.error);
              }

            } , (err) => {
              console.log(err);
            });
    }else{
      alert('Nominal Pmebayaran tidak mencukupi / belom di masukan !')
    }
  }

  goOrder(){
    this.navCtrl.push(HomePage , { meja : this.meja , status : this.order.transaksi_id });
  }

  go_refund(barang){
    if(window.localStorage.getItem('akses') == 'admin'){
      let addnote = this.modalCtrl.create(NoteOrderPage , { barang : barang});
      addnote.present();
      addnote.onDidDismiss(data => {
        let dt : any = data ;
        this.refund(barang.barang_id , dt.qty);
      })

    }else{

      let loginmodel = this.modalCtrl.create( LoginModelPage );
      loginmodel.present();
      loginmodel.onDidDismiss(data => {
        if(data){
          let addnote = this.modalCtrl.create(NoteOrderPage , { barang : barang});
          addnote.present();
          addnote.onDidDismiss(data => {
            let dt : any = data ;
            this.refund(barang.barang_id  , dt.qty);
          });
        }else{
          alert('Maaf anda Tidak memiliki akses');
        }

      });
    }
  }

  refund(id , qty ){
    this.apiPost.go_refund(id , this.order.transaksi_id , qty)
        .then( data => {
          let dt : any = data ;
          if(dt.status == 200 ){

                  this.detail = dt.detail ;
                  this.order = dt.order ;

                  let toast = this.toastCtrl.create({
                    message: 'Refund Produk Berhasil !',
                    duration: 3000 ,
                    position : 'middle'
                  });
                  toast.present();
                  this.totalorder = parseInt(this.order.total) ;
                  this.ppn = parseInt(this.order.ppn) ;
                  this.totalPlusPPN = this.totalorder + this.ppn ;
                  this.discount = parseInt(this.order.discount) ;
                  this.kembalian = this.bayar - this.totalPlusPPN ;
          }else{
            alert('Error Revund : '+dt.error);
          }
        });
  }

  varColors(br){
    if(br.harga <= 1){
      return "danger";
    }
  }

  goRefundOrder(){
    if(window.localStorage.getItem('akses') == 'admin'){

      let order_id = this.order.transaksi_id;
      this.apiPost.go_refund_order(order_id)
          .then( data => {
            let dt : any = data ;
            if(dt.status == 200 ){
              let toast = this.toastCtrl.create({
                message: 'Refund Order Berhasil !',
                duration: 3000 ,
                position : 'middle'
              });
              toast.present();
              this.navCtrl.setRoot(Table);
            }else{
              alert('Error : '+dt.error);
            }
          });
    }else{

      let loginmodel = this.modalCtrl.create( LoginModelPage );
      loginmodel.present();
      loginmodel.onDidDismiss(data => {
        if(data){
          let order_id = this.order.transaksi_id;
          this.apiPost.go_refund_order(order_id)
              .then( data => {
                let dt : any = data ;
                if(dt.status == 200 ){
                  let toast = this.toastCtrl.create({
                    message: 'Refund Order Berhasil !',
                    duration: 3000 ,
                    position : 'middle'
                  });
                  toast.present();
                  this.navCtrl.setRoot(Table);
                }else{
                  alert('Error : '+dt.error);
                }
              });
        }else{
          alert('Maaf anda Tidak memiliki akses');
        }

      });
    }

  }

  PrintOrder(){
    let pembayaran = {
      subtotal : this.totalorder ,
      discount : this.discount ,
      ppn : this.ppn ,
      total : this.totalPlusPPN ,
      bayar : this.bayar ,
      kembali : this.kembalian
    }
    //let dtl_order = this.detail_proses(this.detail);
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    let tgl_transaki = new Date(this.order.tanggal_transaksi);
    let tlg_now = tgl_transaki.getDate().toString() + ' ' +
                  monthNames[tgl_transaki.getMonth().toString()] +' ' +
                  tgl_transaki.getFullYear().toString() + ' / ' +
                  tgl_transaki.getHours().toString() + ':' +
                  tgl_transaki.getMinutes().toString() ;

    window.localStorage.setItem('pembayaran',JSON.stringify(pembayaran));
    window.localStorage.setItem('orderdt',JSON.stringify(this.detail));
    window.localStorage.setItem('meja', this.meja.toString());
    window.localStorage.setItem('invoice_id', this.order.transaksi_id);
    window.localStorage.setItem('tgl_order', tlg_now);
    if(this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('print-diam' , window.localStorage.getItem('print_kasir'));
    }
  }

}
