import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth-guard/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';


@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loading = false;

    private login: FormGroup;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar) {

        this.login = formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required],
        });
    }

    showSnackBar(message: string, duration: number = 2000) {
        this.snackBar.open(message, null, {
            duration: duration
        });
    }

    loginClicked() {
        if (this.loading) {
            return;
        }

        if (!this.login.valid) {
            this.showSnackBar('Please fill all fields');
            return;
        }

        const username = this.login.value['username'];
        const password = this.login.value['password'];

        this.loading = true;

        this.authenticationService.authenticateUser(username, password).then(response => {
            this.loading = false;

            if (typeof response === 'string') {
                this.showSnackBar('Invalid login');
            } else {
                this.router.navigate(['dashboard']);
            }
        }, error => {
            this.loading = false;
            this.showSnackBar('Invalid login. Please try again', 4000);
        });
    }

    noAccount() {
        this.router.navigate(['register']);
    }
};
