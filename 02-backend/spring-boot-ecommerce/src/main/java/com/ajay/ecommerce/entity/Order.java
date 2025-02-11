package com.ajay.ecommerce.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
  @Id
  @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;
  @Column(name = "order_tracking_number")
  private String orderTrackingNumber;
  @Column(name = "total_quantity")
  private int totalQuantity;
  @Column(name = "total_price")
  private BigDecimal totalPrice;
  @Column(name = "status")
  private String status;
  @Column(name = "date_created")
  @CreationTimestamp
  private Date dateCreated;
  @Column(name = "last_updated")
  @UpdateTimestamp
  private Date lastUpdated;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
  private Set<OrderItem> orderItems = new HashSet<>();

//  @ManyToOne
//  @JoinColumn(name = "customer_id")
//  private Customer customer;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "shipping_address_id", referencedColumnName = "id")
  private Address shippingAddress;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "billing_address_id", referencedColumnName = "id")
  private Address billingAddress;

  @ManyToOne
  @JoinColumn(name="user_name", referencedColumnName = "user_name")
  private UserSignup user;

  public void add(OrderItem orderItem) {
    if (orderItem != null) {
      if (orderItems == null) {
        orderItems = new HashSet<>();
      }
      orderItems.add(orderItem);
      orderItem.setOrder(this);
    }
  }
}
