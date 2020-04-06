package IR.CollectionAPIs.Actions;

import org.apache.solr.client.solrj.SolrResponse;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.lang.invoke.MethodHandles;

/**
 * {@link SolrAction} this is a class that expose a commit collection API
 *
 * @see SolrAction
 */
public class Commit implements SolrAction {
    private static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private String collectionName;
    private CloudSolrClient solrClient;

    public Commit(CloudSolrClient solrClient) {
        this.solrClient = solrClient;
    }
    public Commit setCollectionName(String collectionName) {
        this.collectionName = collectionName;
        return this;
    }

    @Override
    public SolrResponse execute() throws IOException, SolrServerException, RuntimeException {
        try {
            var response = solrClient.commit(collectionName);
            logger.info("received a respond: " + response.getResponse().toString());
            return response;
        } catch (SolrServerException | IOException | RuntimeException e) {
            logger.error("Could not process request: " + e.getMessage(), e);
            throw e;
        }
    }
}