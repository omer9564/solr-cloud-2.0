package IR.differator.parsers;

import IR.differator.objects.DebugResult;
import IR.differator.objects.Shard;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.util.NamedList;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


public class DebugParser {

    private static String RESPONSE = "response";
    private static String DEBUG = "debug";
    private static String TRACK = "track";
    private static String EXECUTE_QUERY = "EXECUTE_QUERY";
    private static String NUM_DOCS = "NumFound";



    /**
     * the response we receive from solr is a big json with many hierarchies its look like this,
     *      {
     *          "responseHeader" : ...
     *          "response" : ...
     *          "debug" :
     *              {
     *                  "track" :
     *                  {
     *                      "rid" : ...
     *                      "EXECUTE_QUERY" :
     *                  }
     *                  "timing" : ...
     *                  "rawquerystring" : ...
     *                  .
     *                  .
     *                  .
     *              }
     *      }
     * the part of EXECUTE_QUERY is the part that we are interesting in (this is the response that contains the link
     * between shards and number of document in it), so we would like to extract only a jsonObject of this section.
     * @param response
     * @return
     */
    private JSONObject getExecuteQuerySection(NamedList<Object> response) {
        var stringToParse = response.get(RESPONSE).toString();
        return new JSONObject(stringToParse).getJSONObject(DEBUG).getJSONObject(TRACK).getJSONObject(EXECUTE_QUERY);
    }

    /**
     * the response contains a link between shard name and the document in it, but the shard name is not the specific
     * json key, the specific json key looks like this -
     *  http://192.168.1.12:8983/solr/gettingstarted_shard1_replica1/|http://192.168.1.12:8984/solr/gettingstarted_shard1_replica2/
     * so we need to parse this key in order to get the shard number (in this example shard1)
     * hence we split by the character "_", and then remove all the fragments with the character "/" in it, after that
     * we have an array that contains the desired result (in this example shard1) many times, so we return the first result
     * @param stringToExtract
     * @return
     */
    private String getShardName(String stringToExtract) {
        var fragments = stringToExtract.split("_");
        var desiredShards = Arrays.stream(fragments)
                .filter(fragment -> !fragment.contains("/"))
                .collect(Collectors.toList());
        return desiredShards.get(0);
    }

    /**
     * each nodeSection look like this -
     *      {
     *          http://192.168.1.12:8983/solr/gettingstarted_shard1_replica1/":
     *              {
     *                  "QTime": ...
     *                  .
     *                  .
     *                  .
     *                  "NumFound" : 0
     *              }
     *          http://192.168.1.12:8983/solr/gettingstarted_shard2_replica1/":
     *              {
     *                  "QTime": ...
     *                  .
     *                  .
     *                  .
     *                  "NumFound" : 0
     *              }
     *      }
     * and we need to extract NumFound from each nodeSection
     * @param nodeSection
     * @return
     */
    private int extractNumDocs(JSONObject nodeSection) {
        return nodeSection.getInt(NUM_DOCS);
    }

    /**
     * once we got executeQuerySection, we create a link of shard and number of documents in it (a list of Shard)
     * @param executeQuerySection
     * @return
     */
    private List<Shard> getShards(JSONObject executeQuerySection) {
        List<Shard> shards;
        Set<String> shardsNodes = executeQuerySection.keySet();

        shards = shardsNodes.stream().map((shardNodes) -> {
            String shardName = getShardName(shardNodes);
            int numDocs = extractNumDocs(executeQuerySection.getJSONObject(shardNodes));
            Shard shard = new Shard(shardName, numDocs);
            return shard;
        }).collect(Collectors.toList());

        return shards;
    }

    /**
     * sort the shard Lexicographically, i.e. shard1, shard2, ... shard10, shard11, ...
     * @param shards
     */
    private void sortShardsByName(List<Shard> shards) {
        shards.sort(Shard::compareTo);
    }

    private List<DebugResult> createResults(List<Shard> srcShards, List<Shard> dstShards) {
        List<DebugResult> debugResults = new ArrayList<>();
        var length = srcShards.size();
        for (int i = 0; i < length; i++) {
            debugResults.add(new DebugResult(srcShards.get(i), dstShards.get(i)));
        }
        return debugResults;
    }

    public List<DebugResult> getResults(NamedList<Object> srcResponse, NamedList<Object> dstResponse) {
        var srcExecuteQuerySection = getExecuteQuerySection(srcResponse);
        var dstExecuteQuerySection = getExecuteQuerySection(dstResponse);

        var srcShards = getShards(srcExecuteQuerySection);
        var dstShards = getShards(dstExecuteQuerySection);

        sortShardsByName(srcShards);
        sortShardsByName(dstShards);

        return createResults(srcShards, dstShards);
    }

}
