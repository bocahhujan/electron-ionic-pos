import { HttpClient  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiPost provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class ApiPost {

  loading : any ;
  constructor(public http: HttpClient , public loadingCtrl : LoadingController) {
    console.log('Hello ApiPost Provider');
  }

  loadingshow(){
    this.loading = this.loadingCtrl.create({
             content: 'Loading Proses ',
             cssClass : 'loadingdiv'
    });
    this.loading.present();
  }

  get(url , load = '' ){
    if(load == ''){
      this.loadingshow();
    }

    return new Promise((resolve, reject) => {
      this.http.get('http://'+window.localStorage.getItem('server_url')+'/api/'+url)
        .subscribe(res => {
          resolve(res);
          if(load == ''){
            this.loading.dismissAll();
          }
        }, (err) => {
          reject(err);
          if(load == ''){
            this.loading.dismissAll();
          }
        });
    });
  }

  post( url , post , load = ''){
    if(load == ''){
      this.loadingshow();
    }
    return new Promise((resolve, reject) => {
      this.http.post('http://'+window.localStorage.getItem('server_url')+'/api/'+url , post , { headers: { 'Content-Type': 'application/json' } })
        .subscribe(res => {
          resolve(res);
          if(load == ''){
            this.loading.dismissAll();
          }
        }, (err) => {
          reject(err);
          if(load == ''){
            this.loading.dismissAll();
          }
        });
    });

  }

  getKategori() {
    return this.get('kategori' , 'fa');
  }

  getProduk(){
    return this.get('produk');
  }

  getProdukbycat(id){

      var post = {
        id : id
      }

      return this.post('produk/kategori' , post );
  }

  caribarang(cari){

      var post = {
        search : cari
      }

      return this.post('produk/search' , post );
  }

  submitorder(dt , meja , status = 0  , discount , ppn , bayar ){
    var post = {
      ruang : meja ,
      dt : dt ,
      user_id : window.localStorage.getItem('id_user') ,
      status : status ,
      discount : discount ,
      ppn : ppn ,
      bayar : bayar
    }

    return this.post('order/add' , post );
  }

  loginPage(dt){
    var post = {
      username : dt.username ,
      password : dt.password
    }

    return this.post('login' , post );
  }

  mejaBelomBayar(){
    return this.get('order/get_order_belum_bayar' , 'false' )
  }

  getOrderBelomBayar(order_id){
    var post = {
      order_id : order_id
    }

    return this.post('order/detail' , post );
  }

  updateOrder( id , bayar , status ){
    var post = {
      id : id ,
      bayar : bayar ,
      status : status
    }

    return this.post('order/update' , post );
  }

  updateOrderDetail(dt , meja , id){
    var post = {
      ruang : meja ,
      dt : dt ,
      order_id : id
    }

    return this.post('order/update_detail' , post );
  }

  getListHistoryOrder(){
    return this.get('order/transaksi_list');
  }

  add_in_out(dt){
    var post = {
      id : localStorage.getItem('id_user') ,
      type : dt.type ,
      nilai : dt.nilai ,
      ket : dt.ket
    }
    return this.post('order/in_out' , post );
  }

  cek_transaksi( start , end){
    var post = {
      id : localStorage.getItem('id_user') ,
      start : start ,
      end : end
    }
    return this.post('order/cek_transaksi' , post );
  }

  go_refund(barang_id , order_id , qty){
    var post = {
      barang_id : barang_id ,
      order_id : order_id ,
      qty : qty
    }
    return this.post('order/refund' , post);
  }

  go_refund_order(order_id){
    var post = {
      order_id : order_id ,
    }
    return this.post('order/refund_order' , post);
  }

}
