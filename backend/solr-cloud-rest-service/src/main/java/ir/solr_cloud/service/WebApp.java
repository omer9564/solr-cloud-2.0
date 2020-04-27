package ir.solr_cloud.service;

import ir.solr_cloud.common.PropertiesHandler;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Arrays;

@SpringBootApplication
@EnableSwagger2
public class WebApp {

    public static void main(String[] args) {
        //for activating from intellij
        PropertiesHandler.loadConfig("src/main/resources/config.properties");
        //for activating from jar
        //PropertiesHandler.loadConfig("../resources/main/config.properties");
        SpringApplication.run(WebApp.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {

            //System.out.println("Let's inspect the beans provided by Spring Boot:");

            String[] beanNames = ctx.getBeanDefinitionNames();
            Arrays.sort(beanNames);
            for (String beanName : beanNames) {
              //  System.out.println(beanName);
            }

        };
    }

}