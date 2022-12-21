package biz.global.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import biz.global.model.Email;

public interface EmailRepo extends JpaRepository<Email, Long> {
    
    @Query(nativeQuery = true, value = "select * from email_finder where brands = ?1")
    List<Email> findByBrand(String brands);
    
    @Query(nativeQuery = true, value = "select * from email_finder where domain = ?1")
    List<Email> findByDomain(String domain);
    
    @Query(nativeQuery = true, value = "select * from email_finder")
    List<Email> getAllEmail();

}
