package IR;

import IR.CollectionAPIs.SolrCollectionsAPI;
import org.apache.solr.client.solrj.SolrServerException;

import java.io.IOException;
import java.util.Arrays;


/**
 * This is an example of the abilities and usage of the SolrCollectionsAPI.
 * In this example we first create the SolrCollectionsAPI object with
 * a zookeeper host, and then create a new collection with the name <name>HoloCollection</name>,
 * this collection use the <name>HoloConfig</name> configuration, it has 1 shard
 * and each shard has 1 replica.
 */
public class Example {
    public static void main(String[] args) throws IOException, SolrServerException, InterruptedException {
        var solrCollectionsAPI = new SolrCollectionsAPI("solr-test-zk:2181");

        solrCollectionsAPI.createCollection()
                .setCollectionName("HoloCollection")
                .setConfig("Config")
                .setNumShards(1)
                .setNumReplicas(1)
                .execute();
        Thread.sleep(5000);

        solrCollectionsAPI.addReplica()
                .setCollectionName("HoloCollection")
                .setShard("shard1")
                .setNode("solr-test04:8080_solr")
                .execute();
        Thread.sleep(5000);

        solrCollectionsAPI.reloadCollection()
                .setCollectionName("HoloCollection")
                .execute();
        Thread.sleep(5000);

        solrCollectionsAPI.createAlias()
                .setCollectionsName(Arrays.asList("HoloCollection"))
                .setAliasName("Holo")
                .execute();
        Thread.sleep(5000);

        solrCollectionsAPI.deleteAlias()
                .setAliasName("Holo")
                .execute();
        Thread.sleep(5000);

        solrCollectionsAPI.fixReplica()
                .setCollectionName("HoloCollection")
                .setShard("shard1")
                .setReplica("core_node1")
                .execute();
        Thread.sleep(5000);

        solrCollectionsAPI.commit()
                .setCollectionName("HoloCollection")
                .execute();
        Thread.sleep(5000);

        solrCollectionsAPI.deleteReplica()
                .setCollectionName("HoloCollection")
                .setShard("shard1")
                .setReplica("core_node2")
                .execute();
        Thread.sleep(5000);

        solrCollectionsAPI.deleteCollection()
                .setCollectionName("HoloCollection")
                .execute();
        Thread.sleep(5000);

        solrCollectionsAPI.close();
    }
}
