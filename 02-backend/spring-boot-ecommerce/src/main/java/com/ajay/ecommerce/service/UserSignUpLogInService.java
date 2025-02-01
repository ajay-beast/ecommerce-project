package com.ajay.ecommerce.service;

import com.ajay.ecommerce.dto.LoginDto;
import com.ajay.ecommerce.dto.UserSignUpDto;
import java.util.Map;

public interface UserSignUpLogInService {
  LogInMessage addUser(UserSignUpDto userSignUpDto);
  LogInMessage logInUser(LoginDto loginDto);
  Map<String,String> getEmail(String username);
}
