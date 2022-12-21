package biz.global.util;

import com.twilio.Twilio; 
import com.twilio.converter.Promoter; 
import com.twilio.rest.api.v2010.account.Message; 
import com.twilio.type.PhoneNumber; 

 
import java.net.URI; 
import java.math.BigDecimal; 

public class Sms {
	
    public static final String ACCOUNT_SID = "ACf5567aacd48f66e207261ce03605d6d6"; 
    public static final String AUTH_TOKEN = "53ddab01ab5a0a362df04ad07b85b680"; 
    
    public void sendSms(String to, String content) {
    	Twilio.init(ACCOUNT_SID, AUTH_TOKEN); 
        Message message = Message.creator( 
                new PhoneNumber(to),  
                "MG8476facc65f4199b5ad8cd9fb50090a3",
                content)      
            .create(); 
 
        System.out.println(message.getSid()); 
    }

}
