import { Component } from '@angular/core';

declare var $:any;
declare var swal:any;

@Component({
    moduleId: module.id,
    selector: 'sweetalert-cmp',
    templateUrl: 'sweetalert.component.html'
})

export class SweetAlertComponent{

    showSwal(type){
        if(type == 'basic'){
        	swal("Here's a message!");

    	}else if(type == 'title-and-text'){
        	swal("Here's a message!", "It's pretty, isn't it?")

    	}else if(type == 'success-message'){
        	swal("Good job!", "You clicked the button!", "success")

    	}else if(type == 'warning-message-and-confirmation'){
        	swal({  title: "Are you sure?",
            	    text: "You will not be able to recover this imaginary file!",
            	    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn btn-info btn-fill",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonClass: "btn btn-danger btn-fill",
                    closeOnConfirm: false,
                },function(){
                    swal("Deleted!", "Your imaginary file has been deleted.", "success");
                });

    	}else if(type == 'warning-message-and-cancel'){
        	swal({  title: "Are you sure?",
            	    text: "You will not be able to recover this imaginary file!",
            	    type: "warning",
            	    showCancelButton: true,
            	    confirmButtonText: "Yes, delete it!",
            	    cancelButtonText: "No, cancel plx!",
            	    closeOnConfirm: false,
            	    closeOnCancel: false
                },function(isConfirm){
                    if (isConfirm){
                        swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    }else{
                        swal("Cancelled", "Your imaginary file is safe :)", "error");
                    }
                });

    	}else if(type == 'custom-html'){
        	swal({  title: 'HTML example',
                    html:
                        'You can use <b>bold text</b>, ' +
                        '<a href="http://github.com">links</a> ' +
                        'and other HTML tags'
                });

    	}else if(type == 'auto-close'){
        	swal({ title: "Auto close alert!",
            	   text: "I will close in 2 seconds.",
            	   timer: 2000,
            	   showConfirmButton: false
                });
    	} else if(type == 'input-field'){
            swal({
                  title: 'Input something',
                  html: '<p><input id="input-field" class="form-control">',
                  showCancelButton: true,
                  closeOnConfirm: false,
                  allowOutsideClick: false
                },
                function() {
                  swal({
                    html:
                      'You entered: <strong>' +
                      $('#input-field').val() +
                      '</strong>'
                  });
                })
        }
    }
}
