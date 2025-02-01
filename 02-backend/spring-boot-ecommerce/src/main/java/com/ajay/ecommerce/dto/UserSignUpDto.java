package com.ajay.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserSignUpDto {
  private int userId;
  @JsonProperty("username")
  private String userName;
  private String email;
  private String password;

}
