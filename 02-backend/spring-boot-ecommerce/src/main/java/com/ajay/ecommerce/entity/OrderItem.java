package com.ajay.ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "order_item")
@Getter
@Setter
public class OrderItem {
  @Id
  @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;
  @Column(name = "product_id")
  private Long productId;
  @Column(name="quantity")
  private int quantity;
  @Column(name="unit_price")
  private BigDecimal unitPrice;
  @Column(name="image_url")
  private String imageUrl;

@ManyToOne
@JoinColumn(name="order_id")
  private Order order;

}
