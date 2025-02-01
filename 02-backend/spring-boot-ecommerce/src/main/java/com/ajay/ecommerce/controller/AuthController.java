package com.ajay.ecommerce.controller;

import com.ajay.ecommerce.dto.LoginDto;
import com.ajay.ecommerce.dto.UserSignUpDto;
import com.ajay.ecommerce.service.UserSignUpLogInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
@Autowired
 private UserSignUpLogInService userSignUpLogInService;

@PostMapping("/signup")
  public ResponseEntity<?> signUp(@RequestBody UserSignUpDto userSignUpDto) {
    return ResponseEntity.ok(userSignUpLogInService.addUser(userSignUpDto));
  }

@PostMapping("/signin")
  public ResponseEntity<?> signIn(@RequestBody LoginDto loginDto){
  return ResponseEntity.ok(userSignUpLogInService.logInUser(loginDto));
}

@GetMapping("/email/{username}")
  public ResponseEntity<?> getEmail(@PathVariable String username){
  return ResponseEntity.ok(userSignUpLogInService.getEmail(username));
}
}
