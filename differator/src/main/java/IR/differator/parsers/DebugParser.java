package IR.differator.parsers;

import IR.differator.objects.DebugResult;
import IR.differator.objects.Shard;
import org.apache.solr.common.util.NamedList;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/*
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

*/

public class DebugParser {
    private NamedList<Object> responseA;
    private NamedList<Object> responseB;

    private static String RESPONSE = "response";
    private static String DEBUG = "debug";
    private static String TRACK = "track";
    private static String EXECUTE_QUERY = "EXECUTE_QUERY";
    private static String NUM_DOCS = "NumFound";


    public DebugParser(NamedList<Object> responseA, NamedList<Object> responseB) {
        this.responseA = responseA;
        this.responseB = responseB;
    }

    private JSONObject getExecuteQuerySection(NamedList<Object> response) {
        String stringToParse = response.get(RESPONSE).toString();
        return new JSONObject(stringToParse).getJSONObject(DEBUG).getJSONObject(TRACK).getJSONObject(EXECUTE_QUERY);
    }

    private String getShardName(String stringToExtract) {
        String[] fragments = stringToExtract.split("_");
        List<String> results = Arrays.stream(fragments)
                .filter(line -> !line.contains("/"))
                .collect(Collectors.toList());
        return results.get(0);
    }

    private String extractShardName(String stringToExtract) {
        return getShardName(stringToExtract);
    }

    private int extractNumDocs(JSONObject nodeSection) {
        return nodeSection.getInt(NUM_DOCS);
    }

    private List<Shard> getShards(JSONObject executeQuerySection) {
        List<Shard> shards = new ArrayList<>();

        Set<String> shardsNodes = executeQuerySection.keySet();

        shardsNodes.forEach((shardNodes) -> {
            String shardName = extractShardName(shardNodes);
            int numDocs = extractNumDocs(executeQuerySection.getJSONObject(shardNodes));
            Shard shard = new Shard(shardName, numDocs);
            shards.add(shard);

        });

        return shards;
    }

    private void sortShardsByName(List<Shard> shards) {
        shards.sort(Shard::compareTo);
    }

    private List<DebugResult> createResults(List<Shard> shardsA, List<Shard> shardsB) {
        List<DebugResult> debugResults = new ArrayList<>();
        int arrLength = shardsA.size();
        for (int i = 0; i < arrLength; i++) {
            debugResults.add(new DebugResult(shardsA.get(i), shardsB.get(i)));
        }
        return debugResults;
    }

    public List<DebugResult> getResults() {
        JSONObject executeQuerySectionA = getExecuteQuerySection(responseA);
        JSONObject executeQuerySectionB = getExecuteQuerySection(responseB);

        List<Shard> shardsA = getShards(executeQuerySectionA);
        List<Shard> shardsB = getShards(executeQuerySectionB);

        sortShardsByName(shardsA);
        sortShardsByName(shardsB);

        return createResults(shardsA, shardsB);
    }

}
