import { Component } from '@angular/core';
import { NavController, NavParams , ModalController } from 'ionic-angular';
import { ApiPost } from '../../providers/api-post';
import { LoginModelPage } from '../login-model/login-model';
import { ElectronService } from 'ngx-electron';


@Component({
  selector: 'page-table-history',
  templateUrl: 'table-history.html' ,
  providers : [ApiPost]
})
export class TableHistoryPage {
  order : any ;
  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              private _electronService: ElectronService  ,
              public modalCtrl : ModalController ,
              public apiPost : ApiPost) {
    this.getListOrder();
    console.log(this.order);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TableHistoryPage');
  }

  getListOrder(){
    this.apiPost.getListHistoryOrder()
        .then( data => {
          let dt : any = data ;
          this.order = dt.order;
        })
  }

  printNota(id){
    if(window.localStorage.getItem('akses') == 'admin'){
      this.goPrint(id);
    }else{
      let loginmodel = this.modalCtrl.create( LoginModelPage );
      loginmodel.present();
      loginmodel.onDidDismiss(data => {
        if(data){
          this.goPrint(id);
        }else{
          alert('Maaf anda Tidak memiliki akses');
        }

      });
    }
  }

  goPrint(id){
    this.apiPost.getOrderBelomBayar(id)
        .then( data => {
          let dt : any = data ;
          let orderDetail : any = dt.detail ;
          let order : any = dt.order ;
          const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
          console.log(order);
          console.log(orderDetail);
          let pembayaran = {
            subtotal : order.total ,
            discount : order.discount ,
            ppn : order.ppn ,
            total : parseInt(order.total) + parseInt(order.ppn),
            bayar : order.uang_diterima ,
            kembali :parseInt(order.uang_diterima) - ( parseInt(order.total) + parseInt(order.ppn) )
          }

          let tgl_transaki = new Date(order.tanggal_transaksi);
          let tlg_now = tgl_transaki.getDate().toString() + ' ' +
                        monthNames[tgl_transaki.getMonth().toString()] +' ' +
                        tgl_transaki.getFullYear().toString() + ' / ' +
                        tgl_transaki.getHours().toString() + ':' +
                        tgl_transaki.getMinutes().toString() ;

          window.localStorage.setItem('pembayaran',JSON.stringify(pembayaran));
          window.localStorage.setItem('orderdt',JSON.stringify(orderDetail));
          window.localStorage.setItem('meja', order.ruang);
          window.localStorage.setItem('invoice_id', order.transaksi_id);
          window.localStorage.setItem('tgl_order', tlg_now);
          console.log(localStorage.getItem('tgl_order'));
          if(this._electronService.isElectronApp) {
            this._electronService.ipcRenderer.send('print-diam' , window.localStorage.getItem('print_kasir'));
          }
        });
  }

}
