package hack.com.anglehack.activity;

import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.PropertiesCredentials;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import hack.com.anglehack.R;
import hack.com.anglehack.constants.Constants;
import hack.com.anglehack.utils.WebServiceAmazon;

public class MainActivity extends AppCompatActivity {
    private static final int CAMERA_REQUEST = 1888;
    private ImageView imageView;
    private Button btn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        imageView = (ImageView) findViewById(R.id.imageView1);
        btn = (Button) findViewById(R.id.button1);
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent cameraIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(cameraIntent, CAMERA_REQUEST);
            }
        });

    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == CAMERA_REQUEST && resultCode == RESULT_OK) {
            Bitmap photo = (Bitmap) data.getExtras().get("data");
            // CALL THIS METHOD TO GET THE URI FROM THE BITMAP
            Uri tempUri = getImageUri(getApplicationContext(), photo);

            // CALL THIS METHOD TO GET THE ACTUAL PATH
            final File finalFile = new File(getRealPathFromURI(tempUri));
            Log.d("filen pahth",finalFile.toString());
            //Toast.makeText(this, finalFile.toString(), Toast.LENGTH_SHORT).show();

            new UploadImage().execute(finalFile.toString());

            /*try{
                Log.d("in try","-try");
                FileInputStream fileInputStream= new FileInputStream(finalFile.toString());
                ObjectMetadata objectMetadata = new ObjectMetadata();
                AmazonS3Client s3Client = new AmazonS3Client( new BasicAWSCredentials(Constants.MY_ACCESS_KEY_ID, Constants.MY_SECRET_KEY ) );
                Log.d("in try","-try1");
                PutObjectRequest putObjectRequest= new PutObjectRequest(amazonFileUploadLocationOriginal,"test.jpg",fileInputStream,objectMetadata);
                Log.d("in try","-try2");
                PutObjectResult result = s3Client.putObject(putObjectRequest);
                System.out.println("Etag:" + result.getETag() + "-->" + result);
                Log.d("results","Etag:" + result.getETag() + "-->" + result);
            }catch (Exception e){
                Log.d("Exception"," "+e);
            }*/
           // imageView.setImageBitmap(photo);

        }
        /*String amazonFileUploadLocationOriginal="angel-hacks"+"/";
        FileInputStream fileInputStream= new FileInputStream()
        AmazonS3Client s3Client = new AmazonS3Client( new BasicAWSCredentials(Constants.MY_ACCESS_KEY_ID, Constants.MY_SECRET_KEY ) );
        PutObjectRequest putObjectRequest= new PutObjectRequest(amazonFileUploadLocationOriginal,);*/
    }
    public Uri getImageUri(Context inContext, Bitmap inImage) {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        inImage.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
        String path = MediaStore.Images.Media.insertImage(inContext.getContentResolver(), inImage, "Title", null);
        return Uri.parse(path);
    }

    public String getRealPathFromURI(Uri uri) {
        Cursor cursor = getContentResolver().query(uri, null, null, null, null);
        cursor.moveToFirst();
        int idx = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
        return cursor.getString(idx);
    }

    public class UploadImage extends AsyncTask<String, Void,Integer>{
        String filePath;
        @Override
        protected Integer doInBackground(String... params){
            try{

                filePath = params[0];
                try{
                    long timeNow = System.currentTimeMillis();
                    FileInputStream stream = new FileInputStream(filePath);
                    ObjectMetadata objectMetadata = new ObjectMetadata();
                    AmazonS3Client s3Client = new AmazonS3Client(new BasicAWSCredentials("AKIAI2JHWM7SN5KQGW4Q", "nwAjmhmgfk6luCHIU4WNijRdY9YJJlrMggpP4W6X"));
                    PutObjectRequest request = new PutObjectRequest("angel-hacks/", timeNow+".jpg", stream,objectMetadata);
                    PutObjectResult response = s3Client.putObject(request);
                    Toast.makeText(MainActivity.this, response.toString(), Toast.LENGTH_SHORT).show();
                    Log.d("response",response.toString());
                }catch (Exception e){
                    Toast.makeText(MainActivity.this, e.toString(), Toast.LENGTH_SHORT).show();
                    Log.d("Error",e.toString());
                }
            }catch (Exception e){

            }
            return 1;
        }
        @Override
        protected void onPostExecute(Integer result) {
            Toast.makeText(getApplicationContext(), "Done", Toast.LENGTH_SHORT).show();
        }
    }



}
