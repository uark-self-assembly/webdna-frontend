import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth-guard/auth.service';
import { AlertService } from '../components/alert/alert.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'login-cmp',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  test: Date = new Date();
  loading = false;
  username: string;
  password: string;
  responseOk = true;
  responseMessage = '';

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService) { }

  checkFullPageBackgroundImage() {
    const $page = $('.full-page');
    const image_src = $page.data('image');

    if (image_src !== undefined) {
      const image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
      $page.append(image_container);
    }
  }

  ngOnInit() {
    this.checkFullPageBackgroundImage();

    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      $('.card').removeClass('card-hidden');
    }, 700)
  }

  login() {
    this.loading = true;
    this.responseMessage = '';
    this.responseOk = true;

    this.authenticationService.authenticateUser(this.username, this.password).then(response => {
      if (typeof response === 'string') {
        this.loading = false;
        this.responseOk = false;

        console.log(response);

        // TODO (jace) Add a visual alert here that pops up, currently the server is providing the error

        console.log('No user found with username: ' + this.username);
      } else {
        this.responseOk = true;
        this.loading = false;
        this.router.navigate(['dashboard']);
      }
    }, error => {
      this.alertService.error('Invalid login');
    });
  }
};
