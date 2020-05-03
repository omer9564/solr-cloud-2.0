const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.get('/shards', (req,res) =>{
    const shards = [{"replicas":[{"leader":"true","replica":"Cloud_shard2_replica1","node_name":"10.0.1.4:8983_solr","base_url":"http://10.0.1.4:8983/solr","state":"active"},{"leader":"false","replica":"Cloud_shard2_replica2","node_name":"10.0.1.4:7574_solr","base_url":"http://10.0.1.4:7574/solr","state":"active"}],"name":"shard2"},{"replicas":[{"leader":"true","replica":"Cloud_shard1_replica2","node_name":"10.0.1.4:8984_solr","base_url":"http://10.0.1.4:8984/solr","state":"active"},{"leader":"false","replica":"Cloud_shard1_replica1","node_name":"10.0.1.4:7575_solr","base_url":"http://10.0.1.4:7575/solr","state":"active"}],"name":"shard1"}];
    res.send(shards);
});

app.get('/collections', (req,res) => {
    const collections = ["OZ0598","IZ0194","NZ1066"];
    res.send(collections);
});

app.get('/compare', (req,res) => {
    const shardC = [
        {
            "field":"shard1",
            "src":"1048",
            "dst":"1048",
            "diff":0
        },
        {
            "field":"shard2",
            "src":"10485",
            "dst":"10486",
            "diff":-1
        },
        {
            "field":"shard3",
            "src":"10483",
            "dst":"10482",
            "diff":1
        }
    ];
    res.send(shardC);
});

app.post('/logger', (req, res) => {
    console.log(req.body);

    run(req.body["logs"]).catch(console.log);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

async function run (dataset) {
    const { Client } = require('@elastic/elasticsearch');
    const client = new Client({ node: 'http://3.20.125.90:9200' });
    const body = dataset.flatMap(doc => [{ index: { _index: 'sc2' } }, doc]);

    const { body: bulkResponse } = await client.bulk({ refresh: true, body });

    if (bulkResponse.errors) {
        const erroredDocuments = [];
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0];
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                    operation: body[i * 2],
                    document: body[i * 2 + 1]
                })
            }
        });
        console.log(erroredDocuments)
    }

    const { body: count } = await client.count({ index: 'sc2' });
    console.log(count)
}



app.listen(port, () => console.log(`Listening on port ${port}`));