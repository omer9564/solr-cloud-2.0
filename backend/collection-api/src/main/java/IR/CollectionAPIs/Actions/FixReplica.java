package IR.CollectionAPIs.Actions;

import IR.CollectionAPIs.SolrCollectionsAPI;
import org.apache.solr.client.solrj.SolrResponse;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.common.util.NamedList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.lang.invoke.MethodHandles;

/**
 * {@link SolrAction} this is a class that expose a fix replica(remove it and recreate it) to collection API
 *
 * @see SolrAction
 */
public class FixReplica implements SolrAction {
    private static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private String collectionName;
    private String shard;
    private String replica;
    private SolrCollectionsAPI solrCollectionsAPI;

    public FixReplica(SolrCollectionsAPI solrCollectionsAPI) {
        this.solrCollectionsAPI = solrCollectionsAPI;
    }

    public FixReplica setCollectionName(String collectionName) {
        this.collectionName = collectionName;
        return this;
    }

    public FixReplica setShard(String shard) {
        this.shard = shard;
        return this;
    }

    public FixReplica setReplica(String replica) {
        this.replica = replica;
        return this;
    }

    @Override
    public SolrResponse execute() throws IOException, SolrServerException, RuntimeException {
        logger.info("start fix replica");
        var removeResponse = solrCollectionsAPI.deleteReplica()
                .setCollectionName(collectionName)
                .setShard(shard)
                .setReplica(replica).execute();
        var successValue = (NamedList)removeResponse.getResponse().get("success");

        if (successValue == null) {
            return removeResponse;
        }
        logger.info("successfully deleted replica: " + removeResponse.getResponse().toString() + ", starting recreating it");

        var node = successValue.asShallowMap().keySet().stream().findFirst().get().toString();
        var response = solrCollectionsAPI.addReplica()
                .setCollectionName(collectionName)
                .setShard(shard)
                .setNode(node)
                .execute();
        logger.info("received a create replica respond: " + response.getResponse().toString());
        return response;
    }
}