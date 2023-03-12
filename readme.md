const express = require('express');
const session = require('express-session');
const Docker = require('dockerode');
const nginxConf = require('nginx-conf');

const app = express();
const docker = new Docker();

// Configure the session middleware
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', async (req, res) => {
  try {
    // Generate a unique container name based on the session ID
    const sessionId = req.session.id;
    const containerName = `myapp-${sessionId}`;

    // Check if a container with the same name already exists
    const existingContainer = await docker.getContainer(containerName).inspect();
    if (existingContainer) {
      // If a container with the same name exists, reuse it
      const containerIp = existingContainer.NetworkSettings.IPAddress;
      const containerUrl = `http://${containerIp}`;
      return res.send(containerUrl);
    }

    // Create a new Docker container
    const container = await docker.createContainer({
      name: containerName,
      Image: 'node:latest',
      Cmd: ['node', '-e', 'console.log("Hello from Docker!")'],
    });

    // Start the container
    await container.start();

    // Get the IP address of the container
    const containerInfo = await container.inspect();
    const containerIp = containerInfo.NetworkSettings.IPAddress;

    // Generate an Nginx configuration file
    const config = nginxConf(`
      server {
        listen 80;
        server_name ${containerIp};
        location / {
          proxy_pass http://${containerIp}:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
        }
      }
    `);

    // Write the Nginx configuration file to disk
    const configFile = `/etc/nginx/conf.d/${containerName}.conf`;
    await config.save(configFile);

    // Reload Nginx to apply the new configuration
    await exec('nginx -s reload');

    // Set a timeout to stop the container when the session ends
    const sessionTimeout = 10 * 60 * 1000; // 10 minutes
    req.session.cookie.maxAge = sessionTimeout;
    req.session.save(() => {
      setTimeout(async () => {
        try {
          // Stop and remove the container
          await container.stop();
          await container.remove();

          // Remove the Nginx configuration file
          await exec(`rm ${configFile}`);

          // Reload Nginx to remove the configuration
          await exec('nginx -s reload');
        } catch (error) {
          console.error(error);
        }
      }, sessionTimeout);
    });

    // Return the URL of the container
    const containerUrl = `http://${containerIp}`;
    res.send(containerUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to spin up Docker container.');
  }
});

app.listen(3000, () => console.log('Server listening on port 3000.'));





docker build -t shivajimaharaj .

docker run -p 8000:3000 shivajimaharaj






I found the solution :)) 1- I run one container, 2- while the first socket connection continue, I run second container. And then I saw the socket keep reconnecting.( socketdID connected, socketID disconnected, and then go on ... )

and solution is, on client side, make the socket, disable long polling with transports config.

this.socket=io("http://localhost:9999",{ transports:['websocket']


https://stackoverflow.com/questions/73096997/scale-node-js-docker-haproy-socket-io-vue