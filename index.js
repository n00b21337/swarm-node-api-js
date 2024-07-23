const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3333; // Ensure this matches the port you are using

app.get('/', (req, res) => {
    res.send('Welcome to the Node.js server! Use the following endpoints to get the desired output: /status, /status/peers, /redistributionstate, /reservestate, /chainstate, /node, /health');
});

const createEndpoint = (path, command) => {
    app.get(path, (req, res) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                res.status(500).send(`Error executing command: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                res.status(500).send(`Command stderr: ${stderr}`);
                return;
            }
            res.send(stdout);
        });
    });
};

// Add all the endpoints
createEndpoint('/status', 'curl -s http://localhost:1633/status | jq .');
createEndpoint('/status/peers', 'curl -s http://localhost:1633/status/peers | jq .');
createEndpoint('/redistributionstate', 'curl -s http://localhost:1633/redistributionstate | jq .');
createEndpoint('/reservestate', 'curl -s http://localhost:1633/reservestate | jq .');
createEndpoint('/chainstate', 'curl -s http://localhost:1633/chainstate | jq .');
createEndpoint('/node', 'curl -s http://localhost:1633/node | jq .');
createEndpoint('/health', 'curl -s http://localhost:1633/health | jq .');

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
