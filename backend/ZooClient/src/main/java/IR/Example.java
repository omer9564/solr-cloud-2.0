package IR;

import IR.zooclient.ImmutableZooClient;
import org.apache.curator.framework.recipes.cache.ChildData;

import java.nio.charset.StandardCharsets;
import java.util.function.Consumer;

public class Example {
    public static final String PATH = "/clusterstate.json";

    public static void main(String[] args) throws Exception {
        var ZClient = new ImmutableZooClient.ZooClient("solr-test-zk");
        var oldData = ZClient.getData(PATH);
        var printDataConsumer = (Consumer<ChildData>) System.out::println;

        ZClient.subscribeDataChange(PATH, printDataConsumer);

        for (int i = 0; i < 10; i++) {
            Thread.sleep(1000);
            ZClient.setData(PATH, i + "");
            if (i == 5) {
                ZClient.unsubscribeDataChange(PATH, printDataConsumer);
            }
        }
        ZClient.setData(PATH, new String(oldData.getData(), StandardCharsets.UTF_8));
        ZClient.close();
    }
}
