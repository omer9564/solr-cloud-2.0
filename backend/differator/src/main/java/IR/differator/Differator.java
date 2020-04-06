package IR.differator;

import IR.differator.objects.DebugResult;
import IR.differator.objects.FacetResult;
import IR.differator.parsers.DebugParser;
import IR.differator.parsers.JsonFacetParser;
import IR.differator.solrQuery.SolrDebugQuery;
import IR.differator.solrQuery.SolrJsonFacetQuery;
import org.apache.solr.common.util.NamedList;

import java.util.List;

//TODO: add timeout parameter to the function of performRequest of the class SolrDebugQuery
//TODO: add logs
public class Differator {

    private void exit(Exception e){
        e.printStackTrace();
        throw new RuntimeException(e);
    }

    public List<DebugResult> shardDiffer(String zkHostA, String zkHostB, String collectionA, String collectionB, String fq) {
        SolrDebugQuery solrDebugQueryA = new SolrDebugQuery(zkHostA, collectionA);
        SolrDebugQuery solrDebugQueryB = new SolrDebugQuery(zkHostB, collectionB);

        try {
            NamedList<Object> responseA = solrDebugQueryA.performRequest(fq);
            NamedList<Object> responseB = solrDebugQueryB.performRequest(fq);
            DebugParser parser = new DebugParser(responseA, responseB);

            return parser.getResults();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                solrDebugQueryA.close();
                solrDebugQueryB.close();
            } catch (Exception e) {
                exit(e);
            }
        }
        return null;
    }

    public List<DebugResult> shardDiffer(String zkHostA, String zkHostB, String collectionA, String collectionB) {
        return shardDiffer(zkHostA, zkHostB, collectionA, collectionB, "");
    }

    public List<FacetResult> timeFieldDiffer(String zkHostA, String zkHostB, String collectionA, String collectionB, String fq,
                                             String fieldName, String start, String end, String gap) {
        SolrJsonFacetQuery solrJsonFacetQueryA = new SolrJsonFacetQuery(zkHostA, collectionA);
        SolrJsonFacetQuery solrJsonFacetQueryB = new SolrJsonFacetQuery(zkHostB, collectionB);
        try{
            NamedList<Object> responseA = solrJsonFacetQueryA.performRequest(fieldName, start, end, gap, fq);
            NamedList<Object> responseB = solrJsonFacetQueryB.performRequest(fieldName, start, end, gap, fq);
            JsonFacetParser parser = new JsonFacetParser(responseA, responseB);

            return parser.getResults();
        }
        catch (Exception e){
            e.printStackTrace();
        }
        finally {
            try {
                solrJsonFacetQueryA.close();
                solrJsonFacetQueryB.close();
            }
            catch (Exception e){
                exit(e);
            }
        }
        return null;
    }

    public static void main(String[] args) {

        Differator differator = new Differator();

        String zkHostA = "solr-app:31775";
        String zkHostB = "solr-app:31775";
        String collectionA = "collectionA";
        String collectionB = "collectionB";
        //String fq = "first_timestamp:[2017-01-01T00:00:00Z TO 2017-04-01T00:00:00Z]";
        String fq = "";
        String fieldName = "first_timestamp";
        String start = "2013-06-04T00:00:00Z";
        String end = "2020-03-01T00:00:00Z";
        String gap = "+1DAY";


        /*List<DebugResult> results = IR.differator.shardDiffer(zkHostA, zkHostB, collectionA, collectionB);
        //List<DebugResult> results = IR.differator.shardDiffer(zkHostA, zkHostB, collectionA, collectionB, fq);
        for (DebugResult result : results) {
            System.out.println(result.toString());
        }*/

        List<FacetResult> results = differator.timeFieldDiffer(zkHostA, zkHostB, collectionA, collectionB,
                fq, fieldName, start, end, gap);
        for(FacetResult result : results){
            System.out.println(result.toString());
        }

    }
}
