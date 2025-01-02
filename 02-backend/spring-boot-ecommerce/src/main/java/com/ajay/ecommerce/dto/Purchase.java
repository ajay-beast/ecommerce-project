package com.ajay.ecommerce.dto;

import com.ajay.ecommerce.entity.Address;
import com.ajay.ecommerce.entity.Customer;
import com.ajay.ecommerce.entity.Order;
import com.ajay.ecommerce.entity.OrderItem;
import java.util.Set;
import lombok.Data;

@Data
public class Purchase {
private Customer customer;
private Address shippingAddress;
private Address billingAddress;
private Order order;
private Set<OrderItem> orderItems;
}
