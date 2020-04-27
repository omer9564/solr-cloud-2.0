package IR.differator.solrQuery;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.NoOpResponseParser;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.common.util.NamedList;
import org.json.JSONObject;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class SolrJsonFacetQuery {
    private CloudSolrClient solrClient;

    //todo - add to config file
    private static String REQUEST_HANDLER = "/select";
    private static String QUERY = "*:*";
    private static String JSON_FACET = "json.facet";

    private static String TYPE = "type";
    private static String FIELD = "field";
    private static String START = "start";
    private static String END = "end";
    private static String GAP = "gap";
    private static String TIMES = "times";


    public SolrJsonFacetQuery(String zkHost, String collection, String responseFormat, int httpTimeout,
                              int zkConnectTimeout, int zkClientTimeout){
        solrClient = new CloudSolrClient.Builder().withZkHost(zkHost).build();
        solrClient.setDefaultCollection(collection);
        var responseParser = new NoOpResponseParser();
        responseParser.setWriterType(responseFormat);
        solrClient.setParser(responseParser);
        solrClient.setSoTimeout(httpTimeout);
        solrClient.setZkConnectTimeout(zkConnectTimeout);
        solrClient.setZkClientTimeout(zkClientTimeout);
    }

    private JSONObject createJsonFacet(String fieldName, String start, String end, String gap){
        var outer = new JSONObject();
        var inner = new JSONObject();
        inner.put(TYPE, "range");
        inner.put(FIELD, fieldName);
        inner.put(START, start);
        inner.put(END, end);
        inner.put(GAP, gap);
        outer.put(TIMES, inner);
        return outer;
    }

    private SolrQuery createSolrQuery(String fieldName, String start, String end, String gap, String fq, int timeout) throws ParseException{
        var solrQuery = new SolrQuery();
        solrQuery.setRequestHandler(REQUEST_HANDLER);
        solrQuery.setQuery(QUERY);
        solrQuery.setFilterQueries(fq.isEmpty() ? null : fq);
        solrQuery.add(JSON_FACET, createJsonFacet(fieldName, start, end, gap).toString());
        solrQuery.setRows(0);
        solrQuery.setTimeAllowed(timeout);
        return solrQuery;
    }

    private QueryRequest createQueryRequest(SolrQuery solrQuery){
        var queryRequest = new QueryRequest(solrQuery);
        return queryRequest;
    }

    public NamedList<Object> performRequest(String fieldName, String start, String end, String gap, String fq,
                                            int timeout) throws IOException, SolrServerException, ParseException {
        var solrQuery = createSolrQuery(fieldName, start, end, gap, fq, timeout);
        var queryRequest = createQueryRequest(solrQuery);
        return solrClient.request(queryRequest);
    }

    public void close() throws IOException {
        solrClient.close();
    }


}
