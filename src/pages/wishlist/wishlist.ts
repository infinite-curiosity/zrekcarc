import { Component, ViewChild  } from '@angular/core';
import { NavController, ToastController  } from 'ionic-angular';
import { Http } from '@angular/http';
import { CrackerItem } from '../product/product';
import { AppService } from "../../app/app.service";

@Component({
  	selector: 'my-wishlist',
  	templateUrl: 'wishlist.html'
})
export class WishlistPage {
	public list = [];
	public loadingRef;
	public loading;
	@ViewChild(CrackerItem) crackerItem: CrackerItem;

	constructor(public navCtrl: NavController, private http: Http, public appService : AppService, private toastCtrl: ToastController) {
		this.loadingRef = this.appService.getLoadingRef();
	}

	ngAfterContentInit() {
		this.fetchWishlist();
	}

	moveToCart(item){
		this.crackerItem.addToCart(item).subscribe((res) => {
			this.crackerItem.unsetAsFavWithoutToat(item).subscribe((res) => {				
				this.fetchWishlist();
				this.presentToast(item.productName + " has been moved to cart");
			});
		});
	}

	removeFromWishlist(item){
		this.crackerItem.unsetAsFav(item).subscribe((res) => {
			this.fetchWishlist();
		});
  	}

  	fetchWishlist(){
		  this.loadingRef.present();
		  this.loading = true;
		var serviceUrl = this.appService.getBaseUrl()+"/store/getWishlistItems";
		var request = {
			"uid" : Number(this.appService.getUserId())
		};
		this.http
			.post(serviceUrl, request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					this.list = res.data.products;
				}else{

				}
				let timeoutId = setTimeout(() => {
					  this.loadingRef.dismiss();
					  this.loading = false;
				}, 1000);
			});
	}
	  
	presentToast(msg) {
		let toast = this.toastCtrl.create({
		    message: msg,
		    duration: 2000,
		    showCloseButton: false,
		    position: 'top'
		});

		/*toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});*/

		toast.present();
	}

}
