package com.ajay.ecommerce.Dao;

import com.ajay.ecommerce.entity.UserSignup;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserSignupRepository extends JpaRepository<UserSignup,Integer> {
  Optional<UserSignup> findOneByUserNameAndPassword(String userName, String password);
  UserSignup findOneByUserName(String userName);
  boolean existsByUserName(String userName);  // Checks if username exists
  boolean existsByEmail(String email);
}
