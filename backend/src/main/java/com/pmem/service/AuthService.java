package com.pmem.service;

import com.pmem.dto.LoginRequest;
import com.pmem.dto.LoginResponse;
import com.pmem.model.Employee;
import com.pmem.model.User;
import com.pmem.repository.EmployeeRepository;
import com.pmem.repository.UserRepository;
import com.pmem.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails, user.getRole().name());

        Employee employee = employeeRepository.findByUserId(user.getId()).orElse(null);

        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .employeeId(employee != null ? employee.getId() : null)
                .fullName(employee != null ? employee.getFullName() : user.getUsername())
                .email(employee != null ? employee.getEmail() : user.getUsername())
                .build();
    }
}
