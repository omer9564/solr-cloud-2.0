package IR.differator.parsers;

import IR.differator.objects.FacetResult;
import IR.differator.objects.Interval;
import org.apache.solr.common.util.NamedList;
import org.json.JSONArray;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;

public class JsonFacetParser {
    private static SimpleDateFormat format;
    private static Calendar calendar;

    private static String RESPONSE = "response";
    private static String FACETS = "facets";
    private static String TIMES = "times";
    private static String BUCKETS = "buckets";
    private static String VAL = "val";
    private static String COUNT = "count";

    public JsonFacetParser(){
        format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        calendar = Calendar.getInstance();
    }

    private JSONArray getBucketsSection(NamedList<Object> response) {
        var stringToParse = response.get(RESPONSE).toString();
        return new JSONObject(stringToParse).getJSONObject(FACETS).getJSONObject(TIMES).getJSONArray(BUCKETS);
    }

    private Date getStartDate(String startDate) throws ParseException {
        return format.parse(startDate);
    }

    private Date getEndDate(String startDate, int gap) throws ParseException{
        calendar.setTime(format.parse(startDate));
        calendar.add(Calendar.DATE, gap);
        return calendar.getTime();
    }

    private String getEndDateAsString(String startDate, int gap) throws ParseException{
        calendar.setTime(format.parse(startDate));
        calendar.add(Calendar.DATE, gap);
        return format.format(calendar.getTime());
    }

    private List<Interval> getIntervals(JSONArray bucketSection, int gap) throws ParseException{
        List<Interval> intervals = new ArrayList<>();
        int length = bucketSection.length();
        for (int i = 0; i < length; i++) {
            JSONObject bucket = bucketSection.getJSONObject(i);

            String startDate = bucket.getString(VAL);
            String endDate = getEndDateAsString(startDate, gap);
            Date start = getStartDate(startDate);
            Date end = getEndDate(startDate, gap);
            int numDocs = bucket.getInt(COUNT);

            Interval interval = new Interval(start, end, startDate, endDate, numDocs);
            intervals.add(interval);
        }

        return intervals;
    }

    private void sortIntervals(List<Interval> intervals){
        intervals.sort(Interval::compareTo);
    }

    private List<FacetResult> createResults(List<Interval> srcIntervals, List<Interval> dstIntervals) {
        List<FacetResult> facetResults = new ArrayList<>();
        int length = srcIntervals.size();
        for (int i = 0; i < length; i++) {
            facetResults.add(new FacetResult(srcIntervals.get(i), dstIntervals.get(i)));
        }
        return facetResults;
    }

    public List<FacetResult> getResults(NamedList<Object> srcResponse, NamedList<Object> dstResponse, int gap) throws ParseException {
        var srcBucketSection = getBucketsSection(srcResponse);
        var dstBucketSection = getBucketsSection(dstResponse);

        var srcIntervals = getIntervals(srcBucketSection, gap);
        var dstIntervals = getIntervals(dstBucketSection, gap);

        sortIntervals(srcIntervals);
        sortIntervals(dstIntervals);

        return createResults(srcIntervals, dstIntervals);
    }


}
