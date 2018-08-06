import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
//import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { ElectronService } from 'ngx-electron';

import { Setting } from '../pages/setting/setting';
import { Table } from '../pages/table/table';
import { LoginPage } from '../pages/login/login';
import { TableHistoryPage } from '../pages/table-history/table-history';
import { ModalPage } from '../pages/modal/modal';
import { CekTransaksiPage } from '../pages/cek-transaksi/cek-transaksi';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform , private _electronService: ElectronService ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      //splashScreen.hide();

    });

    if(this._electronService.isElectronApp) {
      //this._electronService.ipcRenderer.send('print-diam' , window.localStorage.getItem('print_kasir'));
      this._electronService.ipcRenderer.on('setting' , function ( event , server_url , ruang) {
        //console.log('data setting : '+ server_url + ruang);
        window.localStorage.setItem('ruang',ruang);
        window.localStorage.setItem('server_url',server_url);
      });

    };

    if ( Number(window.localStorage.getItem('ruang')) <= 1 ){
      window.localStorage.setItem('ruang','5');
    }



    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'ORDER', component: Table } ,
      { title: 'IN OR OUT', component: ModalPage } ,
      { title : 'RE PRINT' , component : TableHistoryPage } ,
      { title : 'TRANSAKSI' , component : CekTransaksiPage } ,
      { title: 'SETTING', component: Setting } ,
    ];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


}
