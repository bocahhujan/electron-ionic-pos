import { Component } from '@angular/core';
import { NavParams , ViewController } from 'ionic-angular';


@Component({
  selector: 'page-note-order',
  templateUrl: 'note-order.html',
})
export class NoteOrderPage {
  dt : any ;
  jadi = {
    'barang_id' : "",
    'qty' : ""
    }
  constructor( public viewCtrl : ViewController , public navParams: NavParams) {
    this.dt = this.navParams.get('barang');
    this.jadi.qty = this.dt.qty;
    this.jadi.barang_id = this.dt.barang_id;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteOrderPage');
  }

  simpanNote(){
    if(this.dt.qty >= 1 ){
      this.viewCtrl.dismiss(this.jadi);
    }else{
      alert('Qty Tidak Boleh kurang dari 1 !');
    }

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
