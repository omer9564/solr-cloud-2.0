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
import java.util.Collection;
import java.util.Date;

/**
 * {@link SolrAction} this is a class that expose a creation of alias API
 *
 * @see SolrAction
 */
public class CreateAlias implements SolrAction {
    private static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private String collectionName;
    private String aliasName;
    private CloudSolrClient solrClient;

    public CreateAlias(CloudSolrClient solrClient) {
        this.solrClient = solrClient;
    }

    public CreateAlias setCollectionsName(Collection<String> collectionName) {
        this.collectionName = String.join(",", collectionName);
        return this;
    }

    public CreateAlias setAliasName(String aliasName) {
        this.aliasName = aliasName;
        return this;
    }

    @SuppressWarnings("Duplicates")
    @Override
    public SolrResponse execute() throws IOException, SolrServerException, RuntimeException {
        var solrAdminCommand = CollectionAdminRequest.createAlias(aliasName, collectionName);
        logger.info("created alias creation request");
        var params = new ModifiableSolrParams(solrAdminCommand.getParams())
                .set("password", new SimpleDateFormat("ddMMyy").format(new Date()));
        logger.info("added password to request");
        try {
            var response = new GenericSolrRequest(SolrRequest.METHOD.GET, solrAdminCommand.getPath(), params)
                    .process(solrClient);
            logger.info("received a respond: " + response.getResponse().toString());
            return response;
        } catch (SolrServerException | IOException | RuntimeException e) {
            logger.error("Could not process request: " + e.getMessage(), e);
            throw e;
        }
    }
}