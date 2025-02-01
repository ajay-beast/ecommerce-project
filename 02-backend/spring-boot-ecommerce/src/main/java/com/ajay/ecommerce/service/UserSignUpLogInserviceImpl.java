package com.ajay.ecommerce.service;

import com.ajay.ecommerce.Dao.UserSignupRepository;
import com.ajay.ecommerce.dto.LoginDto;
import com.ajay.ecommerce.dto.UserSignUpDto;
import com.ajay.ecommerce.entity.UserSignup;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserSignUpLogInserviceImpl implements UserSignUpLogInService {

  @Autowired
  private UserSignupRepository userSignupRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  private static final Logger logger = LoggerFactory.getLogger(UserSignUpLogInserviceImpl.class);

  @Override
  public  LogInMessage addUser(UserSignUpDto userSignUpDto) {
    try{
//      Map<String, String> response = new HashMap<>();
      if (userSignupRepository.existsByUserName(userSignUpDto.getUserName())) {
        return new LogInMessage("Username is already taken", false);
      }

      if (userSignupRepository.existsByEmail(userSignUpDto.getEmail())) {
        return new LogInMessage("Email is already taken", false);
      }

      UserSignup userSignup = new UserSignup();
      userSignup.setUserName(userSignUpDto.getUserName());
      userSignup.setEmail(userSignUpDto.getEmail());
      userSignup.setPassword(passwordEncoder.encode(userSignUpDto.getPassword()));
      userSignupRepository.save(userSignup);

     return new LogInMessage("User added successfully", true);
    } catch(Exception e){
      logger.info("Error in adding user: " + e.getMessage());
      throw new RuntimeException("Error in adding user");
    }

  }

  @Override
  public LogInMessage logInUser(LoginDto loginDto) {
    UserSignup userSignup = userSignupRepository.findOneByUserName(loginDto.getUsername());
    if (userSignup != null) {
      String encodedPassword = userSignup.getPassword();
      String password = loginDto.getPassword();
      if (passwordEncoder.matches(password, encodedPassword)) {
        Optional<UserSignup> user = userSignupRepository.findOneByUserNameAndPassword(
            loginDto.getUsername(), encodedPassword);
        if (user.isPresent()) {
          return new LogInMessage("Login Successful", true);
        } else {
          return new LogInMessage("Login Failed", false);
        }
      } else {
        return new LogInMessage("Wrong Password", false);
      }
    } else{
      return new LogInMessage("User Not Found", false);
    }
  }

  @Override
  public Map<String,String> getEmail(String username){
    UserSignup userSignUp=userSignupRepository.findOneByUserName(username);
    if(userSignUp != null){
      Map<String,String> response = new HashMap<>();
      response.put("email", userSignUp.getEmail());
      return response;
    } else{
      throw new RuntimeException("User not found");
    }
  }

  }
