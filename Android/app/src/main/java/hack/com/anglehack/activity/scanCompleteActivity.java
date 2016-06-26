package hack.com.anglehack.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;

import hack.com.anglehack.R;
import hack.com.anglehack.utils.ApiManager;

/**
 * Created by Deep on 26-Jun-16.
 */
public class scanCompleteActivity extends AppCompatActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scancomplete);

        Intent i = getIntent();
        String search_query = i.getStringExtra("search_text");

        ApiManager apiManager = new ApiManager();

        TextView fat = (TextView)findViewById(R.id.fat);
        TextView cal = (TextView)findViewById(R.id.calories);
        TextView overall = (TextView)findViewById(R.id.overall);
        TextView serv = (TextView)findViewById(R.id.serve_size);
        TextView brand = (TextView)findViewById(R.id.brand_name);

        apiManager.fetchNutrition(search_query, cal, fat, overall, serv, brand);
    }
}
