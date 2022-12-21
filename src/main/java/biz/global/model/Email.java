package biz.global.model;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Email {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String parent;
    
    private String brands;
    
    private String domain;
    
    private String format_combination;
    
    private String notes;
}
