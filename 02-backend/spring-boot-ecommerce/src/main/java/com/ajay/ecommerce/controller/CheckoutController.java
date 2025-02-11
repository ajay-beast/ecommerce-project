package com.ajay.ecommerce.controller;

import com.ajay.ecommerce.dto.PaymentInfo;
import com.ajay.ecommerce.dto.Purchase;
import com.ajay.ecommerce.dto.PurchaseResponse;
import com.ajay.ecommerce.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
  private static final Logger logger = LoggerFactory.getLogger(CheckoutController.class);

  private CheckoutService checkoutService;

  public CheckoutController(CheckoutService checkoutService) {
    this.checkoutService = checkoutService;
  }


  @PostMapping("/purchase")
  public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
    logger.info("purchase: { } " , purchase);

    PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
    return purchaseResponse;
  }

  @PostMapping("/payment-intent")

  public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo)
      throws StripeException {
    PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);
    String paymentStr = paymentIntent.toJson();
    return new ResponseEntity<>(paymentStr, HttpStatus.OK);
  }

}
