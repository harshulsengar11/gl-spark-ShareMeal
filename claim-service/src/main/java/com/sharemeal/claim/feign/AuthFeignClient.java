package com.sharemeal.claim.feign;

import com.sharemeal.claim.dto.AuthUserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "AUTH-SERVICE")
public interface AuthFeignClient {

    @GetMapping("/auth/internal/user/{email}")
    AuthUserDTO getUserByEmail(
            @PathVariable String email
    );
}