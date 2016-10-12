import { bootstrap }    from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component'
import {HTTP_PROVIDERS} from '@angular/http'
import {provide} from '@angular/core';
import {ROUTER_PROVIDERS} from '@angular/router';

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS]
);
