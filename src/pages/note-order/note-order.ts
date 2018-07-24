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
    this.viewCtrl.dismiss(this.dt);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
