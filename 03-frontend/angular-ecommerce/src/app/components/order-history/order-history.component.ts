import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList : OrderHistory[] = []
  storage : Storage = localStorage;

  constructor(private orderHistoryService : OrderHistoryService) { }

  ngOnInit(): void {
    this.storage.setItem('email','afasa@test.com')
    this.handleOrderHistory();
  }

  handleOrderHistory(){
    const email = this.storage.getItem('email')!;
    this.orderHistoryService.getOrderHistory(email).subscribe(
      data=>{
        this.orderHistoryList=data._embedded.orders;
        console.log(this.orderHistoryList)
      }
    )
  }

}
