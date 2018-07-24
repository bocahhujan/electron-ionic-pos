import { Component } from '@angular/core';
import { NavController , NavParams  , ViewController} from 'ionic-angular';

@Component({
  selector: 'page-update-order',
  templateUrl: 'update-order.html',
})
export class UpdateOrder {
  dt : any ;
  constructor(public navCtrl: NavController, public navParams: NavParams , public viewCtrl: ViewController) {
    this.dt = this.navParams.get('detail');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateOrder');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  hapusOrder(){
    let dl = {
      action : 'delete' ,
      data : this.dt
    }

    this.viewCtrl.dismiss(dl);
  }

  updateOrder() {
    let dl = {
      action : 'update' ,
      data : this.dt
    }
    console.log(dl);
    this.viewCtrl.dismiss(dl);
  }
}
