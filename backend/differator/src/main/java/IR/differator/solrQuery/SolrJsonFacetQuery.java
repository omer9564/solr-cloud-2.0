package IR.differator.solrQuery;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.NoOpResponseParser;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.common.util.NamedList;
import org.json.JSONObject;

import java.io.IOException;

public class SolrJsonFacetQuery {
    private CloudSolrClient solrClient;
    private SolrQuery solrQuery;
    private QueryRequest request;
    private NoOpResponseParser jsonResponseParser;

    private static String REQUEST_HANDLER = "/plain";
    private static String QUERY = "*:*";
    private static String RESPONSE_FORMAT = "json";
    private static String JSON_FACET = "json.facet";

    public SolrJsonFacetQuery(String zkHost, String collection){
        solrClient = new CloudSolrClient.Builder().withZkHost(zkHost).build();
        solrClient.setDefaultCollection(collection);
        solrQuery = new SolrQuery();
        jsonResponseParser = new NoOpResponseParser();
    }

    private JSONObject createJsonFacet(String fieldName, String start, String end, String gap){
        JSONObject outer = new JSONObject();
        JSONObject inner = new JSONObject();
        inner.put("type", "range");
        inner.put("field", fieldName);
        inner.put("start", start);
        inner.put("end", end);
        inner.put("gap", gap);
        outer.put("times", inner);
        return outer;
    }

    private void setQuery(String fieldName, String start, String end, String gap, String fq){
        solrQuery.setRequestHandler(REQUEST_HANDLER);
        solrQuery.setQuery(QUERY);
        solrQuery.add(JSON_FACET, createJsonFacet(fieldName, start, end, gap).toString());
        solrQuery.setFilterQueries(fq.isEmpty() ? null : fq);
    }

    private void generateJsonRequest(){
        request = new QueryRequest(solrQuery);
        jsonResponseParser.setWriterType(RESPONSE_FORMAT);
        request.setResponseParser(jsonResponseParser);
    }

    public NamedList<Object> performRequest(String fieldName, String start, String end, String gap, String fq) throws IOException, SolrServerException {
        setQuery(fieldName, start, end, gap, fq);
        generateJsonRequest();
        return solrClient.request(request);
    }

    public void close() throws IOException {
        solrClient.close();
    }


}
