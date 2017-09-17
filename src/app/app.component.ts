import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events } from 'ionic-angular';

import { AppService } from "./app.service";

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ShowLoading } from '../pages/loading/loading';
import { ListingPage } from '../pages/listing/listing';
import { DetailsPage } from '../pages/details/details';
import { ShoppingCartPage } from '../pages/cart/cart';
import { OrderHistoryPage } from '../pages/orders/orders';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { CrackerItem } from '../pages/product/product';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  rootPage:any = HomePage;
  public hasLoggedIn = false;
  public showLoading = true;
  public userId = null;
  public myApp = this;
  constructor(appService: AppService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public events : Events) {
    platform.ready().then(() => {
        statusBar.styleDefault();
        splashScreen.hide();
        console.info("appService",appService);
        appService.openPage = this.openPage;
        appService.myApp = this.myApp;
        events.subscribe('logIn', (status, userId) => {
            this.hasLoggedIn = status;
            this.userId = userId;
        });
        events.subscribe('showLoading', (status) => {
          this.showLoading = status;
      });
    });
  }
  openPage(page){
    switch (page) {
       case "loginPage":
         this.nav.push(LoginPage);
        break;
      case "showLoading":
        this.nav.push(ShowLoading);
       break;
      case "homePage":
        this.nav.setRoot(HomePage);
        break;
      case "listingPage":
        this.nav.push(ListingPage);
        break;
      case "detailsPage":
        this.nav.push(DetailsPage);
        break;
       case "shoppingCartPage":
        this.nav.push(ShoppingCartPage);
        break;
      case "orderHistoryPage":
        this.nav.push(OrderHistoryPage);
        break;
      case "wishlistPage":
        this.nav.push(WishlistPage);
        break;
      case "signupPage":
         this.nav.push(LoginPage);
        break;

      default:
        this.nav.setRoot(HomePage);
        break;
    }
  }
}


