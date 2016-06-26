package hack.com.anglehack.adapters;

import java.util.HashMap;

/**
 * Created by david_000 on 6/25/2016.
 */
public class FeedItem {
    public String mealType;
    public String monthName;
    public String date;
    public String calorieCount;
    public String mealName;
    public String mealDescription;
    public String mealStatus;

    public FeedItem(HashMap<String, String> params) {
        this.mealType = params.get("mealType");
        this.monthName = params.get("monthName");
        this.date = params.get("date");
        this.calorieCount = params.get("calorieCount");
        this.mealName = params.get("mealName");
        this.mealDescription = params.get("mealDescription");
        this.mealStatus = params.get("mealStatus");
    }
}
