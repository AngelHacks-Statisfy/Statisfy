package hack.com.anglehack.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;

import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;

import java.io.File;

import hack.com.anglehack.constants.Constants;

/**
 * Created by Deep on 25-Jun-16.
 */

public class WebServiceAmazon extends AsyncTask<Void, Void, Void> {
    private String mParams;
    private String mResult = "x";
    WebServiceInterface<String, String> mInterface;
    private int mRequestType;
    private  String UserId;
    private Context mContext;


    public WebServiceAmazon(Context context,String imagePath,String AppId,int type) {
        this.mContext = context;
        this.mParams = imagePath;
        this.mRequestType = type;
        this.UserId = AppId;
    }

    public void result(WebServiceInterface<String, String> myInterface) {
        this.mInterface = myInterface;
    }

    @Override
    protected Void doInBackground(Void... params) {
        String ACCESS_KEY = Constants.MY_ACCESS_KEY_ID;
        String SECRET_KEY = Constants.MY_SECRET_KEY;

        try {
            if (mRequestType == 1) { // POST
                Log.d("WSA","POST1");
                AmazonS3Client s3Client = new AmazonS3Client(new BasicAWSCredentials(ACCESS_KEY, SECRET_KEY));
                Log.d("WSA","POST2");
                PutObjectRequest request = new PutObjectRequest("angel-hacks", "imageName", new File(mParams));
                s3Client.putObject(request);
                Log.d("WSA","POST3");
                mResult = "success";
            } if (mRequestType == 2) { // For get image data
                AmazonS3Client s3Client = new AmazonS3Client(new BasicAWSCredentials(ACCESS_KEY, SECRET_KEY));
                S3Object object = s3Client.getObject(new GetObjectRequest("bucketName", mParams));
                S3ObjectInputStream objectContent = object.getObjectContent();
                byte[] byteArray = IOUtils.toByteArray(objectContent);

                Bitmap bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.length);



                mResult = "success";
            }

        } catch (Exception e) {
            mResult = e.toString();
            e.printStackTrace();
        }
        return null;
    }

    @Override
    protected void onPreExecute() {
        // TODO Auto-generated method stub
        super.onPreExecute();
    }

    @Override
    protected void onPostExecute(Void result) {
        // TODO Auto-generated method stub
        super.onPostExecute(result);
        mInterface.success(this.mResult);

    }

    public interface WebServiceInterface<E, R> {
        public void success(E reslut);

        public void error(R Error);
    }

}
