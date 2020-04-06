package IR.differator.objects;

import org.json.JSONObject;

public class FacetResult {
    private Day daySrc;
    private Day dayDst;

    private static String START_DAY = "StartDay: ";
    private static String END_DAY = "EndDay: ";
    private static String COMMA = ",";
    private static String TAB = "\t";
    private static String NUM_SRC = "NumInSrc: ";
    private static String NUM_DST = "NumInDst: ";

    private static String EQUAL = "src is equal to dst";
    private static String GREATER = "src is greater than dst in: ";
    private static String SMALLER = "src is smaller than dst in: ";


    public FacetResult(Day daySrc, Day dayDst){
        this.daySrc = daySrc;
        this.dayDst = dayDst;
    }

    @Override
    public String toString() {
        String PREFIX = START_DAY + daySrc.getDate() + TAB + END_DAY + daySrc.getNextDate() + TAB
                + NUM_SRC + daySrc.getNumDocs() + TAB + NUM_DST + dayDst.getNumDocs();

        String TMP_SUFFIX = (daySrc.getNumDocs() > dayDst.getNumDocs()) ?
                GREATER + String.valueOf(daySrc.getNumDocs() - dayDst.getNumDocs()) :
                SMALLER + String.valueOf(dayDst.getNumDocs() - daySrc.getNumDocs());

        String SUFFIX = (daySrc.getNumDocs() != dayDst.getNumDocs()) ?
                TMP_SUFFIX : EQUAL;

        return PREFIX + TAB + SUFFIX;
    }

    public JSONObject toJson(){
        JSONObject result = new JSONObject();
        result.put(START_DAY, daySrc.getDate());
        result.put(END_DAY, daySrc.getNextDate());
        result.put(NUM_SRC, daySrc.getNumDocs());
        result.put(NUM_DST, dayDst.getNumDocs());
        return result;
    }
}
