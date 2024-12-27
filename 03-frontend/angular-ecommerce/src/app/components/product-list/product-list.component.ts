import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];
  currentCategoryId:number=1;
  previousCategoryId:number=1;
  searchMode:boolean=false;
  previousKeyword:string="";

  pageNumber:number=1;
  pageSize=5;
  totalElement=0;

  constructor(private productService : ProductService, private cartService:CartService,
     private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
    
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword')
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const keyword : string = this.route.snapshot.paramMap.get('keyword')!

    if(this.previousKeyword != keyword){
      this.pageNumber=1;
    }

    this.previousKeyword=keyword;

    this.productService.getSearchProductsPaginate(this.pageNumber-1,this.pageSize,keyword).subscribe(
     this.processResult()
    )
  }

  handleListProducts(){
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }


    if(this.previousCategoryId!=this.currentCategoryId) this.pageNumber=1;
    this.previousCategoryId=this.currentCategoryId;

    this.productService.getProductListPaginate( this.pageNumber-1,this.pageSize,this.currentCategoryId).subscribe(
      this.processResult())
  }

  updatePageSize(pageSize:string){
    this.pageSize = +pageSize;
    this.pageNumber=1;
    this.listProducts();
  }

  processResult(){
    return (data:any)=>{
      this.products = data._embedded.products;
      // this.pageNumber=data.page.number+1;
      // this.pageSize=data.page.size;
      this.totalElement=data.page.totalElements;
    }
  }


  addToCart(theProduct:Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)
    const cartItem = new CartItem(theProduct);
    this.cartService.addToCart(cartItem);
  }

}
