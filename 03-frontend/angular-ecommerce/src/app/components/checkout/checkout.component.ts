import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { FormService } from 'src/app/services/form.service';
import { State } from 'src/app/common/state';
import { FormValidators } from 'src/app/validators/form-validators';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from 'src/app/common/payment-info';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0.0;
  totalQuantity: number = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  storage: Storage = localStorage;

  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo(this.totalPrice, 'INR', '');
  cardElement: any;
  displayError: any = '';

  isDisabled: boolean = false;

  isAutheticated: boolean = false;
  username: string = "";

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedin.subscribe((data) => {
      this.isAutheticated = data;
    });

    console.log(`isAuthenticated: ${this.isAutheticated}`);

    this.authService.username.subscribe((data) => {
      this.username = data;
    });
    console.log(`Username: ${this.username}`);

    if (this.isAutheticated) {
      console.log('User is authenticated');
      this.setUpStripePaymentForm();

      this.reviewCartDetails();
      const theEmail = this.storage.getItem('email')!;

      this.checkoutFormGroup = this.formBuilder.group({
        customer: this.formBuilder.group({
          firstName: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhitespace,
          ]),

          lastName: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhitespace,
          ]),

          email: new FormControl(theEmail, [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
          ]),
        }),

        shippingAddress: this.formBuilder.group({
          street: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhitespace,
          ]),
          city: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhitespace,
          ]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhitespace,
          ]),
        }),

        billingAddress: this.formBuilder.group({
          street: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhitespace,
          ]),
          city: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhitespace,
          ]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhitespace,
          ]),
        }),

        creditCard: this.formBuilder.group({
          /*  cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required,Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')]),
        expirationMonth:[''],
        expirationYear:['']
        */
        }),
      });

      // const startMonth: number = new Date().getMonth() + 1;
      // console.log("Start month: "+startMonth);

      // this.formService.getCreditCardMonths(startMonth).subscribe(
      //   data=>{
      //     this.creditCardMonths = data;
      //   }
      // )

      // this.formService.getCreditCardYears().subscribe(
      //   data=>{
      //     this.creditCardYears = data;
      //   }
      // )
      console.log('Fetching countries');
      this.formService.getCountries().subscribe((data) => {
        console.log(` Countries: ${JSON.stringify(data)}`);
        this.countries = data;
      });
    }
  }

  setUpStripePaymentForm() {
  //   const stripeElements = this.stripe.elements();
  //   this.cardElement = stripeElements.create('card', { hidePostalCode: true });
  //   console.log(`Setting up stripe payment form ${this.cardElement}`);
  //  if(this.cardElement){
  //   this.cardElement.mount('#card-element');
  //   this.cardElement.on('change', (event: any) => {
  //     this.displayError = document.getElementById('card-errors');
  //     if (event.complete) {
  //       this.displayError.textContent = '';
  //     } else if (event.error) {
  //       this.displayError.textContent = event.error.message;
  //     }
  //   });
  //  } else{
  //   console.error('Card element not found');
  //  }
    const stripeElements = this.stripe.elements();
    this.cardElement = stripeElements.create('card', { hidePostalCode: true });

    const maxRetries = 10; // Maximum number of retries
    let currentRetry = 0; // Current retry count

    const mountCardElement = () => {
        const cardElementContainer = document.getElementById('card-element');
        if (cardElementContainer) {
            this.cardElement.mount(cardElementContainer);
            this.cardElement.on('change', (event: any) => {
                this.displayError = document.getElementById('card-errors');
                if (event.complete) {
                    if (this.displayError) {
                        this.displayError.textContent = '';
                    }
                } else if (event.error) {
                    if (this.displayError) {
                        this.displayError.textContent = event.error.message;
                    }
                }
            });
            console.log('Card element mounted successfully.');
        } else if (currentRetry < maxRetries) {
            console.error('Card element not found. Retrying...');
            currentRetry++;
            setTimeout(mountCardElement, 100); // Retry after 100ms
        } else {
            console.error('Card element could not be found after maximum retries.');
        }
    };

    mountCardElement(); // Start the initial mount attempt
}



  onSubmit() {
    console.log('Submitting values for form');
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    // order.username = this.storage.getItem('username')!; 

    let cartItems = this.cartService.cartItems;
    let orderItems = cartItems.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    let purchase = new Purchase();
    purchase.username = this.username;
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.orderItems = orderItems;
    purchase.order = order;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'INR';
    this.paymentInfo.emailReceipt = purchase.customer.email;

    console.log(`this.paymentInfo.amount: ${this.paymentInfo.amount}`);

    if (
      !this.checkoutFormGroup.invalid &&
      this.displayError.textContent === ''
    ) {
      this.isDisabled = true;

      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((paymentIntentResponse) => {
          console.log(`Payment intent response: ${paymentIntentResponse}`);
          this.stripe.confirmCardPayment(
              paymentIntentResponse.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      country: this.billingAddressCountry?.value.code,
                      postal_code: purchase.billingAddress.zipCode,
                    },
                  },
                },
              },
              { handleActions: false }
            )
            .then((result: any) => {
              if (result.error) {
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response) => {
                    alert(
                      `Your order has been received. \n Order tracking number: ${response.orderTrackingNumber}`
                    );
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  },
                });
              }
            });
        });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products');
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    let startMonth: number;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    console.log(formGroup);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    console.log(`Country code: ${countryCode}`);
    console.log(`Country name: ${countryName}`);
    this.formService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      formGroup?.get('state')?.setValue(data[0]);
    });
  }

  reviewCartDetails() {
    console.log('Reviewing cart details');
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    console.log(`Total price: ${this.totalPrice}`);
  }
}
