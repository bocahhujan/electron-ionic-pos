import { Component } from '@angular/core';
import { NavController , ModalController} from 'ionic-angular';
import { ApiPost } from '../../providers/api-post';
import { HomePage } from '../home/home';
import { Detail } from '../detail/detail';

@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
  providers : [ApiPost]
})
export class Table {
  meja = Number(window.localStorage.getItem('ruang'));
  jumlah = new Array();
  task : any ;
  aktif = new Array();
  constructor(public navCtrl: NavController ,
              public modalCtrl : ModalController ,
              public apiPost : ApiPost
            ) {

    this.ambilMeja();
    console.log(this.jumlah);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Table');
  }

  goOrder(mj){
    /*let order = this.modalCtrl.create(HomePage , { meja : mj });
    order.present();*/
    if(mj.status == 0 ){
      this.navCtrl.push(HomePage , { meja : mj.num , status : 0 });
    }else{
      this.apiPost.getOrderBelomBayar(mj.status)
          .then( data => {
            let dt : any = data ;
            let orderDetail : any = dt.detail ;
            let order : any = dt.order ;

            this.navCtrl.push(Detail , { order : order , detail : orderDetail });
          });
    }


  }

  getDataMeja(){
    console.log('ambil data');
    this.apiPost.mejaBelomBayar()
        .then( data => {
          let dt : any = data ;
          let dt_a : any = dt.data;

            console.log(dt_a);
            this.jumlah = new Array();
            this.ambilMeja();
            for (let val  in dt_a) {

                let num = dt_a[val].ruang - 1;
                this.jumlah[num]['status'] = dt_a[val].transaksi_id;
                console.log(this.jumlah);
            }


        });
  }

  ambilMeja(){
    let num = 1;
    while ( this.meja >=  num ) {
      let dtin = {
          num : num ,
          status : 0 ,
      }

      this.jumlah.push(dtin) ;
      //console.log(num);
      num += 1;
    }
  }

  boxclassmeja(status){
    if (status == 0){
      return 'boxproduk'
    }else{
      return 'boxprodukred'
    }
  }

    ionViewWillLeave() {
       clearInterval(this.task);
     }

     ionViewDidEnter(){
       console.log('aktif lagi');
       let self = this
       this.task = setInterval(function () {
         self.getDataMeja();
       }, 2000);
     }

}
