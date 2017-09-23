import { Component  } from '@angular/core';
import { NavController, ToastController  } from 'ionic-angular';
import { Http } from '@angular/http';
import { AppService } from "../../app/app.service";

@Component({
  	selector: 'order-history',
  	templateUrl: 'orders.html'
})
export class OrderHistoryPage {
	public list;
	public totalOrdersCount;
	public loadingRef;

	constructor(public navCtrl: NavController, private http: Http, public appService: AppService, private toastCtrl: ToastController) {
		this.list = [];
		this.loadingRef = this.appService.getLoadingRef();
		this.fetchData();
	}

	ngAfterViewInit() {
		/*for (var i=0;i<5;i++){
			this.list.push({id:i,cartQuantity:i+1});
		}*/
	}

  	fetchData(){
  		this.loadingRef.present();
		var request = {
			uid: this.appService.getUserId(),
			offet:0,
			count:2000
		};
		var serviceUrl = this.appService.getBaseUrl()+"/store/getOrdersList";
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					console.info("response",res);
					this.list = (res.data && res.data.orders) ? res.data.orders : [];  
					this.list.forEach(item => {
						item.orderStatusText = this.getOrderStatusText(item.status);
					});
					this.totalOrdersCount = res.data.totalOrdersCount;
				}else{

				}
				setTimeout(() => {
				  	this.loadingRef.dismiss();
				}, 1000);
			});
  	}

  	showLessDetails(order){
  		order.viewMoreDetails = false;
  	}

  	showMoreDetails(order){
  		order.viewMoreDetails = true;
  		var request = {
			uid: this.appService.getUserId(),
			orderId: order.orderId
		};
		var serviceUrl = this.appService.getBaseUrl()+"/store/getOrderDetail";
		order.loading = true;
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					console.info("response",res);
					order.details = res.data;
				}else{

				}
				order.loading = false;
			});
  	}

  	cancelOrder(order){
  		var request = {
			uid: this.appService.getUserId(),
			orderId: order.orderId
		};
		var serviceUrl = this.appService.getBaseUrl()+"/store/cancelOrder";
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					this.fetchData();
					this.presentToast("Order #"+ order.orderId+" has been cancelled");
				}else{

				}
			});
	  }
	  
	getOrderStatusText(orderStatusId){
		switch(orderStatusId){
			case 1:
				return "DELIVERED";
			case 2:
				return "IN TRANSIT";
			case 3:
				return "OUT_FOR_DELIVERY";
			case 4:
				return "ORDER_PLACED";
			case 5:
				return "PENDING";
			case 6:
				return "CANCELLED";
			case 7:
				return "FAILED";
			case 8:
				return "ADMIN_CANCELLED";
		}
	}

  	presentToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: this.appService.getToastSettings().duration,
			showCloseButton: this.appService.getToastSettings().showCloseButton,
			closeButtonText : this.appService.getToastSettings().closeButtonText,
			position: this.appService.getToastSettings().position
		});

		/*toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});*/

		toast.present();
	}
	

}
