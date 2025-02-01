import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAutheticated:boolean = false;
  username:string = "";
  sessionStorage : Storage=sessionStorage;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    // this.username = this.sessionStorage.getItem('username')!;
    // if(this.username){
    //   this.isAutheticated = true;
    // }

    this.authService.isLoggedin.subscribe(
      (data)=>{
        this.isAutheticated=data;
      })
      console.log(`isAuthenticated: ${this.isAutheticated}`);

      this.authService.username.subscribe(
        (data)=>{
          this.username=data;
        })

      // if(this.isAutheticated){
      //   this.username = this.sessionStorage.getItem('username')!;
      // }
  }

  logOut(){
    this.sessionStorage.removeItem('username');
    this.sessionStorage.removeItem('email');
    this.isAutheticated = false;
    this.authService.makeLogout();
  }

}
