import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import {Http} from '@angular/http';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { AppService } from "../../app/app.service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
    public mobileNo = null;
    public pwd = null;
    public confirmPwd = null;
    public confirmPwdShow = false;

	@ViewChild(Content) content: Content;
  	scrollToTop() {
    	this.content.scrollToTop();
  	}
  	constructor(private http: Http, public events : Events, private toastCtrl: ToastController, public appService : AppService) {
  		this.mobileNo = "9994055593";
  	}

    pwdValidationError(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {

      });

      toast.present();
    }

  	loginAction(){
        if(!this.mobileNo || !this.pwd){// || !this.confirmPwd || ){
            this.pwdValidationError("Please enter the mandatory fields");
            return;
        }
        /*if(this.pwd!==this.confirmPwd){
            this.pwdValidationError("Password and Confirm Password don't match");
            return;
        }*/
      var serviceUrl = this.appService.getBaseUrl()+"/user/login";
  		var request = {
            data: this.mobileNo,
            password: this.pwd
        };
		this.http
		  	.post(serviceUrl, request)
		  	.map(res => res.json())
		  	.subscribe(res => {
		  		if(res.response===200){
            this.appService.setUserId(res.data.id);
		  			this.events.publish('logIn',true,res.data.id);
		  		}else{
            this.pwdValidationError("Invalid Login credentials");
		  			this.events.publish('logIn',false, null);
		  		}
		  		console.info("response",res);
		  	});
  	}

}
