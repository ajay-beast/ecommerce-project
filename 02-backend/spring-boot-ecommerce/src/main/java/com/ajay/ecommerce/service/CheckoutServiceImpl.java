package com.ajay.ecommerce.service;

import com.ajay.ecommerce.Dao.CustomerRepository;
import com.ajay.ecommerce.dto.Purchase;
import com.ajay.ecommerce.dto.PurchaseResponse;
import com.ajay.ecommerce.entity.Customer;
import com.ajay.ecommerce.entity.Order;
import com.ajay.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class CheckoutServiceImpl implements CheckoutService {
  private static final Logger logger = LoggerFactory.getLogger(CheckoutServiceImpl.class);

  private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
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

      Customer customer = purchase.getCustomer();
      customer.add(order);
      customerRepository.save(customer);
      return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber(Order order) {
        return UUID.randomUUID().toString();
    }
}
