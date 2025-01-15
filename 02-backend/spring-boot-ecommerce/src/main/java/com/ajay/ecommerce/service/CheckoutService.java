package com.ajay.ecommerce.service;

import com.ajay.ecommerce.dto.PaymentInfo;
import com.ajay.ecommerce.dto.Purchase;
import com.ajay.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

  PurchaseResponse placeOrder(Purchase purchase);

  PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
