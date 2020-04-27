package IR.differator.objects;

import org.json.JSONObject;

public class FacetResult {
    private Interval srcInterval;
    private Interval dstInterval;

    private static String FIELD = "field";
    private static String SRC = "src";
    private static String DST = "dst";
    private static String DIFF = "diff";

    public FacetResult(Interval srcInterval, Interval dstInterval){
        this.srcInterval = srcInterval;
        this.dstInterval = dstInterval;
    }

    @Override
    public String toString() {
        return null;
        /*String PREFIX = START_DAY + daySrc.getDate() + TAB + END_DAY + daySrc.getNextDate() + TAB
                + NUM_SRC + daySrc.getNumDocs() + TAB + NUM_DST + dayDst.getNumDocs();

        String TMP_SUFFIX = (daySrc.getNumDocs() > dayDst.getNumDocs()) ?
                GREATER + String.valueOf(daySrc.getNumDocs() - dayDst.getNumDocs()) :
                SMALLER + String.valueOf(dayDst.getNumDocs() - daySrc.getNumDocs());

        String SUFFIX = (daySrc.getNumDocs() != dayDst.getNumDocs()) ?
                TMP_SUFFIX : EQUAL;

        return PREFIX + TAB + SUFFIX;*/
    }

    public JSONObject toJson(){
        var intervalAsString = srcInterval.getIntervalAsString();
        var srcDocNum = srcInterval.getNumDocs();
        var dstDocNum = dstInterval.getNumDocs();
        var result = new JSONObject();
        result.put(FIELD, intervalAsString);
        result.put(SRC, srcDocNum);
        result.put(DST, dstDocNum);
        result.put(DIFF, srcDocNum - dstDocNum);
        return result;
    }
}
