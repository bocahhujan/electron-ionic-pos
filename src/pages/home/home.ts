import { Component } from '@angular/core';
import { NavController , ModalController , ToastController , NavParams  , ViewController} from 'ionic-angular';

import { ApiPost } from '../../providers/api-post';

import { Table } from '../table/table';
import { UpdateOrder } from '../update-order/update-order';


import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html' ,
  providers : [ApiPost]
})

export class HomePage {
  catdt : any ;
  produk : any ;
  data : any ;
  searchinput : string;
  orderdt : any = [] ;
  totalorder : number = 0;
  meja : number ;
  ppn : number = 0 ;
  totalPlusPPN : number = 0;
  kembalian : number = 0 ;
  bayar : number = 0 ;
  discount : number = 0 ;
  order_id : number = 0;
  monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  constructor(public navCtrl: NavController ,
              public apiPost : ApiPost ,
              public modalCtrl : ModalController ,
               public viewCtrl: ViewController ,
              public parems : NavParams ,
              private _electronService: ElectronService ,
              public toastCtrl: ToastController) {
    this.apiPost.getKategori()
        .then(data => {
          console.log(data);
          this.catdt = data;
        } , (err) => {
          console.log(err);
        });
    this.getProduk();
    this.meja = this.parems.get('meja');
    this.order_id = this.parems.get('status');
    console.log(this.order_id);
    localStorage.setItem('order_note', '');
  }

  hitungPPN(){

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getProdukbycat(id){
    this.apiPost.getProdukbycat(id)
        .then(data => {
          console.log(data);
          this.produk = data;
        } , (err) => {
          console.log(err);
        });
  }

  getProduk(){
    this.apiPost.getProduk()
        .then(data => {
          console.log(data);
          this.produk = data;
        } , (err) => {
          console.log(err);
        });
  }



  GoupdateOrder(dt){
    console.log(dt);
    let updateDetail = this.modalCtrl.create(UpdateOrder, { detail : dt });
    updateDetail.onDidDismiss(data => {
      console.log(data);
      if( typeof(data) != "undefined" && data !== null){
        if(data.action == 'update'){
          this.updateOrderAction(data.data);
        }else if(data.action == 'delete'){
          this.deleteOrder(data.data);
        }
      }
    });
    updateDetail.present();
  }

  addnote(){

  }

  onCancel(dt){
    this.getProduk();
  }

  onInput(dt){
    console.log(this.searchinput);
    this.apiPost.caribarang(this.searchinput)
        .then(data => {
          console.log(data);
          this.produk = data;
        } , (err) => {
          console.log(err);
        });
  }

  updateOrderAction(dt){

    let updateItem = this.orderdt.find(this.findIndexToUpdate , dt.barang_id )
    console.log(updateItem);
    let index = this.orderdt.indexOf(updateItem);
    let dtin = {
          barang_id : dt.barang_id ,
          nama_barang : dt.nama_barang ,
          harga : dt.harga ,
          qty : parseInt(dt.qty) ,
          jenis: dt.jenis ,
          note : dt.note
      }
      this.orderdt[index] = dtin;


    this.updateTotal();
  }

  deleteOrder(dt){
    let updateItem = this.orderdt.find(this.findIndexToUpdate , dt.barang_id )
    let index = this.orderdt.indexOf(updateItem);
    this.orderdt.splice(index, 1);

    this.updateTotal();

  }

  addorder(dt){
    let updateItem ;
    console.log(updateItem);
    let dtin ;
    if( updateItem = this.orderdt.find(this.findIndexToUpdate , dt.barang_id )){
    let index = this.orderdt.indexOf(updateItem);
      dtin = {
          barang_id : dt.barang_id ,
          nama_barang : dt.nama_barang ,
          harga : dt.harga ,
          qty : updateItem.qty + 1 ,
          jenis : dt.jenis ,
          kategori : dt.nama_kategori ,
          note : ''
      }
      this.orderdt[index] = dtin;
    }else{
      dtin = {
          barang_id : dt.barang_id ,
          nama_barang : dt.nama_barang ,
          harga : dt.harga ,
          qty : 1 ,
          jenis : dt.jenis ,
          kategori : dt.nama_kategori ,
          note : ''
      }
      this.orderdt.push(dtin) ;
    }

    this.updateTotal();
  }

  findIndexToUpdate(newItem) {
       return newItem.barang_id === this;
  }

  updateTotal(){
    //console.log(this.orderdt);
    this.totalorder = 0;
    if(this.orderdt.length >= 1 ){
      this.orderdt.forEach( data => {
        let total = data.harga * data.qty ;
        console.log(total);
        this.totalorder += total;
        this.ppn =  this.totalorder * 0.1;
        this.totalPlusPPN  = this.totalorder + this.ppn;
        this.totalPlusPPN = Math.ceil(this.totalPlusPPN);
      })
    }
    //console.log(this.totalorder);
    console.log(this.totalorder);
  }

  hapusallorder(){
    this.orderdt = [];
    this.totalorder = 0;
    this.totalPlusPPN = 0 ;
    this.bayar = 0 ;
    this.ppn = 0;
  }

  updateBayar(){
    this.kembalian = this.bayar - this.totalPlusPPN;
    this.kembalian = Math.ceil(this.kembalian);
  }

  submitorder(){
    if(this.orderdt.length >= 1 ){
      if(this.order_id == 0 ){
        this.apiPost.submitorder(this.orderdt , this.meja , 0 , this.discount , this.ppn , this.bayar )
            .then(data => {
              console.log(data) ;
              let dt : any = data ;
              if( dt.status == '200' ){
                this.order_id = dt.id ;
                console.log(this.order_id );
                this.printOrderTanpaBayar();
                let toast = this.toastCtrl.create({
                  message: 'Order Anda berhasi di masukan ,  Terimakasih !',
                  duration: 3000 ,
                  position : 'middle'
                });
                toast.present();
                this.hapusallorder();
                this.dismiss();
              }else{
                alert(dt.error);
              }

            } , (err) => {
              console.log(err);
            });
        }else{
          this.apiPost.updateOrderDetail(this.orderdt , this.meja  , this.order_id)
            .then(data => {
              console.log(data);
              let dt : any = data ;
              if( dt.status == '200' ){

                this.printOrderTanpaBayar();
                let toast = this.toastCtrl.create({
                  message: 'Order Anda berhasi di masukan ,  Terimakasih !',
                  duration: 3000 ,
                  position : 'middle'
                });
                toast.present();
                this.hapusallorder();
                this.navCtrl.setRoot(Table);
              }else{
                alert(dt.error);
              }

            } , (err) => {
              console.log(err);
            });
        }
    }else{
      alert('Anda belom memilih menu yang akan di pesan !')
    }
  }

  bayarOrder(){
    if(this.order_id == 0 ){
      if(this.orderdt.length >= 1 ){
          if( this.bayar >= this.totalPlusPPN ){
          this.apiPost.submitorder(this.orderdt , this.meja , 1  , this.discount , this.ppn , this.bayar)
              .then(data => {
                console.log(data);
                let dt : any = data ;
                if( dt.status == '200' ){
                  this.order_id = dt.id ;
                  console.log(this.order_id );
                  this.PrintOrder();
                  let toast = this.toastCtrl.create({
                    message: 'Order Anda berhasi di masukan ,  Terimakasih !',
                    duration: 3000 ,
                    position : 'middle'
                  });
                  toast.present();
                  this.hapusallorder();
                  this.dismiss();
                }else{
                  alert(dt.error);
                }

              } , (err) => {
                console.log(err);
              });
          }else{
            alert('Nilai pembayaran kurang / belom di isi !');
          }
      }else{
        alert('Anda belom memilih menu yang akan di pesan !');
      }
    }else{
      alert('Tidak Bisa Melakukan Pebaran karena order tambahan!');
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

    let dt_dapur = new Array();
    let dt_bar = new Array();

    for( let dp in this.orderdt){

      if(this.orderdt[dp].jenis == '1' ){
        dt_dapur.push(this.orderdt[dp]);
      }

      if(this.orderdt[dp].jenis == '2'){
        dt_bar.push(this.orderdt[dp]);
      }

      console.log(this.orderdt[dp].jenis);

    }
    console.log(dt_bar);
    console.log(dt_dapur);


    let tgl_transaki = new Date();
    let tlg_now = tgl_transaki.getDate().toString() + ' ' +
                  this.monthNames[tgl_transaki.getMonth().toString()] +' ' +
                  tgl_transaki.getFullYear().toString() + ' / ' +
                  tgl_transaki.getHours().toString() + ':' +
                  tgl_transaki.getMinutes().toString() ;

    window.localStorage.setItem('pembayaran',JSON.stringify(pembayaran));
    window.localStorage.setItem('orderdt',JSON.stringify(this.orderdt));
    window.localStorage.setItem('order_bar',JSON.stringify(dt_bar));
    window.localStorage.setItem('order_dapur',JSON.stringify(dt_dapur));
    window.localStorage.setItem('meja', this.meja.toString());
    window.localStorage.setItem('invoice_id', this.order_id.toString());
    window.localStorage.setItem('tgl_order', tlg_now);

    if(this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('print-diam' , window.localStorage.getItem('print_kasir'));
      if(dt_dapur.length >= 1 ){
        this._electronService.ipcRenderer.send('print-diam-dapur' , window.localStorage.getItem('print_dapur') , dt_dapur);
      }

      if(dt_bar.length >= 1 ){
        this._electronService.ipcRenderer.send('print-diam-bar' , window.localStorage.getItem('print_bar'), dt_bar);
      }
    }
  }

  printOrderTanpaBayar(){

      let pembayaran = {
        subtotal : this.totalorder ,
        discount : this.discount ,
        ppn : this.ppn ,
        total : this.totalPlusPPN ,
        bayar : this.bayar ,
        kembali : this.kembalian
      }

      let dt_dapur = new Array();
      let dt_bar = new Array();

      for( let dp in this.orderdt){

        if(this.orderdt[dp].jenis == 1 ){
          dt_dapur.push(this.orderdt[dp]);
        }

        if(this.orderdt[dp].jenis == 2){
          dt_bar.push(this.orderdt[dp]);
        }

      }

      console.log(dt_bar);
      console.log(dt_dapur);

      let tgl_transaki = new Date();
      let tlg_now = tgl_transaki.getDate().toString() + ' ' +
                    this.monthNames[tgl_transaki.getMonth().toString()] +' ' +
                    tgl_transaki.getFullYear().toString() + ' / ' +
                    tgl_transaki.getHours().toString() + ':' +
                    tgl_transaki.getMinutes().toString() ;

      window.localStorage.setItem('pembayaran',JSON.stringify(pembayaran));
      window.localStorage.setItem('orderdt',JSON.stringify(this.orderdt));
      window.localStorage.setItem('order_bar',JSON.stringify(dt_bar));
      window.localStorage.setItem('order_dapur',JSON.stringify(dt_dapur));
      window.localStorage.setItem('meja', this.meja.toString());
      window.localStorage.setItem('invoice_id', this.order_id.toString());
      window.localStorage.setItem('tgl_order', tlg_now);

    if(this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('print-diam' , window.localStorage.getItem('print_kasir') );
      this._electronService.ipcRenderer.send('print-diam-dua' , window.localStorage.getItem('print_kasir'));

      if(dt_dapur.length >= 1 ){
        this._electronService.ipcRenderer.send('print-diam-dapur' , window.localStorage.getItem('print_dapur') , dt_dapur);
      }

      if(dt_bar.length >= 1 ){
        this._electronService.ipcRenderer.send('print-diam-bar' , window.localStorage.getItem('print_bar') , dt_bar );
      }
    }
  }

}
