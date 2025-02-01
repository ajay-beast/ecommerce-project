import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private baseUrl = environment.backendApiUrl + '/auth';

  constructor(private httpClient : HttpClient) { }

  getEmailfromUserName(username:string): Observable<any>{
    return this.httpClient.get(`${this.baseUrl}/email/${username}`)
  }
}
