package IR.zooclient;

import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.cache.*;
import org.apache.curator.retry.RetryOneTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.lang.invoke.MethodHandles;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

public class ImmutableZooClient {
    /**
     * This is slf4j, to enable logs you need the logback dependencies <jar>logback-classic-x.y.z.jar</jar> and <jar>logback-core-x.y.z.jar</jar>.
     * At the time of this comment the version used is 1.2.3.
     * Because this uses apache.curator, that uses apache.zookeeper, without logback.xml, there will be a lot of logs which you not necessarily wish to have,
     * it is recommended to use a logback.xml.
     */
    private static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    String zkHost;
    CuratorFramework zkClient;
    TreeCache rootCache;
    /**
     * The following 4 maps handles the events. We need all of them to be able to unsubscribe from events.
     */
    private Map<String, TreeCache> treeCache = new HashMap<>();
    private Map<String, PathChildrenCache> childrenCache = new HashMap<>();
    private Map<String, NodeCache> dataCache = new HashMap<>();
    private Map<String, Map<Consumer<ChildData>, NodeCacheListener>> dataChangedMap = new HashMap<>();


    ImmutableZooClient(String host) throws Exception {
        this.zkHost = host;
        try {
            init();
            logger.info("Connected to ZooKeeper");
        } catch (Exception e) {
            logger.error("failed to start ZooClient: rootCache failed to start", e);
            throw e;
        }
    }

    ImmutableZooClient(ImmutableZooClient other) {
        this.zkHost = other.zkHost;
        this.zkClient = other.zkClient;
        this.rootCache = other.rootCache;
        this.treeCache = other.treeCache;
        this.childrenCache = other.childrenCache;
        this.dataCache = other.dataCache;
        this.dataChangedMap = other.dataChangedMap;
    }

    /**
     * Initiate the ZooClient curator and the rootCache.
     * The rootCache is the object we read data from.
     *
     * @throws Exception
     */
    private void init() throws Exception {
        zkClient = CuratorFrameworkFactory.builder()
                .connectString(zkHost)
                .retryPolicy(new RetryOneTime(1000))
                .connectionTimeoutMs(1000)
                .sessionTimeoutMs(1000)
                .build();
        zkClient.start();

        rootCache = new TreeCache(zkClient, "/");
        rootCache.start();
        Thread.sleep(100);
    }

    public Boolean isConnected() {
        return zkClient.getZookeeperClient().isConnected();
    }

    public Map<String, ChildData> getChildren(String path) {
        return rootCache.getCurrentChildren(path);
    }

    public ChildData getData(String path) {
        return rootCache.getCurrentData(path);
    }

    /**
     * This method allow you to subscribe to events recursively, any change to the root, the children, the children's children...
     *
     * @param rootPath the path of the root of your events. To subscribe the listener to all events of the ZooKeeper set this parameter to "/"
     * @param listener the method that will activate whenever the event happens
     * @return self
     * @throws Exception this exception happen whenever the program fails to start to tree cache that we subscribe to
     */
    public ImmutableZooClient subscribeGlobalChanges(String rootPath, TreeCacheListener listener) throws Exception {
        if (!treeCache.containsKey(rootPath)) {
            treeCache.put(rootPath, new TreeCache(zkClient, rootPath));
            try {
                treeCache.get(rootPath).start();
            } catch (Exception e) {
                logger.error("failed to start treeCache for path " + rootPath + ", therefore the event won't be listed.", e);
                treeCache.remove(rootPath);
                throw e;
            }
        }
        treeCache.get(rootPath).getListenable().addListener(listener);
        logger.info("subscribe all events of subtree starts at " + rootPath);
        return this;
    }

    /**
     * Subscribe to any events that happen to the _children_ of <param>path</param>
     *
     * @param path     the path the event will subscribe to
     * @param listener the method that will activate whenever an event happen
     * @return self
     * @throws Exception this exception happen whenever the program fails to start to path cache
     */
    public ImmutableZooClient subscribeChildrenChange(String path, PathChildrenCacheListener listener) throws Exception {
        if (!childrenCache.containsKey(path)) {
            childrenCache.put(path, new PathChildrenCache(zkClient, path, true));
            try {
                childrenCache.get(path).start();
            } catch (Exception e) {
                logger.error("failed to start pathCache for path " + path + ", therefore failed to initiate cache hence the listener won't subscribe to the event. " + e.getMessage(), e);
                childrenCache.remove(path);
                throw e;
            }
        }

        childrenCache.get(path).getListenable().addListener(listener);
        logger.info("subscribe children event to " + path);
        return this;
    }

    public String getParentPath(String path) {
        var parentPath = path.substring(0, path.lastIndexOf("/"));
        if (parentPath.isEmpty()) {
            parentPath = "/";
        }
        return parentPath;
    }

    /**
     * Subscribe to any events that happen to the ZNode at <param>path</param>
     *
     * @param path     the path of the ZNode you subscribe to
     * @param listener the method that will activate whenever an event happen
     * @return self
     * @throws Exception this exception happen whenever the program fails to start to node cache
     */
    public ImmutableZooClient subscribeDataChange(String path, Consumer<ChildData> listener) throws Exception {
        var parentPath = getParentPath(path);
        if (!dataCache.containsKey(path)) {
            dataCache.put(path, new NodeCache(zkClient, path));
            try {
                dataCache.get(path).start();
            } catch (Exception e) {
                logger.error("failed to start pathCache for path " + path + " therefore failed to initiate cache hence the listener won't subscribe to the event. " + e.getMessage(), e);
                dataCache.remove(path);
                throw e;
            }
        }

        var cacheListener = (NodeCacheListener)() -> listener.accept(getData(path));
        dataChangedMap.putIfAbsent(path, new HashMap<>());
        dataChangedMap.get(path).put(listener, cacheListener);
        dataCache.get(path).getListenable().addListener(cacheListener);
        logger.info("subscribe data changed event to " + path);
        return this;
    }

    public ImmutableZooClient unsubscribeGlobalChange(String path, TreeCacheListener listener) {
        treeCache.get(path).getListenable().removeListener(listener);
        logger.info("unsubscribe global event from " + path);
        return this;
    }

    public ImmutableZooClient unsubscribeChildrenChange(String path, PathChildrenCacheListener listener) {
        childrenCache.get(path).getListenable().removeListener(listener);
        logger.info("unsubscribe children event from " + path);
        return this;
    }

    public ImmutableZooClient unsubscribeDataChange(String path, Consumer<ChildData> listener) {
        dataCache.get(path).getListenable().removeListener(dataChangedMap.get(path).remove(listener));
        logger.info("unsubscribe data changed event from " + path);
        return this;
    }


    /**
     * Close connection to ZooKeeper as well as the caches and events
     */
    public void close() {
        treeCache.values().forEach(TreeCache::close);
        childrenCache.values().forEach(pathChildrenCache1 -> {
            try {
                pathChildrenCache1.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        dataCache.values().forEach(pathChildrenCache1 -> {
            try {
                pathChildrenCache1.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        rootCache.close();
        zkClient.close();
        logger.info("Disconnect to ZooKeeper");
    }

    /**
     * This class is a mutable extension to the ZooClient.
     * This object allow you to modify the ZooKeeper: change data of a ZNode, add/remove ZNode
     */
    public static class ZooClient extends ImmutableZooClient {
        public ZooClient(String host) throws Exception {
            super(host);
        }

        public ZooClient(ZooClient other) {
            super(other);
        }

        /**
         * One must be careful when using this method, as the cache and events will be shared between the 2 objects, so closing one of them will close both objects.
         *
         * @return ImmutableZooClient of the current ZooClient.
         */
        public ImmutableZooClient getImmutableZooClient() {
            return this;
        }

        public ZooClient setData(String path, String data) throws Exception {
            try {
                zkClient.setData().forPath(path, data.getBytes());
            } catch (Exception e) {
                logger.error("failed to set the data of " + path + " into: " + data, e);
                throw e;
            }
            logger.info("set data of " + path + " into: " + data);
            return this;
        }

        public ZooClient delete(String path) throws Exception {
            try {
                zkClient.delete().forPath(path);
            } catch (Exception e) {
                logger.error("failed to delete " + path, e);
                throw e;
            }
            logger.info("deleted " + path);
            return this;
        }

        private ZooClient deleteRecursive(String path) throws Exception {
            try {
                zkClient.delete().deletingChildrenIfNeeded().forPath(path);
            } catch (Exception e) {
                logger.error("failed to delete " + path, e);
                throw e;
            }
            logger.info("deleted " + path + " and all of it's children");
            return this;
        }

        public ZooClient delete(String path, boolean recursive) throws Exception {
            return recursive ?
                    deleteRecursive(path) :
                    delete(path);
        }

        public ZooClient create(String path, String data) throws Exception {
            try {
                zkClient.create().forPath(path, data.getBytes());
            } catch (Exception e) {
                logger.error("failed to create " + path, e);
                throw e;
            }
            logger.info("created " + path);
            return this;
        }

        public ZooClient create(String path) throws Exception {
            return create(path, "");
        }

        private ZooClient createRecursive(String path, String data) throws Exception {
            try {
                zkClient.create().creatingParentsIfNeeded().forPath(path, data.getBytes());
            } catch (Exception e) {
                logger.error("failed to create " + path, e);
                throw e;
            }
            logger.info("created " + path + " and all of the parents that yet to exists");
            return this;
        }

        public ZooClient create(String path, String data, boolean recursive) throws Exception {
            return recursive ?
                    createRecursive(path, data) :
                    create(path, data);
        }

        public ZooClient create(String path, boolean recursive) throws Exception {
            return create(path, "", recursive);
        }
    }
}
