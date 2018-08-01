# WebDNA Frontend
An Angular 6 frontend for the WebDNA server.

This is an open-source repository under the "WebDNA" project, a project dedicated to enabling an ease-of-use configuration and execution of oxDNA simulations, all from a web browser.

## Getting Started

Clone this repo to your computer. It's ideal if you place the folder for this repo adjacent to the [webdna-django-server](https://github.com/uark-self-assembly/webdna-django-server) repository. For example

```
folder/
  |  webdna-django-server/
  |    |  manage.py
  |    |  ...
  |  webdna-frontend/
  |    |  src/
  |    |    |  ...
  |    |  server.js
  |    |  ...
  |
```

### Environment setup

After that, you'll want to create a new ".env" file. This file will contain the environment variables the frontend needs to work properly.

```bash
touch .env
vim .env
```

In your `.env` file, put something like the following:

```env
LAN_IP=10.5.53.112
WAN_IP=53.54.12.14

SIMULATION_DIR=../webdna-django-server/server-data/server-sims/
```

Where do these IP's come from? 

`LAN_IP` refers to the IP your local network has assigned to your computer. This is needed so that the Node server that's handling requests knows where the Django server is. To get this IP, run the following command:

```bash
ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'
```

`WAN_IP` refers to the IP where your computer can be accessed over the Internet. This is only useful if you're hosting the website somewhere other than your local network. 

**NOTE: IF YOU ONLY WANT WEBDNA ACCESSIBLE OVER THE LOCAL NETWORK OR A VPN, MAKE `WAN_IP` THE SAME AS `LAN_IP`**

`SIMULATION_DIR` refers to the location of simulation files that the Django server writes after the execution of a simulation. This will always be underneath the repository folder at `server-data/server-sims/`. If you didn't follow the folder conventions above, make sure to set the correct relative location of this folder in your environment variables.

### Installing

To install the required packages for this Node.JS server and Angular 6 site, run the following

```bash
npm install
```

Easy enough!

### Building

Building the site is easy as well. Just run:

```bash
npm run build
```

You may be tempted to run `ng build`. That's fine, but make sure you've run `npm run build` at least once, because some required files get generated with the latter command that do not get generated by the former.

### Serving the site

Once you've got that going, you have two options. You can either run the server directly, or use a process manager. If you're running this on a dedicated PC and don't plan to use it other than for hosting, then I highly recommend using a process manager.

#### Run the server directly

Run the following:

```bash
node server.js
```

To stop the server, hit `Ctrl-C`

#### Run with a process manager

Run the following:

```bash
npm install -g pm2
pm2 start server.js --name webdna-frontend
```

To stop the server, run

```bash
pm2 stop webdna-frontend
```

To remove the server from pm2's memory, run

```bash
pm2 delete webdna-frontend
```

### Routing port 80

Right now, the site runs on port 8080, which isn't great for accessing through a web browser (which will always default to port 80).

To fix this, run the following commands:

```bash
sudo apt install nginx
sudo vim /etc/sites-enabled/default
```

Then, modify the contents of this file to be exactly the following, making sure to replace `LAN_IP` with your local IP.

```nginx
server {
    listen 80;
    server_name LAN_IP;

    location / {
        proxy_pass "http://LAN_IP:8080";
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

After exiting, run the following:

```bash
sudo service nginx restart
```

Good to go! Your computer will router requests on port 80 to the Node.JS server on port 8080

### Accessing the site

Simply navigate your web browser to your `WAN_IP` (or `LAN_IP` if you're accessing the site on the same network).

## Development Procedures

TODO