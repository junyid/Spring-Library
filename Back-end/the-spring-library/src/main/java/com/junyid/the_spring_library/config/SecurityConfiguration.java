package com.junyid.the_spring_library.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        // Disable CSRF
        http.csrf().disable();

        // protect /secure/** endpoints with HTTP Basic authentication
        http.authorizeRequests(configurer ->
            configurer.
                    antMatchers("/api/books/secure/**", "/api/reviews/secure/**")
                    .authenticated())
                .oauth2ResourceServer()
                .jwt();

        http.cors();

        // negotiation strategy
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // force a non-empty response body for 401s to make the response more browser-friendly
        Okta.configureResourceServer401ResponseBody(http);

        return http.build();
    }

}
