package hack.com.anglehack.adapters;

import android.content.Context;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;

import hack.com.anglehack.R;

/**
 * Created by david_000 on 6/26/2016.
 */
public class FeedListAdapter <T extends FeedItem> extends RecyclerView.Adapter<FeedListAdapter.ViewHolder> {

    /** The list of FeedItems, or meal items. */
    private ArrayList<T> items;
    private Context mContext;

    public FeedListAdapter(ArrayList<T> items, Context context) {
        this.items = items;
        mContext = context;
    }

    @Override
    public FeedListAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.feed_item, parent, false);
        final ViewHolder vh = new ViewHolder(v);
        return vh;
    }

    @Override
    public void onBindViewHolder(FeedListAdapter.ViewHolder holder, int position) {
        String[] images = {"@drawable/beefbob.png", "@drawable/best_food", "@drawable/pizza", "@drawable/caesar_salad"};


        FeedItem item = items.get(position);
        String mealType = item.mealType;
        String monthName = item.monthName;
        String date = item.date;
        String calorieCount = item.calorieCount;
        String mealName = item.mealName;
        String mealDescription = item.mealDescription;
        String mealStatus = item.mealStatus;

        ImageView imgView = holder.imgView;
        TextView mealTypeView = holder.mealType;
        TextView monthNameView = holder.monthName;
        TextView dateView = holder.date;
        TextView calorieCountView = holder.calorieCount;
        TextView mealNameView = holder.mealName;
        TextView mealDescriptionView = holder.mealDescription;
        TextView mealStatusView = holder.mealStatus;

        mealTypeView.setText(mealType);
        monthNameView.setText(monthName);
        dateView.setText(date);
        calorieCountView.setText(calorieCount);
        mealNameView.setText(mealName);
        mealDescriptionView.setText(mealDescription);
        mealStatusView.setText(mealStatus);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public CardView mCardView;
        public ImageView imgView;
        public TextView mealType;
        public TextView monthName;
        public TextView date;
        public TextView calorieCount;
        public TextView mealName;
        public TextView mealDescription;
        public TextView mealStatus;

        public ViewHolder(View itemView) {
            super(itemView);
            mCardView = (CardView)itemView.findViewById(R.id.card_view);
            imgView = (ImageView)itemView.findViewById(R.id.image_view);
            mealType = (TextView)itemView.findViewById(R.id.meal_type);
            monthName = (TextView)itemView.findViewById(R.id.month_name);
            date = (TextView)itemView.findViewById(R.id.date);
            calorieCount = (TextView)itemView.findViewById(R.id.calorie_count);
            mealName = (TextView)itemView.findViewById(R.id.meal_name);
            mealDescription = (TextView)itemView.findViewById(R.id.meal_description);
            mealStatus = (TextView)itemView.findViewById(R.id.meal_status);
        }
    }
}
