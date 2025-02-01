import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials:any={
    username:'',
    password:''
  }

  sessionStorage : Storage=sessionStorage;

  constructor(private authService:AuthService, private router : Router, private emailService:EmailService) { 

  }

  ngOnInit(): void {

}

login(){
  this.authService.login(this.credentials).subscribe(
    (response)=>{
     if(response.status === true){
      console.log('User logged in successfully', response);
      this.sessionStorage.setItem('username',this.credentials.username)
      this.authService.makeLogin();
      this.emailService.getEmailfromUserName(this.credentials.username).subscribe(
        (emailResponse)=>{
          console.log('Email fetched successfully', emailResponse);
          this.sessionStorage.setItem('email',emailResponse.email)
        }
      )
      this.router.navigate(['/products']);
     } else{
      alert(`Login failed.  ${response.message} try again! `);
     }
 
    },
    error =>{
      console.log(error.message);
      alert(`Login failed. Please check your credentials and try again!`);
    }
  )
}

}
