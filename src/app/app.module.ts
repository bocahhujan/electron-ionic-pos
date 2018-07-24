import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Detail } from '../pages/detail/detail';
import { Setting } from '../pages/setting/setting';
import { UpdateOrder } from '../pages/update-order/update-order';
import { Table } from '../pages/table/table';
import { LoginPage } from '../pages/login/login';
import { TableHistoryPage } from '../pages/table-history/table-history';
import { LoginModelPage } from '../pages/login-model/login-model';
import { NgxElectronModule } from 'ngx-electron';
import { ModalPage } from '../pages/modal/modal'
import { NoteOrderPage } from '../pages/note-order/note-order';
import { CekTransaksiPage } from '../pages/cek-transaksi/cek-transaksi';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Detail ,
    Setting ,
    UpdateOrder ,
    Table ,
    LoginPage ,
    TableHistoryPage ,
    LoginModelPage ,
    ModalPage ,
    NoteOrderPage ,
    CekTransaksiPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule ,
    NgxElectronModule ,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage ,
    Detail  ,
    Setting ,
    UpdateOrder ,
    Table ,
    LoginPage ,
    TableHistoryPage ,
    LoginModelPage ,
    ModalPage ,
    NoteOrderPage ,
    CekTransaksiPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
