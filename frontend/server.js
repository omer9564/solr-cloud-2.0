const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
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