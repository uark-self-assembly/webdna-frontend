import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../services/user/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RegisterSuccessDialogComponent } from './register-success-dialog/register-success-dialog.component';


@Component({
    moduleId: module.id,
    selector: 'register-cmp',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    // TODO (jace) implement password validation
    // private passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})';

    registration: FormGroup;

    constructor(
        private router: Router,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private dialog: MatDialog) {

        this.registration = formBuilder.group({
            'firstName': ['', Validators.required],
            'lastName': ['', Validators.required],
            'username': ['', Validators.required],
            'email': ['', [Validators.required, Validators.email]],
            'password': ['', Validators.required],
            'confirmPassword': ['', Validators.required]
        });
    }

    showSnackBar(message: string, duration: number = 2000) {
        this.snackBar.open(message, null, {
            duration: duration
        });
    }

    showSuccessDialog() {
        const dialogRef = this.dialog.open(RegisterSuccessDialogComponent, {

        });

        dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['login']);
        });
    }

    registerClicked() {
        if (!this.registration.valid) {
            // TODO (jace) better UI error handling
            this.showSnackBar('Please fill all fields properly', 3000);
            return;
        }

        const firstName = this.registration.value['firstName'];
        const lastName = this.registration.value['lastName'];
        const username = this.registration.value['username'];
        const email = this.registration.value['email'];
        const password = this.registration.value['password'];
        const confirmPassword = this.registration.value['confirmPassword'];

        if (password !== confirmPassword) {
            this.snackBar.open('These passwords don\'t match');
            return;
        }

        const newUser = new User();
        newUser.first_name = firstName;
        newUser.last_name = lastName;
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;

        this.userService.registerUser(newUser).then(response => {
            if (response) {
                this.showSuccessDialog();
            } else {
                // TODO (jace) show more specific error messages
                this.showSnackBar('Invalid registration');
            }
        });
    }

    existing() {
        this.router.navigate(['login']);
    }
}
