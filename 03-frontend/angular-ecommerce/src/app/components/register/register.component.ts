import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = {
    username: '',
    email: '',
    password: ''
  };

  isAutheticated:boolean = false;

  constructor(private authService:AuthService, private router : Router) { }

  ngOnInit(): void {
    this.authService.isLoggedin.subscribe(
      (data)=>{
        this.isAutheticated=data;
      })
      console.log(`isAuthenticated: ${this.isAutheticated}`);
  }

  register(){
    this.authService.register(this.user).subscribe(
      (response)=>{
        if(response.status === true){
          console.log('User created successfully', response);
          this.router.navigate(['/login']);
        }

        else{
          console.log('User creation failed', response);
          alert(`User creation failed. ${response.message}`);
        }
        
      },
      error=>{
        console.log(error);
        alert(`There was an error creating user: ${error.message}`);
      }
    )
  }

}
