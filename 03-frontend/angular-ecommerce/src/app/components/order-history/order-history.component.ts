import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { AuthService } from 'src/app/services/auth.service';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList : OrderHistory[] = []
  storage : Storage = localStorage;
  isAutheticated:boolean = false;
  username:string = "";

  constructor(private orderHistoryService : OrderHistoryService, private authService:AuthService) { }

  ngOnInit(): void {
  //   this.isAutheticated = this.storage.getItem('email') ? true : false;
  //  if(this.isAutheticated){
  //   this.handleOrderHistory();
  //  } 

  this.authService.isLoggedin.subscribe(
    (data)=>{
      this.isAutheticated=data;
    })

    this.authService.username.subscribe(
      (data)=>{
        this.username=data;
      })

    if(this.isAutheticated){
      this.handleOrderHistory();
    }
  
  }

  handleOrderHistory(){
    // const username = this.storage.getItem('username')!;
    console.log(`username: ${this.username}`);
    this.orderHistoryService.getOrderHistory(this.username).subscribe(
      data=>{
        console.log(`Order History: ${JSON.stringify(data)}`);
        this.orderHistoryList=data._embedded.orders;
        console.log(this.orderHistoryList)
      }
    )
  }

}
