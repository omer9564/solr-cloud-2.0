package IR.differator.solrQuery;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.NoOpResponseParser;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.common.util.NamedList;

import java.io.IOException;

public class SolrDebugQuery {
    private CloudSolrClient solrClient;
    private SolrQuery solrQuery;
    private QueryRequest request;
    private NoOpResponseParser jsonResponseParser;

    private static String REQUEST_HANDLER = "/plain";
    private static String QUERY = "*:*";
    private static String RESPONSE_FORMAT = "json";

    public SolrDebugQuery(String zkHost, String collection){
        solrClient = new CloudSolrClient.Builder().withZkHost(zkHost).build();
        solrClient.setDefaultCollection(collection);
        solrQuery = new SolrQuery();
        jsonResponseParser = new NoOpResponseParser();
    }
    /**
     * lets explain -
     * We need to query a request handler that has no authentication component, this is why we choose "plain".
     * In order to create ArrayList of shard, we query in debug mode.
     * In the default mode, you need no change in the query, so query is *:*.
     * */
    private void setQuery(String fq){
        solrQuery.setRequestHandler(REQUEST_HANDLER);
        solrQuery.setShowDebugInfo(true);
        solrQuery.setQuery(QUERY);
        solrQuery.setFilterQueries(fq.isEmpty() ? null : fq);

    }

    private void generateJsonRequest(){
        request = new QueryRequest(solrQuery);
        jsonResponseParser.setWriterType(RESPONSE_FORMAT);
        request.setResponseParser(jsonResponseParser);
    }

    public NamedList<Object> performRequest(String fq) throws IOException, SolrServerException{
        setQuery(fq);
        generateJsonRequest();
        return solrClient.request(request);
    }

    public void close() throws IOException{
        solrClient.close();
    }

}