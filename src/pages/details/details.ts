import { Component, ViewChild  } from '@angular/core';
import { NavParams, Slides, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';

import { AppService } from "../../app/app.service";

@Component({
  	selector: 'page-details',
  	templateUrl: 'details.html'
})
export class DetailsPage {
	@ViewChild(Slides) slides: Slides;
	public isInWishList;
	public isInCart;
	public cartQuantity;
	public ratingByUser=0;
	public reviewTextByUser;
	public reviewList;
	public productDetail;
	public pageLoading;
	public productImages;
	public description;
	public discountPercentage;
	public netPrice;
	public price;
	public isStockAvailable;
	public loadingRef;
	public self;
	public dtlsSlider;
	public showDtlsSlider;
	public averageReview

	constructor(private http: Http, public navParams: NavParams, private toastCtrl: ToastController, public appService : AppService) {
		this.reviewList = this.getReviewList();
		this.pageLoading = true;
		this.loadingRef = this.appService.getLoadingRef();
		this.self = this;
	}

	ionViewWillEnter(){
		this.showDtlsSlider = true;
	}

	ionViewDidLeave(){
		this.showDtlsSlider = false;
	}

	ngAfterViewInit() {
		var that = this;
		this.productDetail = Object.assign({}, this.navParams.data);
		for(var prop in this.productDetail){
			if(this.productDetail.hasOwnProperty(prop)){
				this[prop] = this.productDetail[prop];
			}
		}
		that.fetchData();
	}

	goToSlide() {
		this.slides.slideTo(2, 500);
	}

	slideChanged() {
		let currentIndex = this.slides.getActiveIndex();
		console.log('Current index is', currentIndex);
	}

	initCarouselSlide(){
		this.dtlsSlider = new Swiper ('.swiper-container', {
			direction: 'horizontal',
			//loop: true,		
			pagination: '.swiper-pagination',		
			// nextButton: '.swiper-button-next',
			// prevButton: '.swiper-button-prev',
			// autoplay : 2000,
			// speed : 750,			
			// effect : 'cube',
			// initialSlide : 0,
			// //autoHeight : true,
			//paginationClickable : true
		  });        	
		  console.info("productImages",this.productImages);
	}

	setRating(starValue){
		this.ratingByUser = starValue;
	}

	submitReview(){
		var serviceUrl = this.appService.getBaseUrl()+"/store/addReview";
		var request = {
			"uid" : Number(this.appService.getUserId()),
			"productId": this.productDetail.id,
			"reviewText":this.reviewTextByUser,
			"rating":this.ratingByUser
		};
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					this.presentToast("Review submitted successfully");
					this.fetchData();
				}else{

				}
			});
	}

	getReviewList(){
		return [
			{
				fullName : "Shyam Sundar N",
				ratingByUser : 2,
				description : "Love this product!!"
			},
			{
				fullName : "Shyam Sundar PAN",
				ratingByUser : 5,
				description : "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet."
			},
			{
				fullName : "Shyam Sundar Natarajan",
				ratingByUser : 4,
				description : "Love this product!!"
			}
		]
	}

  	fetchData(){
  		this.loadingRef.present();
		var serviceUrl = this.appService.getBaseUrl()+"/store/getProductDetail";
		var request = {
			"uid" : Number(this.appService.getUserId()),
			"productId": this.productDetail.id
		};
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					this.processDetailsPageData(res.data);
				}else{

				}
				this.pageLoading = false;
			});
  	}

  	processDetailsPageData(data){
  		console.info("response",data);
  		for(var i=0;i<5;i++){
  			var obj = {
				id : i+1,
  				imageUrl : data.images[0]
  			};
  			data.images.push(obj);
  		}
  		data.images.shift();
  		data.images.shift();
  		this.description = data.description;
		this.discountPercentage = data.discountPercentage;
		this.price = data.price;
		this.netPrice = data.netPrice;
		this.productImages = data.images;
		this.averageReview = data.averageReview;		  
  		this.initCarouselSlide();
  		this.isStockAvailable = data.isStockAvailable;
  		this.isInCart = data.isInCart;
  		(data.cartQuantity) ? this.cartQuantity = data.cartQuantity : function(){};
  		(data.isInWishList) ? this.isInWishList = data.isInWishList : function(){};
  		let timeoutId = setTimeout(() => {
		  	this.loadingRef.dismiss();
		}, 1000);
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
