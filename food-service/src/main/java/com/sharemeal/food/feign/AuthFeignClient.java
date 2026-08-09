package com.sharemeal.food.feign;

import com.sharemeal.food.dto.AuthUserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "AUTH-SERVICE")
public interface AuthFeignClient {

    @GetMapping("/auth/internal/user/{email}")
    AuthUserDTO getUserByEmail(
            @PathVariable("email") String email
    );
}