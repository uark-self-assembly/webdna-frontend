import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../services/user/user';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'register-cmp',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
    test: Date = new Date();
    user: User = new User();
    password_confirmation: String;

    constructor(
        private router: Router,
        private userService: UserService){

    }

    checkFullPageBackgroundImage() {
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if (image_src !== undefined) {
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    ngOnInit() {
        this.checkFullPageBackgroundImage();

        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }

    register() {

        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");

        if (this.user.first_name == null || this.user.last_name == null || this.user.username == null || 
        this.user.email == null || this.user.password == null)
        {
            alert("One or all fields are empty. Please finish filling out the form.")
            console.log("One or all fields are empty. Please finish filling out the form.")
        }else{
             // Validate Register Form and Create Database entry
            if (this.user.password == this.password_confirmation) {
                if (strongRegex.test(this.user.password)) {
                    this.userService.registerUser(this.user).then(data => {
                        if (data) {
                            this.router.navigate(['dashboard']);
                        } else {
                            // Add a visual alert here that pops up
                            alert("User already exists")
                            console.log("User already exists")
                        }
                    });
                } else {
                    // Add a visual alert here that pops up
                    alert("Password must be at least 8 characters with at least one [A-Z], [a-z], [0-9]")
                    console.log("Password must be at least 8 characters with at least one [A-Z], [a-z], [0-9]")
                }
            } else {
                // Add a visual alert here that pops up
                alert("Passwords don't match")
                console.log("Passwords don't match")
            }
        }
    }

    existing() {
        // Navigate to login page
        this.router.navigate(['login']);
    }
}
