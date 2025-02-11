package com.ajay.ecommerce.service;

import com.ajay.ecommerce.Dao.OrderRepository;
import com.ajay.ecommerce.Dao.UserSignupRepository;
import com.ajay.ecommerce.dto.PaymentInfo;
import com.ajay.ecommerce.dto.Purchase;
import com.ajay.ecommerce.dto.PurchaseResponse;
import com.ajay.ecommerce.entity.Order;
import com.ajay.ecommerce.entity.OrderItem;
import com.ajay.ecommerce.entity.UserSignup;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class CheckoutServiceImpl implements CheckoutService {

  private static final Logger logger = LoggerFactory.getLogger(CheckoutServiceImpl.class);

  private UserSignupRepository userSignupRepository;
  private OrderRepository orderRepository;

  public CheckoutServiceImpl(UserSignupRepository userSignupRepository,
      OrderRepository orderRepository,
      @Value("${stripe.key.secret}") String secretKey) {
    this.userSignupRepository = userSignupRepository;
    this.orderRepository = orderRepository;
    Stripe.apiKey = secretKey;
  }

  @Override
  public PurchaseResponse placeOrder(Purchase purchase) {
    logger.info("purchase: { } " + purchase);
    Order order = purchase.getOrder();
    String orderTrackingNumber = generateOrderTrackingNumber(order);
    order.setOrderTrackingNumber(orderTrackingNumber);

    Set<OrderItem> orderItems = purchase.getOrderItems();
    orderItems.forEach(order::add);
    order.setShippingAddress(purchase.getShippingAddress());
    order.setBillingAddress(purchase.getBillingAddress());

    UserSignup customerFromDB = userSignupRepository.findOneByUserName(purchase.getUsername());

    if (customerFromDB != null) {
      order.setUser(customerFromDB);
      orderRepository.save(order);
      return new PurchaseResponse(orderTrackingNumber);
    } else{
      throw new RuntimeException("User not found");
    }


  }

  @Override
  public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
    try {
      List<String> paymentMethodTypes = List.of("card");
      Map<String, Object> params = new HashMap<>();
      params.put("amount", paymentInfo.getAmount());
      params.put("currency", paymentInfo.getCurrency());
      params.put("payment_method_types", paymentMethodTypes);
      params.put("description", "Bazaar's Purchase");
      params.put("receipt_email", paymentInfo.getEmailReceipt());
      return PaymentIntent.create(params);
    } catch (Exception e) {
      logger.error(e.getMessage());
      throw e;
    }
  }

  private String generateOrderTrackingNumber(Order order) {
    return UUID.randomUUID().toString();
  }
}
