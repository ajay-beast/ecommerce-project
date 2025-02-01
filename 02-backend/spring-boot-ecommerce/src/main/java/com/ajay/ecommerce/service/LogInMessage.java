package com.ajay.ecommerce.service;

import lombok.Data;

@Data
public class LogInMessage {
  private String message;
  private boolean status;

  public LogInMessage(String message, boolean status) {
    this.message = message;
    this.status = status;
  }
}
