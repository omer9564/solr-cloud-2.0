package IR.CollectionAPIs.Actions;

import IR.CollectionAPIs.SolrCollectionsAPI;
import org.apache.solr.client.solrj.SolrResponse;
import org.apache.solr.client.solrj.SolrServerException;

import java.io.IOException;

/**
 * This is an interface for the action available in {@link SolrCollectionsAPI}
 */
public interface SolrAction {
    /**
     * execute a request
     *
     * @return response of the request
     */
    SolrResponse execute() throws IOException, SolrServerException, RuntimeException;
}