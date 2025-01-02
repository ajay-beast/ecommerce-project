package com.ajay.ecommerce.service;

import com.ajay.ecommerce.dto.Purchase;
import com.ajay.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
PurchaseResponse placeOrder(Purchase purchase);
}
