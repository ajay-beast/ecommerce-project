import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl =  environment.backendApiUrl + '/checkout/purchase';
  private paymentIntentUrl = environment.backendApiUrl + '/checkout/payment-intent';
  
  constructor( private httpClient: HttpClient) { }
  
  placeOrder(purchase: Purchase): Observable<any> {
    console.log(`calling placing order: ${purchase}`);
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo : PaymentInfo): Observable<any> {
    console.log(`calling payment intent: ${paymentInfo}`);
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
  
}
