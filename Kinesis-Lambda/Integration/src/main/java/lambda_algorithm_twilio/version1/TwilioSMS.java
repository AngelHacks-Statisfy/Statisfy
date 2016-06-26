package lambda_algorithm_twilio.version1;

import java.util.*; 

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import com.twilio.sdk.*; 
import com.twilio.sdk.resource.factory.*; 
import com.twilio.sdk.resource.instance.*;  
 
public class TwilioSMS { 
	
 //contactNumber, userName, docName, record, docNumber
 public void messageTwilio(String contactNumber, String patientName, String docName, String value, String docNumber) throws TwilioRestException { 
	TwilioRestClient client = new TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN); 
	 System.out.println("In Twilio SMS");
	 List<NameValuePair> params = new ArrayList<NameValuePair>(); 
	 params.add(new BasicNameValuePair("To", contactNumber)); 
	 params.add(new BasicNameValuePair("From", "+")); 
	 params.add(new BasicNameValuePair("Body", "Hi " + patientName + "! Your calorie intake is: " + value + ". You can reach out to the provider " + docName + " on " + docNumber ));   
 
	 MessageFactory messageFactory = client.getAccount().getMessageFactory(); 
	 Message message = messageFactory.create(params); 
	 System.out.println(message.getSid()); 
 } 
}