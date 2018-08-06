import { Component } from '@angular/core';
import { NavController , ToastController} from 'ionic-angular';

import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class Setting {
  dt = {
    server_url : window.localStorage.getItem('server_url') ,
    ruang :  window.localStorage.getItem('ruang')
  };
  print : any ;
  print_dapur : any ;
  print_list : any ;
  print_bar : any ;

  constructor(public navCtrl: NavController , public toastCtrl: ToastController , private _electronService: ElectronService ) {
    this.getPrinters();
    this.print = window.localStorage.getItem('print_kasir');
    this.print_dapur = window.localStorage.getItem('print_dapur');
    this.print_bar = window.localStorage.getItem('print_bar');
  }

  ionViewDidLoad(){
    console.log('ionViewDidLoad Setting');
  }

  servData(){

    window.localStorage.setItem('server_url',this.dt.server_url);
    window.localStorage.setItem('ruang',this.dt.ruang);
    window.localStorage.setItem('print_kasir',this.print);
    window.localStorage.setItem('print_bar',this.print_bar);
    window.localStorage.setItem('print_dapur',this.print_dapur);

    if(this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('setting-seve' ,this.dt.server_url , this.dt.ruang , this.print , this.print_bar , this.print_dapur);
    }

    let toast = this.toastCtrl.create({
      message: 'Setting Tersimpan !',
      duration: 3000 ,
      position : 'middle'
    });

    toast.present();

  }

  getPrinters(){
    if(this._electronService.isElectronApp) {
      let win = this._electronService.remote.getCurrentWebContents();
      let print = win.getPrinters();
      this.print_list  = print ;
      console.log(this.print_list);
    }
  }

}
