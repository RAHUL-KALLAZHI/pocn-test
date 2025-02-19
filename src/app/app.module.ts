import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { environment } from 'src/environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { GlobalErrorHandler } from './globalErrorHandler';

const twilioServerURL = environment.twilioServerURL;
const config: SocketIoConfig = { url: `${twilioServerURL}`, options: {} };

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, IonicModule.forRoot(), SocketIoModule.forRoot(config), GraphQLModule, AppRoutingModule],
    providers: [File, IOSFilePicker, MediaCapture, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: ErrorHandler, useClass: GlobalErrorHandler },],
    bootstrap: [AppComponent]
})
export class AppModule {}


