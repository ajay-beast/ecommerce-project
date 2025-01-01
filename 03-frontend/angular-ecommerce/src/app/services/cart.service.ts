import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems:CartItem[]=[];

  // totalPrice:Subject<number> = new Subject<number>();
  // totalQuantity:Subject<number> = new Subject<number>();

  totalPrice:Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem:CartItem){
    let alreadyExistsInCart:boolean=false;
    let existingCartItem:CartItem | undefined=undefined;

    if(this.cartItems.length > 0){
      existingCartItem = this.cartItems.find(tempCartItem=>tempCartItem.id === theCartItem.id)
      alreadyExistsInCart = (existingCartItem != undefined)
    }

    if(alreadyExistsInCart && existingCartItem) existingCartItem.quantity++;
    else{
      this.cartItems.push(theCartItem)
    }

    this.computeCartTotals();


  }

  decrementQuantity(cartItem:CartItem){
    cartItem.quantity--;
    if(cartItem.quantity === 0){
      this.remove(cartItem);
    }

    else{
      this.computeCartTotals();
    }
  }

  remove(cartItem : CartItem){
    const itemIndex = this.cartItems.findIndex(tempCartItem=> tempCartItem.id === cartItem.id);
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }

  computeCartTotals(){
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;

    for(let currCartItem of this.cartItems){
      totalPriceValue += currCartItem.unitPrice*currCartItem.quantity;
      totalQuantityValue += currCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}
