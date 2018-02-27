import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/auth-guard/auth.service';

declare var $:any;

@Component({
  moduleId:module.id,
  selector: 'login-cmp',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit{
  test : Date = new Date();
  loading = false;
  username: String;
  password: String;
  responseOk = true;
  responseMessage = '';

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService) {

  }

  checkFullPageBackgroundImage(){
    var $page = $('.full-page');
    var image_src = $page.data('image');

    if(image_src !== undefined) {
      var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
      $page.append(image_container);
    }
  }

  ngOnInit(){
    this.checkFullPageBackgroundImage();

    setTimeout(function(){
      // after 1000 ms we add the class animated to the login/register card
      $('.card').removeClass('card-hidden');
    }, 700)
  }

  login() {
    console.log("logging in");
    this.loading = true;
    this.responseMessage = '';
    this.responseOk = true;
    const user = {
      username: this.username,
      password: this.password
    };

    this.authenticationService.authenticateUser(user).then(data => {
      if (data.message) {
        this.responseOk = true;
        this.loading = false;
        this.authenticationService.storeUserData(data.response.token, data.response.user);

        this.router.navigate(['dashboard']);
      } else {
        this.loading = false;
        this.responseOk = false;
        console.log('No user found with username "' + this.username + '".'); 
      }
    });
  }
};
