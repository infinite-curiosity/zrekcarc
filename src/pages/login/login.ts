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
    public loginObj;
    public signupObj;
    public viewSignup = false;
    
	@ViewChild(Content) content: Content;
  	scrollToTop() {
    	this.content.scrollToTop();
  	}
  	constructor(private http: Http, public events : Events, private toastCtrl: ToastController, public appService : AppService) {      
      this.loginObj = this.createLoginObj();
      this.signupObj = this.createSignupObj();
      this.loginObj.mobileNo = "9994055593";      
    }
    
    createLoginObj(){
      return {
        mobileNo : null,
        pwd : null        
      };
    }

    createSignupObj(){
      return {
        name : null,
        mobileNo : null,
        email : null,
        pwd : null,
        confirmPwd : null
      };
    }
    showSignup(){
      this.signupObj = this.createSignupObj();
      this.viewSignup = true;
    }

    showLogin(){      
      this.loginObj = this.createLoginObj();
      this.viewSignup = false;
    }

    skipLogin(){
      this.events.publish('logIn',true, null);
    }

  	loginAction(){      
      var serviceUrl = this.appService.getBaseUrl()+"/user/login";
  		var request = {
            data: this.loginObj.mobileNo,
            password: this.loginObj.pwd
        };
		this.http
		  	.post(serviceUrl, request)
		  	.map(res => res.json())
		  	.subscribe(res => {
		  		if(res.response===200){            
            this.events.publish('logIn',true,res.data.id,res.data.name);
            this.presentToast("Welcome "+res.data.name+" !!");
		  		}else{
            this.presentToast("Invalid Login credentials");
		  			this.events.publish('logIn',false, null, null);
		  		}
		  	});
    }

    signupAction(){
      if(this.signupObj.pwd != this.signupObj.pwd){
        this.presentToast("Password and confirm password do not match");
        return;
      }
      var serviceUrl = this.appService.getBaseUrl()+"/user/login";
  		var request = {
            data: this.loginObj.mobileNo,
            password: this.loginObj.pwd
        };
		  this.http
		  	.post(serviceUrl, request)
		  	.map(res => res.json())
		  	.subscribe(res => {
		  		if(res.response===200){            
            this.events.publish('logIn',true,res.data.id,res.data.name);
            this.presentToast("Welcome "+res.data.name+" !!");
		  		}else{
            this.presentToast("Invalid Login credentials");
		  			this.events.publish('logIn',false, null, null);
		  		}
		  	});
    }
    
    disableLogin(){      
      var valid = Boolean(this.loginObj.mobileNo) && Boolean(this.loginObj.pwd);
      return !valid;
    }

    disableSignup(){
      var valid = Boolean(this.signupObj.name) && Boolean(this.signupObj.mobileNo) && Boolean(this.signupObj.email) 
                  && Boolean(this.signupObj.pwd) && Boolean(this.signupObj.confirmPwd);
      return !valid;
    }

    presentToast(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {

      });

      toast.present();
    }


}
