package IR.CollectionAPIs;

import IR.CollectionAPIs.Actions.*;
import org.apache.solr.client.solrj.impl.CloudSolrClient;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class SolrCollectionsAPI {
    private static final String LIVE_NODES_PATH = "/live_nodes";

    private List<String> zkHosts;
    private CloudSolrClient solrClient;

    public SolrCollectionsAPI(String zkHost) {
        this.zkHosts = Collections.singletonList(zkHost);
        this.solrClient = new CloudSolrClient.Builder(this.zkHosts, Optional.empty()).build();
    }

    public SolrCollectionsAPI(List<String> zkHosts) {
        this.zkHosts = zkHosts;
        this.solrClient = new CloudSolrClient.Builder(this.zkHosts, Optional.empty()).build();
    }

    public SolrCollectionsAPI(String zkHost, String solrChroot) {
        this.zkHosts = Collections.singletonList(zkHost);
        this.solrClient = new CloudSolrClient.Builder(this.zkHosts, Optional.of(solrChroot)).build();
    }

    public SolrCollectionsAPI(List<String> zkHosts, String solrChroot) {
        this.zkHosts = zkHosts;
        this.solrClient = new CloudSolrClient.Builder(this.zkHosts, Optional.of(solrChroot)).build();
    }

    public Create createCollection() {
        return new Create(solrClient);
    }

    public Delete deleteCollection() {
        return new Delete(solrClient);
    }

    public AddReplica addReplica() {
        return new AddReplica(solrClient);
    }

    public DeleteReplica deleteReplica() {
        return new DeleteReplica(solrClient);
    }

    public FixReplica fixReplica() {
        return new FixReplica(this);
    }

    public Reload reloadCollection() {
        return new Reload(solrClient);
    }

    public CreateAlias createAlias() {
        return new CreateAlias(solrClient);
    }

    public DeleteAlias deleteAlias() {
        return new DeleteAlias(solrClient);
    }

    public Commit commit() {
        return new Commit(solrClient);
    }

    public void close() throws IOException {
        solrClient.close();
    }
}
