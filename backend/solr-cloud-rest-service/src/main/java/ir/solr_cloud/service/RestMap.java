package ir.solr_cloud.service;

import IR.zooclient.ImmutableZooClient;
import ir.solr_cloud.common.PropertiesHandler;
import ir.solr_cloud.parsers.FarmInfoParser;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.util.Properties;


@RestController
public class RestMap {

    private static final Logger logger = LoggerFactory.getLogger(RestMap.class);
    private Properties prop = PropertiesHandler.getProperties();

    @RequestMapping("/")
    public String index() {
        return "hello world !!!";
    }


    @CrossOrigin()
    @RequestMapping("/shards")
    public String getFarmInfo(@RequestParam String collection, @RequestParam String solrFarm) {
        try {
            var urlPath = String.format(prop.getProperty("cluster_status_url"), solrFarm, collection);
            URL url = new URL(urlPath);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            var in = connection.getInputStream();
            return FarmInfoParser.parse(new String(in.readAllBytes()), collection);

        } catch (ProtocolException e) {
            e.printStackTrace();
        } catch (IOException ioe){
            logger.error("There was a problem while getting information from solr" + ioe.getMessage());
        }
        return "Sorry we couldn't get the solr farm information you needed. please check logs...";
    }

    @CrossOrigin()
    @RequestMapping("/collections")
    public String getFarmInfo(@RequestParam String zkHost) {
        try {
            var zooClient = new ImmutableZooClient.ZooClient(zkHost);
            var collections = zooClient.getChildren("/collections");
            if (collections == null){
                return "couldn't get collections.";
            }
            var result = new JSONArray();
            for (var collection : collections.keySet()){
                result.put(collection);
            }
            zooClient.close();
            return result.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return e.toString();
        }
        //return "Sorry we couldn't get the solr farm information you needed. please check logs...";
    }
}
