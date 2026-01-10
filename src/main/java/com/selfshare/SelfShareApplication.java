package com.selfshare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SelfShareApplication {
    public static void main(String[] args) {
        SpringApplication.run(SelfShareApplication.class, args);
    }
}