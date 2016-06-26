package lambda_algorithm_twilio.version1;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.twilio.sdk.TwilioRestException;

public class TriggerWebNotification {
	private static final int medValue = 2000;
	private static int centerValue = 72;
	private static final int delta = 5;
	private static int lastValue;
	private static final int MAX_ENTRIES = 5;
	private final String USER_AGENT = "Mozilla/5.0";
	private static JSONObject distance,totalSteps,activitySeconds,value;
	private static String sensor;
	
	private static LinkedHashMap<String,Boolean> sensorMap = new LinkedHashMap<String,Boolean>(MAX_ENTRIES + 1, .75F, false) {
		protected boolean removeEldestEntry(Map.Entry  eldest) {
            return size() >  MAX_ENTRIES;
         }
      };
	
	private static LinkedHashMap<Integer,Integer> weightMap = new LinkedHashMap<Integer,Integer>(MAX_ENTRIES + 1, .75F, false) {
		protected boolean removeEldestEntry(Map.Entry  eldest) {
            return size() >  MAX_ENTRIES;
         }
      };
      
//      public static void main(String[] args) throws Exception{
//    	  
//    	  String param = "{\"activitySeconds\" + ":" + \"439\" + "," +
//    			    "\"calories\" + ":" + " \"42.413333333333334\" + ", " +
//    			    "\"distance\" + ":" + \"0.4380050505050505\" + "," +
//    			    "\"totalSteps\" + ":" + \"1048\" + "}" ;
//    	  process("{calories : '1000'}", "ishneet");
//      }
   
	public static void process(String val, String sensorID) throws Exception{
		if(!sensorMap.containsKey(sensorID)){
			System.out.println("Adding Sensor ID: " + sensorID);
			sensorMap.put(sensorID, true);
		}
		sensor = sensorID;
		JSONObject getStriivData = new JSONObject(val);
		value = (JSONObject) getStriivData.get("calories");
		System.out.println(value);
		distance = (JSONObject) getStriivData.get("distance");
		totalSteps = (JSONObject) getStriivData.get("totalSteps");
		activitySeconds = (JSONObject) getStriivData.get("activitySeconds");
		//(criticalEstimate(Integer.parseInt(value.toString())))
		if((sensorMap.get(sensorID))){
		  TriggerWebNotification http = new TriggerWebNotification();

		  //System.out.println("Testing 1 - Send Http GET request");
		  String result = http.sendGet();
		  //System.out.println(result);
		  String str = "{ result : " + result + "	} ";
		  JSONObject getDoctor = new JSONObject(str);
		  JSONArray getDocValue = getDoctor.getJSONArray("result");
		  
		  JSONObject getProviders = (JSONObject) getDocValue.get(0);
		  JSONObject providers = (JSONObject) getProviders.get("provider");
		  
		  System.out.println(providers.get("phone"));
		  writeDynamo();
//		  JSONArray doctors = (JSONArray) result.get("doctorInfo");
//		  String patientName = patientObj.get("displayName").toString();
//		  String emergencyContact = patientObj.get("emergencyContactNumber").toString();
//		  String emergencyName = patientObj.get("emergencyContactName").toString();
//		  
//		  for(int i = 0; i < doctors.length(); i++){
//			  // Email Notification to Doctors 
//			  EmailNotification.emailDoctor(patientName, value, ((JSONObject)doctors.get(i)).get("displayName").toString(), emergencyContact, emergencyName);
//			  // Make Call and send Message to the Doctors
//			  callTwilio(((JSONObject)doctors.get(i)).get("phoneNumber").toString(), value, patientName, ((JSONObject)doctors.get(i)).get("displayName").toString());
//		  }
//		  
		  // Make Call and send Message to the Emergency Contact
		  callTwilio("4087149328", value.toString(),sensorID, providers.get("first_name").toString(), providers.get("phone").toString());		  
//		  
//		  System.out.println("Made Emergency Call for Sensor ID: " + sensorID);
//		  sensorMap.put(sensorID, false);
		}
	}
	
	private String sendGet() throws Exception {
 
		String url = "http://ec2-54-85-202-76.compute-1.amazonaws.com:8080/api/v1/providers";
		
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		// optional default is GET
		con.setRequestMethod("GET");

		//add request header
		con.setRequestProperty("User-Agent", USER_AGENT);

		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'GET' request to URL : " + url);
		System.out.println("Response Code : " + responseCode);

		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

		//print result
		//System.out.println(response.toString());
		return response.toString();
	}
	
	private static boolean criticalEstimate(int calories) {
		int difference = calories + lastValue - medValue;
		if(Math.abs(difference) >= delta){
			return true;
		}
	
		System.out.println("No Critical Calories!" + calories);
		lastValue += calories;
		return false;
	}
	
	private static boolean getSeries(int heartRate){
		int count = 0;
		Set<Integer> keys = weightMap.keySet();
		for(int k : keys){
            if((heartRate - k) > 1){
            	count++;
            }
        }

		if(count > 2){
			return true;
		}
		return false;
	}
	
	public static void callTwilio(String contactNumber, String record,String userName, String docName, String docNumber){
		try {		
//			TwilioCall twilioCall = new TwilioCall();
//	        try {
//				twilioCall.callTwilio(contactNumber, patientName, record, contactName);
//			} catch (TwilioRestException e) {
//				System.out.println("Twilio Call Exception");
//				e.printStackTrace();
//			}
	        
	        TwilioSMS twilioSms = new TwilioSMS();
	        try {
				twilioSms.messageTwilio(contactNumber, userName, docName, record, docNumber);
			} catch (TwilioRestException e) {
				System.out.println("Twilio Message Exception");
				e.printStackTrace();
			}
			}
		catch (Exception e) {
			System.out.println("Data Value Exception");
	        e.printStackTrace();
	}
}
	public static void writeDynamo(){
		DynamoDB dynamoDB = new DynamoDB(new AmazonDynamoDBClient(
				new BasicAWSCredentials("", "")));

			Table table = dynamoDB.getTable("StriivData");

			// Build the item
			Item item = new Item()
			    .withPrimaryKey("Id", sensor)
			    .withString("Distance", distance.toString())
			    .withString("Calories", value.toString())
			    .withString("ActivitySeconds", activitySeconds.toString())
			    .withString("Steps", totalSteps.toString());

			// Write the item to the table 
			PutItemOutcome outcome = table.putItem(item);
			System.out.println(outcome);
	}
}
