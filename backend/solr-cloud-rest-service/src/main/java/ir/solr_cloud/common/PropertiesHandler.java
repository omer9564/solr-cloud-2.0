package ir.solr_cloud.common;

import ir.solr_cloud.service.RestMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public class PropertiesHandler {

    private static final Logger logger = LoggerFactory.getLogger(RestMap.class);
    private static Properties prop = null;


    public static void loadConfig(String configFilePath){
        prop = new Properties();
        try {
            var ip = new FileInputStream(configFilePath);
            prop.load(ip);
        } catch (FileNotFoundException e){
            logger.error("couldn't find the configuration file." + e.getMessage());
        } catch (IOException ioe){
            logger.error("There was a problem while loading the configuration file. " + ioe.getMessage());
        }
    }

    public static Properties getProperties() {
        return prop;
    }
}
