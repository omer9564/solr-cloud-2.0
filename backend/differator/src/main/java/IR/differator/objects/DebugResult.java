package IR.differator.objects;


import org.json.JSONObject;

public class DebugResult {
    private Shard shardSrc;
    private Shard shardDst;

    private static String SHARD_PREFIX = "shard: ";
    private static String COMMA = ",";
    private static String SRC = "src: ";
    private static String DST = "dst: ";
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

    public JSONObject toJson(){
        JSONObject result = new JSONObject();
        result.put(SHARD_PREFIX, shardSrc.getName());
        result.put(SRC, shardSrc.getNumDocs());
        result.put(DST, shardDst.getNumDocs());
        return result;
    }

}
