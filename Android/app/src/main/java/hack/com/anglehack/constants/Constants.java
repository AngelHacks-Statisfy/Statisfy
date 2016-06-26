package hack.com.anglehack.constants;

/**
 * Created by Deep on 25-Jun-16.
 */
public class Constants {

    public static final String COGNITO_POOL_ID = "us-east-1_GZaIG7zRQ";
    public static final String BucketName= "angel-hacks";
    public static final String MY_ACCESS_KEY_ID = "AKIAI2JHWM7SN5KQGW4Q";
    public static final String MY_SECRET_KEY = "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";

    // API Endpoints
    public static final String BASE_URL = "http://ec2-54-85-202-76.compute-1.amazonaws.com:8080/api/v1/";
    public static final String FETCH_STRIIV = BASE_URL + "getStriivKinesis";
    public static final String NUTRITION = BASE_URL + "getNutrition?foodItem=";
    public static final String DIET_HISTORY = BASE_URL + "getDietHistory";
    public static final String PROVIDERS = BASE_URL + "providers";

}
