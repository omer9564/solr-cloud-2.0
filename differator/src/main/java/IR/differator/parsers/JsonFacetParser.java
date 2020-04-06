package IR.differator.parsers;

import IR.differator.objects.Day;
import IR.differator.objects.FacetResult;
import org.apache.solr.common.util.NamedList;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class JsonFacetParser {
    private NamedList<Object> responseA;
    private NamedList<Object> responseB;

    private static String RESPONSE = "response";
    private static String FACETS = "facets";
    private static String TIMES = "times";
    private static String BUCKETS = "buckets";
    private static String VAL = "val";
    private static String COUNT = "count";

    public JsonFacetParser(NamedList<Object> responseA, NamedList<Object> responseB) {
        this.responseA = responseA;
        this.responseB = responseB;

    }

    private JSONArray getBucketsSection(NamedList<Object> response) {
        String stringToParse = response.get(RESPONSE).toString();
        return new JSONObject(stringToParse).getJSONObject(FACETS).getJSONObject(TIMES).getJSONArray(BUCKETS);
    }

    private List<Day> getDays(JSONArray bucketSection) {
        List<Day> days = new ArrayList<>();

        int length = bucketSection.length();
        for (int i = 0; i < length; i++) {
            JSONObject bucket = bucketSection.getJSONObject(i);
            Day day = new Day(bucket.getString(VAL), bucket.getInt(COUNT));
            days.add(day);
        }

        return days;
    }

    private void sortDays(List<Day> days) {
        days.sort(Day::compareTo);
    }

    private List<FacetResult> createResults(List<Day> daysA, List<Day> daysB) {
        List<FacetResult> facetResults = new ArrayList<>();
        int length = daysA.size();
        for (int i = 0; i < length; i++) {
            facetResults.add(new FacetResult(daysA.get(i), daysB.get(i)));
        }
        return facetResults;
    }

    public List<FacetResult> getResults() {
        JSONArray bucketSectionA = getBucketsSection(responseA);
        JSONArray bucketSectionB = getBucketsSection(responseB);

        List<Day> daysA = getDays(bucketSectionA);
        List<Day> daysB = getDays(bucketSectionB);

        sortDays(daysA);
        sortDays(daysB);

        return createResults(daysA, daysB);
    }


}
