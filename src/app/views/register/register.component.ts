import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../services/user/user';

declare var $:any;

@Component({
    moduleId:module.id,
    selector: 'register-cmp',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit{
    test : Date = new Date();
    user : User = new User();
    password_confirmation : String;

    constructor(
        private router:Router, 
        private userService:UserService){
        
    }

    checkFullPageBackgroundImage(){
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if(image_src !== undefined){
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    ngOnInit(){
        this.checkFullPageBackgroundImage();

        setTimeout(function(){
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }

    register(){
        // Validate Register Form and Create Database entry

    }

    existing(){
        // Navigate to login page
        this.router.navigate(['login']);
    }
}
