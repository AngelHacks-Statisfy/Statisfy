package hack.com.anglehack.utils;

import android.content.Context;
import android.util.Log;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonRequest;
import com.android.volley.toolbox.StringRequest;
import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

import hack.com.anglehack.adapters.FeedItem;
import hack.com.anglehack.adapters.FeedListAdapter;
import hack.com.anglehack.constants.Constants;
import hack.com.anglehack.controllers.AppController;

/**
 * Created by david_000 on 6/26/2016.
 */
public class ApiManager {

    public ApiManager() {
    }

    /** Fetch a Striiv Data from Amazon Kinesis. */
    public void fetchStriiv(final TextView kcal, final TextView steps, final TextView distance, Context context) {
        JsonArrayRequest request = new JsonArrayRequest(Constants.FETCH_STRIIV, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray jsonArray) {
                try {
                    JSONObject obj = (JSONObject) jsonArray.get(0);
                    kcal.setText(obj.getString("calories"));
                    steps.setText(obj.getString("totalSteps"));
                    distance.setText(obj.getString("distance"));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError volleyError) {

            }
        });
        AppController.getInstance().addToRequestQueue(request);
    }

    public void fetchNutrition(String foodItem, final TextView kcal, final TextView fat, final TextView overall, final TextView serve_size, final TextView brandName) {
        String nutritionUrl = Constants.NUTRITION + foodItem;
        System.out.println(foodItem);
        GetRequest request = new GetRequest(null, null, nutritionUrl, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                try {
                    kcal.setText(jsonObject.getJSONObject("fields").getString("nf_calories"));
                    fat.setText(jsonObject.getJSONObject("fields").getString("nf_total_fat"));
                    overall.setText(jsonObject.getString("_score"));
                    serve_size.setText(jsonObject.getJSONObject("fields").getString("nf_serving_size_qty"));
                    String brand_name = jsonObject.getJSONObject("fields").getString("item_name") + "\n" + jsonObject.getJSONObject("fields").getString("brand_name");
                    brandName.setText(brand_name);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError volleyError) {
                System.out.println(volleyError);
            }
        });
        AppController.getInstance().addToRequestQueue(request);
    }

    /** Fetch the diet history for this 'fake' user. */
    public void fetchDietHistory(final ArrayList<FeedItem> items, final FeedListAdapter listAdapter) {
        Log.d("FETCH DIET HISTORY", "CALLED fetchDietHistory");
        final JsonArrayRequest request = new JsonArrayRequest(Constants.DIET_HISTORY, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray jsonArray) {
                    Log.d("Respomse", jsonArray.toString());
                String[] mealTypes = {"Dinner", "Lunch", "Bkfast", "Snack"};
                for(int i = 0; i < jsonArray.length(); i++) {
                    Log.d("JSON RESPONSE:", "in for");
                    try {
                        Log.d("Respomse","Respomnse2");
                        JSONObject obj = (JSONObject) jsonArray.get(i);
                        HashMap<String, String> map = new HashMap<String, String>();
                        int randomIndex = (int)(Math.random() * 3);
                        String mealType = mealTypes[randomIndex];
                        map.put("mealType", mealType);
                        map.put("monthName", "June");
                        map.put("date", "26");
                        map.put("calorieCount", Double.toString(Math.floor(obj.getJSONObject("fields").getDouble("nf_calories"))));
                        map.put("mealName", obj.getJSONObject("fields").getString("item_name"));
                        map.put("mealDescription", "The Total fat is: " + Double.toString(obj.getJSONObject("fields").getDouble("nf_total_fat"))+ ". The serving size is " + obj.getJSONObject("fields").getString("nf_serving_size_unit"));
                        map.put("mealStatus", "OK");
                        Log.d("Respomse","Respomnse3");
                        FeedItem item = new FeedItem(map);
                        items.add(item);
                        listAdapter.notifyDataSetChanged();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    System.out.println(items.size());
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println(error);
            }
        });
        AppController.getInstance().addToRequestQueue(request);
    }

    public void fetchDoctors() {

    }

}
