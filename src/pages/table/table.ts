import { Component } from '@angular/core';
import { NavController , ModalController , AlertController} from 'ionic-angular';
import { ApiPost } from '../../providers/api-post';
import { HomePage } from '../home/home';
import { Detail } from '../detail/detail';
import { ElectronService } from 'ngx-electron';

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
  status = "";
  klik = false;
  constructor(public navCtrl: NavController ,
              public modalCtrl : ModalController ,
              public alertCtrl: AlertController ,
              public apiPost : ApiPost ,
              private _electronService: ElectronService
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
    if(this.klik){

      if(mj.status == 0 ){
        //this.klik = false;
        this.navCtrl.push(HomePage , { meja : mj.num , status : 0 });
      }else{
        this.apiPost.getOrderBelomBayar(mj.status)
            .then( data => {
              let dt : any = data ;
              let orderDetail : any = dt.detail ;
              let order : any = dt.order ;
              this.klik = false;
              this.navCtrl.push(Detail , { order : order , detail : orderDetail });
            });
      }

      //this.klik = false;

    }else{
      let alert = this.alertCtrl.create({
        title: 'Proses Pengambilan data',
        subTitle: 'Harap Tunggu Setelah Proses Selesai',
        buttons: ['ok']
      });
      alert.present();
    }

  }

  getDataMeja(){
    console.log('ambil data');
    this.status = 'Mengambil Data Meja ';
    this.apiPost.mejaBelomBayar()
        .then( data => {
          let dt : any = data ;
          let dt_a : any = dt.data;
            //console.log(dt);
            if(this._electronService.isElectronApp) {
              this._electronService.ipcRenderer.send('simpan-order' , dt.data.length);
            }

            //console.log(dt_a);
            this.jumlah = new Array();
            this.ambilMeja();
            for (let val  in dt_a) {

                let num = dt_a[val].ruang - 1;
                this.jumlah[num]['status'] = dt_a[val].transaksi_id;
                console.log(this.jumlah);
            }

          this.status = "";
          this.klik = true;
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
       this.status = 'Mengambil data meja ke server ';
       let self = this
       this.task = setInterval(function () {
         self.getDataMeja();
       }, 2000);
     }

}
