import { Component } from '@angular/core';
import { NavParams , ViewController } from 'ionic-angular';


@Component({
  selector: 'page-note-order',
  templateUrl: 'note-order.html',
})
export class NoteOrderPage {
  dt : any ;
  constructor( public viewCtrl : ViewController , public navParams: NavParams) {
    this.dt = this.navParams.get('barang');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteOrderPage');
  }

  simpanNote(){
    if(this.dt.qty >= 1 ){
      this.viewCtrl.dismiss(this.dt);
    }else{
      alert('Qty Tidak Boleh kurang dari 1 !');
    }

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
