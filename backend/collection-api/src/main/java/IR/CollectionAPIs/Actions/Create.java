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
import java.util.List;

/**
 * {@link SolrAction} this is a class that expose a create collection API
 *
 * @see SolrAction
 */
public class Create implements SolrAction {
    private static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private String collectionName;
    private String config;
    private boolean shuffleNodeSet = false;
    private int numShards;
    private int numReplicas;
    private CloudSolrClient solrClient;
    private List<String> createNodeSet;
    private List<String> shards;

    public Create(CloudSolrClient solrClient) {
        this.solrClient = solrClient;
    }

    public Create setCollectionName(String collectionName) {
        this.collectionName = collectionName;
        return this;
    }

    public Create setShuffleNodeSet(boolean shuffle) {
        this.shuffleNodeSet = shuffle;
        return this;
    }

    public Create setConfig(String config) {
        this.config = config;
        return this;
    }

    public Create setNumShards(int numShards) {
        this.numShards = numShards;
        return this;
    }

    public Create setNumReplicas(int numReplicas) {
        this.numReplicas = numReplicas;
        return this;
    }

    public Create setShardNames(List<String> shards) {
        this.shards = shards;
        return this;
    }

    public Create setCreateNodeSet(List<String> createNodeSet) {
        this.createNodeSet = createNodeSet;
        return this;
    }

    @SuppressWarnings("Duplicates")
    @Override
    public SolrResponse execute() throws IOException, SolrServerException, RuntimeException {
        var solrAdminCommandBase = CollectionAdminRequest.createCollection(collectionName, config, numShards, numReplicas);
        if (shards != null) {
            solrAdminCommandBase.setShards(String.join(",", shards));
        }
        if (createNodeSet != null) {
            solrAdminCommandBase.setCreateNodeSet(String.join(",", createNodeSet));
        }
        logger.info("generated create collection request");
        var params = new ModifiableSolrParams(solrAdminCommandBase.getParams())
                .set("password", new SimpleDateFormat("ddMMyy").format(new Date()))
                .set("createNodeSet.shuffle", shuffleNodeSet);
        logger.info("add password and nodeSet.shuffle parameters to request");

        try {
            var response = new GenericSolrRequest(SolrRequest.METHOD.GET, solrAdminCommandBase.getPath(), params)
                    .process(solrClient);
            logger.info("received a respond: " + response.getResponse().toString());
            return response;
        } catch (SolrServerException | IOException | RuntimeException e) {
            logger.error("Could not process request: " + e.getMessage(), e);
            throw e;
        }
    }
}
