package biz.global.util;

import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;

import io.jsonwebtoken.io.IOException;

import javax.activation.*;

public class EmailSender {
	
	Session session = null;
	MimeMessage mimeMessage = null;
	
	public void sendEmail(String to, String message) throws AddressException, IOException, MessagingException  {
		
		EmailSender mail = new EmailSender();
		mail.setupServerProperties();
		mail.draftEmail(to, message);
		mail.sendingEmail();
		
	}
	
	private void setupServerProperties() {
		Properties properties = System.getProperties();
		properties.put("mail.smtp.port", "465");
		properties.put("mail.smtp.auth", "true");
		properties.put("mail.smtp.starttls.enable", "true");
		properties.put("mail.smtp.ssl.enable", "true");
		session = Session.getDefaultInstance(properties, null);
	}
	
	private MimeMessage draftEmail(String to, String message) throws AddressException, MessagingException, IOException {
//		String to  = "jhovaniecabatuan@gmail.com";
		String mailMessage = "Farm to Market";
		String mailBody = "hello jovanie this is the body";
		mimeMessage = new MimeMessage(session);
		
		mimeMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
		mimeMessage.setSubject(mailMessage);
//		mimeMessage.setText("This is actual message");
		//mimeMessage.setContent("This is actual message", "text/html");
		mimeMessage.setContent(message, "text/html");

		
		return mimeMessage;
	}
	
	private void sendingEmail() throws MessagingException{
		String from = "farmtomarket001@gmail.com";
		String fromUserPass = "ontijmwbljoftghl";
		String emailhost = "smtp.gmail.com";
		Transport transport = session.getTransport("smtp");
		transport.connect(emailhost, from, fromUserPass);
		transport.sendMessage(mimeMessage, mimeMessage.getAllRecipients());
		transport.close();
		System.out.print("email successfully sent");
	}

}
