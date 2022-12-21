package biz.global;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import biz.global.util.StripeSender;

@SpringBootApplication(scanBasePackages = {"biz.global"}, exclude = { SecurityAutoConfiguration.class } )
@EnableJpaRepositories("biz.global.repo")
@EnableTransactionManagement
@EntityScan("biz.global.model")
public class ApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

}
