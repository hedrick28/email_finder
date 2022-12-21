package biz.global.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import biz.global.model.Email;
import biz.global.model.ResponseModel;
import biz.global.repo.EmailRepo;

@RestController
@RequestMapping("api/email/")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailController {
    
    @Autowired
    private EmailRepo emailRepo;
    
    @GetMapping(value="all")
    public List<Email> getAllAds() {
        return emailRepo.getAllEmail();
    }
    
    @GetMapping(value="brand/{brands}")
    public List<Email> findBrand(@PathVariable String brands){
        return emailRepo.findByBrand(brands);
    }
    
    @GetMapping(value="domain/{domain}")
    public List<Email> domain(@PathVariable String domain){
        return emailRepo.findByDomain(domain);
    }
}
