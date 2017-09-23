import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController  } from 'ionic-angular';
import { Events } from 'ionic-angular';

@Injectable()
export class AppService {
    private userId;
    private userName;
    private baseUrl;
    public cartCount;
    public openPage;
    public myApp;
    constructor(private http: Http, public loadingCtrl: LoadingController, public events : Events){
        this.userId = -1;
        this.baseUrl = "http://crackersapp.us-east-2.elasticbeanstalk.com";
    }
    getUserId(){
        return this.userId;
    }
    setUserId(userId){
        if(!userId){
            this.userId = -1;    
        }
        else{
            this.userId = userId;
            this.getCartItems();
        }
    }
    getUserName(){
        return this.userName;
    }
    setUserName(userName){
        this.userName = userName;        
    }
    getBaseUrl(){
        return this.baseUrl;
    }
    setBaseUrl(baseUrl){
        this.baseUrl = baseUrl;
    }
    getCartCount(){
        return this.cartCount;
    }
    setCartCount(count){
        this.cartCount = count;
    }
    getCartItems(){
        var request = {
            uid: this.getUserId()
        };
        var serviceUrl = this.getBaseUrl()+"/store/getCartItems";
        var thisObservable = this.http.post(serviceUrl,request)
            .map(res => res.json());

        thisObservable.subscribe(res => {
            if(res.response===200){
                if(res.data && res.data.products && Array.isArray(res.data.products)){
                    this.setCartCount(res.data.products.length);
                }
            }else{

            }    
        });
        return thisObservable;
    }
    redirectToShoppingCartPage(){
        this.openPage.call(this.myApp,"shoppingCartPage");
    }
    getLoadingRef(){
        return {
            present : (() => {
                this.events.publish("showLoading",true);
            }),        
            dismiss : (() => {
                this.events.publish("showLoading",false);
            })
        };        
    }
    getToastSettings(){
        return {
            duration: 1500,
            showCloseButton: false,
            closeButtonText : "x",
            position: "bottom"
        }
    }
    getLoadingRefIonic() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            dismissOnPageChange: true,
            content: `
                    <div class="app-loading">
                        <main>
                            <div class="dank-ass-loader">
                              <div class="row">
                                 <div class="arrow up outer outer-18"></div>
                                 <div class="arrow down outer outer-17"></div>
                                 <div class="arrow up outer outer-16"></div>
                                 <div class="arrow down outer outer-15"></div>
                                 <div class="arrow up outer outer-14"></div>
                              </div>
                              <div class="row">
                                 <div class="arrow up outer outer-1"></div>
                                 <div class="arrow down outer outer-2"></div>
                                 <div class="arrow up inner inner-6"></div>
                                 <div class="arrow down inner inner-5"></div>
                                 <div class="arrow up inner inner-4"></div>
                                 <div class="arrow down outer outer-13"></div>
                                 <div class="arrow up outer outer-12"></div>
                              </div>
                              <div class="row">
                                 <div class="arrow down outer outer-3"></div>
                                 <div class="arrow up outer outer-4"></div>
                                 <div class="arrow down inner inner-1"></div>
                                 <div class="arrow up inner inner-2"></div>
                                 <div class="arrow down inner inner-3"></div>
                                 <div class="arrow up outer outer-11"></div>
                                 <div class="arrow down outer outer-10"></div>
                              </div>
                              <div class="row">
                                 <div class="arrow down outer outer-5"></div>
                                 <div class="arrow up outer outer-6"></div>
                                 <div class="arrow down outer outer-7"></div>
                                 <div class="arrow up outer outer-8"></div>
                                 <div class="arrow down outer outer-9"></div>
                              </div>
                            </div>
                        </main>
                    </div>
                `
            });

        /*loading.onDidDismiss(() => {
            console.log('Dismissed loading');
        });*/

        return loading;
    }
}