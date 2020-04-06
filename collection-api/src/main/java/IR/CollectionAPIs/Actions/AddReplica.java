package IR.CollectionAPIs.Actions;

import org.apache.solr.client.solrj.SolrRequest;
import org.apache.solr.client.solrj.SolrResponse;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.request.CollectionAdminRequest;
import org.apache.solr.client.solrj.request.GenericSolrRequest;
import org.apache.solr.common.params.ModifiableSolrParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.lang.invoke.MethodHandles;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * {@link SolrAction} this is a class that expose a add replica to collection API
 *
 * @see SolrAction
 */
public class AddReplica implements SolrAction {
    private static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private String collectionName;
    private String shard;
    private String node;
    private CloudSolrClient solrClient;

    public AddReplica(CloudSolrClient solrClient) {
        this.solrClient = solrClient;
    }

    public AddReplica setCollectionName(String collectionName) {
        this.collectionName = collectionName;
        return this;
    }

    public AddReplica setShard(String shard) {
        this.shard = shard;
        return this;
    }

    public AddReplica setNode(String node) {
        this.node = node;
        return this;
    }

    @SuppressWarnings("Duplicates")
    @Override
    public SolrResponse execute() throws IOException, SolrServerException, RuntimeException {
        var solrAdminCommand = CollectionAdminRequest.addReplicaToShard(collectionName, shard)
                .setNode(node);
        logger.info("generated add replica request");
        var params = new ModifiableSolrParams(solrAdminCommand.getParams())
                .set("password", new SimpleDateFormat("ddMMyy").format(new Date()));
        logger.info("added password to request");
        try {
            var response = new GenericSolrRequest(SolrRequest.METHOD.GET, solrAdminCommand.getPath(), params)
                    .process(solrClient);
            logger.info("received a response: " + response.getResponse().toString());
            return response;
        } catch (SolrServerException | IOException | RuntimeException e) {
            logger.error("Could not process request: " + e.getMessage(), e);
            throw e;
        }
    }
}