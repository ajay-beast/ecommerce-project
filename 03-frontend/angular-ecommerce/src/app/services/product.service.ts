import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl = environment.backendApiUrl + '/products';
  private categoryUrl =  environment.backendApiUrl + '/product-category';


  constructor(private httpClient : HttpClient) { }

  getProductListPaginate(page: number, pageSize:number ,categoryId : number) : Observable<GetResponse> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                      + `&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponse>(searchUrl);
  }

  getProductList(categoryId : number) : Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductCategories() : Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response=>response._embedded.productCategory)
    );
  }

  searchProducts(keyword:string):Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl);
  }


  getSearchProductsPaginate(page: number, pageSize:number ,keyword : string) : Observable<GetResponse> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`
                      + `&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponse>(searchUrl);
  }

  getProductDetails(productId:number) : Observable<Product>{
    const producturl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(producturl)
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponse{
  _embedded :{
    products : Product[];
  },
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}

interface GetResponseProductCategory{
  _embedded :{
    productCategory : ProductCategory[];
  }
}