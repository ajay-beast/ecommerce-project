import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderHistory } from '../common/order-history';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.backendApiUrl + '/orders';
  constructor(private httpClient:HttpClient) { }

  getOrderHistory(username:string) : Observable<GetOrderHistoryResponse>{
    const orderHistoryUrl = `${this.orderUrl}/search/findByUserUserNameOrderByDateCreatedDesc?username=${username}`;
    return this.httpClient.get<GetOrderHistoryResponse>(orderHistoryUrl);
  }

}

interface GetOrderHistoryResponse{
  _embedded:{
    orders:OrderHistory[]
  }
}
