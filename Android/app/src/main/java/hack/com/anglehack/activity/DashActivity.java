package hack.com.anglehack.activity;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.widget.TextView;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

import hack.com.anglehack.R;
import hack.com.anglehack.adapters.FeedItem;
import hack.com.anglehack.adapters.FeedListAdapter;
import hack.com.anglehack.utils.ApiManager;

public class DashActivity extends AppCompatActivity {

    /** The Recycler View in the layout */
    private RecyclerView recyclerView;

    private FeedListAdapter listAdapter;

    private TextView kcal;
    private TextView distance;
    private TextView steps;

    private ApiManager apiManager;

    /** Feed Items. */
    final private ArrayList<FeedItem> feedItems = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dash);
        apiManager = new ApiManager();

        populateDummyData();

        LinearLayoutManager llm = new LinearLayoutManager(this);
        llm.setOrientation(LinearLayoutManager.VERTICAL);
        recyclerView = (RecyclerView)findViewById(R.id.meal_log);
        recyclerView.setLayoutManager(llm);

        kcal = (TextView)findViewById(R.id.kcal);
        steps = (TextView)findViewById(R.id.steps);
        distance = (TextView)findViewById(R.id.distance);

        listAdapter = new FeedListAdapter<FeedItem>(feedItems, this);
        apiManager.fetchDietHistory(feedItems, listAdapter);
        apiManager.fetchStriiv(kcal, steps, distance, this);

        Collections.reverse(feedItems);
        listAdapter.notifyDataSetChanged();
        recyclerView.setAdapter(listAdapter);
    }

    public void populateDummyData() {

        String[] mealNames = {"Bean Burrito", "Pizza", "Caesar Salad"};
        String[] calorieCounts = {"500", "410", "255"};
        String[] mealTypes = {"Bkfast", "Lunch", "Dinner"};
        String[] images = {"@drawable/beefbob.png", "@drawable/best_food", "@drawable/pizza", "@drawable/caesar_salad"};

        for(int i = 0; i < 3; i++) {
            HashMap<String, String> dinner = new HashMap<String, String>();
            dinner.put("mealType", mealTypes[i]);
            dinner.put("monthName", "June");
            dinner.put("date", "25");
            dinner.put("calorieCount", calorieCounts[i]);
            dinner.put("mealName", mealNames[i]);
            dinner.put("mealDescription", "The fat content is 10g. The serving size is 20g. More description metrics to come");
            dinner.put("mealStatus", "OK");

            FeedItem item = new FeedItem(dinner);
            feedItems.add(item);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        listAdapter.notifyDataSetChanged();
    }
}