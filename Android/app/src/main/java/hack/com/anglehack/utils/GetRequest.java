package hack.com.anglehack.utils;


import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.ParseError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.toolbox.HttpHeaderParser;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.Map;

/**
 * Created by david_000 on 12/26/2015.
 */
public class GetRequest extends Request<JSONObject> {

    private Map<String, String> mParams;
    private Map<String, String> mHeaders;
    private Response.Listener<JSONObject> mListener;

    public GetRequest(Map<String, String> headers, Map<String, String> params, String customUrl, Response.Listener<JSONObject> listener,
                      Response.ErrorListener errorListener ) {
        super(Method.GET, customUrl, errorListener);
        mListener = listener;
        mParams = params;
        mHeaders = headers;
    }

    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        return mHeaders != null ? mHeaders : super.getHeaders();
    }

    @Override
    public Map<String, String> getParams() throws AuthFailureError {
        return mParams != null ? mParams: super.getParams();
    }

    @Override
    protected Response<JSONObject> parseNetworkResponse(NetworkResponse networkResponse) {
        try {
            String json = new String(
                    networkResponse.data,
                    HttpHeaderParser.parseCharset(networkResponse.headers));
            return Response.success (
                    new JSONObject(json),
                    HttpHeaderParser.parseCacheHeaders(networkResponse)
            );
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return Response.error(new ParseError(e));
        } catch (JSONException e) {
            e.printStackTrace();
            return Response.error(new ParseError(e));
        }
    }

    @Override
    protected void deliverResponse(JSONObject jsonObject) {
        mListener.onResponse(jsonObject);
    }
}
