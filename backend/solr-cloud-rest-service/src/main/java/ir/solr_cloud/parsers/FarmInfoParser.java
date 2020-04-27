package ir.solr_cloud.parsers;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Iterator;

public class FarmInfoParser {

    public static String parse(String input, String collection){
        var json = new JSONObject(input);
        var clusterData = (JSONObject)json.get("cluster");
        var collectionsData = (JSONObject)clusterData.get("collections");
        var collectionData = (JSONObject)collectionsData.get(collection);
        var shards = (JSONObject)collectionData.get("shards");
        return extractShards(shards).toString();
    }

    private static JSONArray extractShards(JSONObject shards){
        var cleanShardsJsonArray = new JSONArray();
        for (Iterator<String> it = shards.keys(); it.hasNext(); ) {
            var cleanShardObj = new JSONObject();
            String shardName = it.next();
            var shard = (JSONObject)shards.get(shardName);
            cleanShardObj.put("name", shardName);
            cleanShardObj.put("state", shard.get("state"));
            var replicas = (JSONObject)shard.get("replicas");
            cleanShardObj.put("replicas", extractReplicas(replicas));
            cleanShardsJsonArray.put(cleanShardObj);
        }
        return cleanShardsJsonArray;
    }

    private static JSONArray extractReplicas(JSONObject replicas){
        var cleanReplicasArray = new JSONArray();
        for (Iterator<String> it = replicas.keys(); it.hasNext(); ) {
            var cleanReplicaObj = new JSONObject();
            String coreNode = it.next();
            var replicaData = (JSONObject)replicas.get(coreNode);
            cleanReplicaObj.put("replica", replicaData.get("core"));
            cleanReplicaObj.put("state", replicaData.get("state"));
            if (replicaData.has("leader"))
                cleanReplicaObj.put("leader", replicaData.get("leader"));
            else
                cleanReplicaObj.put("leader", "false");
            cleanReplicaObj.put("node_name", replicaData.get("node_name"));
            cleanReplicaObj.put("base_url", replicaData.get("base_url"));
            cleanReplicasArray.put(cleanReplicaObj);
        }
        return cleanReplicasArray;
    }
}
