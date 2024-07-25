const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = 3333; // Ensure this matches the port you are using

app.get("/", (req, res) => {
  res.send(`
        <h1>Welcome to the Swarm Bee server!</h1>
        <p>Use the following endpoints to get the desired output:</p>
        <ul>
            <li><a href="/status">/status</a></li>
            <li><a href="/status/peers">/status/peers</a></li>
            <li><a href="/redistributionstate">/redistributionstate</a></li>
            <li><a href="/reservestate">/reservestate</a></li>
            <li><a href="/chainstate">/chainstate</a></li>
            <li><a href="/node">/node</a></li>
            <li><a href="/health">/health</a></li>
            <li><a href="/stamps">/stamps</a></li>
            <li><a href="/metrics">/metrics</a></li>
        </ul>
    `);
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

      // Attempt to parse as JSON, fallback to plain text
      try {
        const json = JSON.parse(stdout);
        res.json(json);
      } catch (parseError) {
        res.send(stdout);
      }
    });
  });
};

// Add all the endpoints
createEndpoint("/status", "curl -s http://localhost:1633/status");
createEndpoint("/status/peers", "curl -s http://localhost:1633/status/peers");
createEndpoint(
  "/redistributionstate",
  "curl -s http://localhost:1633/redistributionstate"
);
createEndpoint("/reservestate", "curl -s http://localhost:1633/reservestate");
createEndpoint("/chainstate", "curl -s http://localhost:1633/chainstate");
createEndpoint("/node", "curl -s http://localhost:1633/node");
createEndpoint("/health", "curl -s http://localhost:1633/health");
createEndpoint("/stamps", "curl -s http://localhost:1633/stamps");
createEndpoint("/metrics", "curl -s http://localhost:1633/metrics");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
