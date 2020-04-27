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

    //todo - add to config file
    private static String REQUEST_HANDLER = "/select";
    private static String QUERY = "*:*";

    /**
     * init solr client, set collection, responseParser and various timeouts
     * @param zkHost - the zk of cluster, for example zootest01
     * @param collection
     * @param responseFormat - json, xml
     * @param httpTimeout - timeout for http requests made by out solr client
     * @param zkConnectTimeout - timeout until establish connection with zk
     * @param zkClientTimeout - timeout until receiving a packet
     */
    public SolrDebugQuery(String zkHost, String collection, String responseFormat, int httpTimeout,
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

    /**
     * lets explain -
     *      We need to query a request handler that has no authentication component, this is why we choose "select".
     *      In order to create List of shard, we query in debug mode.
     *      In the default mode, you need no change in the query, so query is *:*.
     *      Rows are 0 because we need no document at all
     * @param fq - extra filter queries if needed
     * @param timeout - timeout for this query (in my opinion it is equal to httpTimeout in solrClient.setSoTimeout(httpTimeout)
     *                so the values of both are the same)
     * @return
     */
    private SolrQuery createSolrQuery(String fq, int timeout){
        var solrQuery = new SolrQuery();
        solrQuery.setRequestHandler(REQUEST_HANDLER);
        solrQuery.setShowDebugInfo(true);
        solrQuery.setQuery(QUERY);
        solrQuery.setFilterQueries(fq.isEmpty() ? null : fq);
        solrQuery.setRows(0);
        solrQuery.setTimeAllowed(timeout);
        return solrQuery;
    }

    private QueryRequest createQueryRequest(SolrQuery solrQuery){
        var queryRequest = new QueryRequest(solrQuery);
        return queryRequest;
    }

    public NamedList<Object> performRequest(String fq, int timeout) throws IOException, SolrServerException{
        var solrQuery = createSolrQuery(fq, timeout);
        var queryRequest = createQueryRequest(solrQuery);
        return solrClient.request(queryRequest);
    }

    public void close() throws IOException{
        solrClient.close();
    }

}