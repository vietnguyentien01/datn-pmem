package com.pmem.controller;

import com.pmem.dto.LoginRequest;
import com.pmem.dto.LoginResponse;
import com.pmem.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("Request đăng nhập từ: {}", request.getUsername());
        try {
            LoginResponse response = authService.login(request);
            log.info("Đăng nhập thành công cho user: {}", request.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Lỗi đăng nhập cho user {}: {}", request.getUsername(), e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                    "status", 401,
                    "error", "Unauthorized",
                    "message", e.getMessage(),
                    "path", "/api/auth/login"));
        }
    }
}
