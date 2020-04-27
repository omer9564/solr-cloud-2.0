package IR.differator;

import IR.differator.objects.DebugResult;
import IR.differator.objects.FacetResult;
import IR.differator.parsers.DebugParser;
import IR.differator.parsers.JsonFacetParser;
import IR.differator.solrQuery.SolrDebugQuery;
import IR.differator.solrQuery.SolrJsonFacetQuery;
import org.apache.solr.common.util.NamedList;

import java.util.List;

//TODO: add logs

/**
 * currently differ only 2 solr-cloud instances from solr 6.5.1 version
 */
public class Differator {
    private static Differator single_instance = null;

    private Differator(){}

    public static Differator getInstance(){
        if(single_instance == null){
            single_instance = new Differator();
        }
        return single_instance;
    }

    private void exit(Exception e){
        e.printStackTrace();
        throw new RuntimeException(e);
    }

    public List<DebugResult> shardDiffer(String zkSrc, String zkDst, String collectionSrc, String collectionDst,
                                         String fq, int queryTimeout, String responseFormat, int httpTimeout,
                                         int zkConnectTimeout, int zkClientTimeout) {
        var solrDebugQuerySrc = new SolrDebugQuery(zkSrc, collectionSrc, responseFormat, httpTimeout, zkConnectTimeout,
                zkClientTimeout);
        var solrDebugQueryDst = new SolrDebugQuery(zkDst, collectionDst, responseFormat, httpTimeout, zkConnectTimeout,
                zkClientTimeout);

        try {
            var srcResponse = solrDebugQuerySrc.performRequest(fq, queryTimeout);
            var dstResponse = solrDebugQueryDst.performRequest(fq, queryTimeout);
            var parser = new DebugParser();
            return parser.getResults(srcResponse, dstResponse);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                solrDebugQuerySrc.close();
                solrDebugQueryDst.close();
            } catch (Exception e) {
                exit(e);
            }
        }
        return null;
    }

    public List<DebugResult> shardDiffer(String zkSrc, String zkDst, String collectionSrc, String collectionDst) {
        return shardDiffer(zkSrc, zkDst, collectionSrc, collectionDst, "", 60000, "json",
                60000, 10000, 1000);
    }

    private int getGap(String gap){
        String onlyNum = gap.replaceAll("\\D+","");
        return Integer.parseInt(onlyNum);
    }

    public List<FacetResult> timeFieldDiffer(String zkSrc, String zkDst, String collectionSrc, String collectionDst, String fq,
                                             String fieldName, String start, String end, String gap, int queryTimeout,
                                             String responseFormat, int httpTimeout, int zkConnectTimeout, int zkClientTimeout) {
        var solrJsonFacetQuerySrc = new SolrJsonFacetQuery(zkSrc, collectionSrc, responseFormat, httpTimeout, zkConnectTimeout,
                zkClientTimeout);
        var solrJsonFacetQueryDst = new SolrJsonFacetQuery(zkDst, collectionDst, responseFormat, httpTimeout, zkConnectTimeout,
                zkClientTimeout);
        try{
            var srcResponse = solrJsonFacetQuerySrc.performRequest(fieldName, start, end, gap, fq, queryTimeout);
            var dstResponse = solrJsonFacetQueryDst.performRequest(fieldName, start, end, gap, fq, queryTimeout);
            var parser = new JsonFacetParser();
            return parser.getResults(srcResponse, dstResponse, getGap(gap));
        }
        catch (Exception e){
            e.printStackTrace();
        }
        finally {
            try {
                solrJsonFacetQuerySrc.close();
                solrJsonFacetQueryDst.close();
            }
            catch (Exception e){
                exit(e);
            }
        }
        return null;
    }

    public List<FacetResult> timeFieldDiffer(String zkSrc, String zkDst, String collectionSrc, String collectionDst, String fq,
                                             String fieldName, String start, String end, String gap){
        return timeFieldDiffer(zkSrc, zkDst, collectionSrc, collectionDst, fq, fieldName, start, end, gap, 60000,
                "json", 60000, 10000, 1000);
    }

    public static void shardExample(Differator differator, String zkSrc, String zkDst, String collectionSrc,
                                     String collectionDst){
        //String fq = "first_timestamp:[2017-01-01T00:00:00Z TO 2017-04-01T00:00:00Z]";
        List<DebugResult> results = differator.shardDiffer(zkSrc, zkDst, collectionSrc, collectionDst);
        for (DebugResult result : results) {
            System.out.println(result.toJson());
        }
    }

    public static void timeExample(Differator differator, String zkSrc, String zkDst, String collectionSrc,
                                   String collectionDst){
        String fq = "";
        String fieldName = "first_timestamp_tdt";
        String start = "2017-06-03T00:00:00Z";
        String end = "2017-06-05T00:00:00Z";
        String gap = "+1DAY";
        List<FacetResult> results = differator.timeFieldDiffer(zkSrc, zkDst, collectionSrc, collectionDst,
                fq, fieldName, start, end, gap);
        for(FacetResult result : results){
            System.out.println(result.toJson());
        }
    }

    public static void main(String[] args) {
        Differator differator = new Differator();
        String zkSrc = "localhost:9983";
        String zkDst = "localhost:9983";
        String collectionSrc = "gettingstarted";
        String collectionDst = "gettingstarted";

        //shardExample(differator, zkSrc, zkDst, collectionSrc, collectionDst);
        timeExample(differator, zkSrc, zkDst, collectionSrc, collectionDst);
    }
}
