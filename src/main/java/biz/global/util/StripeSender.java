package biz.global.util;

import java.nio.file.Paths;

import static spark.Spark.post;
import static spark.Spark.port;
import static spark.Spark.staticFiles;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;


public class StripeSender {
	public void sendStripe() {
		port(4242);

	    // This is your test secret API key.
		com.stripe.Stripe.apiKey = "sk_test_51M0efuBy4k0O6hiSIf7N6JaB5zIDBFaMdI4nDI4OHDyP25w0sQghXZGBb3pkKYBxa46OCVE584t1Ju4fw3i02u4P00BjfoOAWE";

	    staticFiles.externalLocation(
	        Paths.get("public").toAbsolutePath().toString());

	    post("/create-checkout-session", (request, response) -> {
	    	System.out.println(request);
	        String YOUR_DOMAIN = "http://localhost:3001";
	        SessionCreateParams params =
	          SessionCreateParams.builder()
	            .setMode(SessionCreateParams.Mode.PAYMENT)
	            .setSuccessUrl(YOUR_DOMAIN + "?success=true")
	            .setCancelUrl(YOUR_DOMAIN + "?canceled=true")
	            .addLineItem(
	              SessionCreateParams.LineItem.builder()
	                .setQuantity(1L)
	                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
	                .setPrice("price_1M1OuPBy4k0O6hiS3uWKkYSb")
	                .build())
	            .build();
	      Session session = Session.create(params);

	      response.redirect(session.getUrl(), 303);
	      return "";
	    });
	}

}
