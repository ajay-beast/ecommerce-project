import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedin:Subject<boolean> = new BehaviorSubject<boolean>(false);
  username:Subject<string> = new BehaviorSubject<string>('');
  sessionStorage:Storage = sessionStorage;

  constructor(private httpClient : HttpClient) { 
    // Retrieve the value and convert it back to a boolean
  const a= sessionStorage.getItem('isLoggedin') === 'true';
  const b = sessionStorage.getItem('username') || '';
  this.isLoggedin.next(a);
  this.username.next(b);

  }


  private baseUrl = environment.backendApiUrl + '/auth';

  register(user:any) : Observable<any>{
    return this.httpClient.post(`${this.baseUrl}/signup`,user);
  }

  login(credintals:any): Observable<any>{
    return this.httpClient.post(`${this.baseUrl}/signin`,credintals);
  }

  makeLogin(){
    this.isLoggedin.next(true);
    this.username.next(this.sessionStorage.getItem('username')!);
    this.sessionStorage.setItem('isLoggedin','true');

  }

  makeLogout(){
    this.isLoggedin.next(false);
    this.username.next('');
    this.sessionStorage.setItem('isLoggedin','false');
    this.sessionStorage.removeItem('username');
  }


}
