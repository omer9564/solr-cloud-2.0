package IR.differator.objects;


import org.json.JSONObject;

public class DebugResult {
    private Shard shardSrc;
    private Shard shardDst;

    private static String FIELD = "field";
    private static String SRC = "src";
    private static String DST = "dst";
    private static String DIFF = "diff";

    private static String SHARD_PREFIX = "shard: ";
    private static String COMMA = ",";
    private static String EQUAL = "src is equal to dst";
    private static String GREATER = "src is greater than dst in: ";
    private static String SMALLER = "src is smaller than dst in: ";
    private static String TAB = "\t";

    public DebugResult(Shard shardSrc, Shard shardDst){
        this.shardSrc = shardSrc;
        this.shardDst = shardDst;
    }

    public String toString(){
        String PREFIX = SHARD_PREFIX + shardSrc.getName() + COMMA + SRC + shardSrc.getNumDocs() + TAB
                + DST + shardDst.getNumDocs();

        String TMP_SUFFIX = (shardSrc.getNumDocs() > shardDst.getNumDocs()) ?
                GREATER + String.valueOf(shardSrc.getNumDocs() - shardDst.getNumDocs()) :
                SMALLER + String.valueOf(shardDst.getNumDocs() - shardSrc.getNumDocs());

        String SUFFIX = (shardSrc.getNumDocs() != shardDst.getNumDocs()) ?
                TMP_SUFFIX : EQUAL;

        return PREFIX + TAB + SUFFIX;
    }

    /**
     * our result to the frontend should look like this -
     *      [
     *          {
     *              "field": "shard1",
     * 		        "src": "1048",
     * 		        "dst": "1048",
     * 		        "diff" : 0
     *          },
     *          {
     *              "field": "shard2",
     * 		        "src": "10485",
     * 		        "dst": "10486",
     * 		        "diff" : -1
     *          },
     *          {
     *              "field": "shard3",
     * 		        "src": "10483",
     * 		        "dst": "10482",
     * 		        "diff" : 0
     *          },
     *      ]
     * notice that the diff value is always src - dst
     * @return
     */
    public JSONObject toJson(){
        var srcDocNum = shardSrc.getNumDocs();
        var dstDocNum = shardDst.getNumDocs();
        var result = new JSONObject();
        result.put(FIELD, shardSrc.getName());
        result.put(SRC, srcDocNum);
        result.put(DST, dstDocNum);
        result.put(DIFF, srcDocNum - dstDocNum);
        return result;
    }

}
