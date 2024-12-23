## Instructions to setup and run project
Clearly explain the steps required to install and configure necessary packages,
for both the server and the client, and the sequence of steps required to get
your application running.


In the sections below, list and describe each contribution briefly.

# Setup Instructions
1. Clone the repository
```
git clone <repository url>
cd <repository folder>
```

2. Install dependencies
```
cd client
npm install
cd ../server
npm install
```

3. Database setup
Make sure MongoDB is running. This can be done with ```mongosh```</br>
Initialize the DB in the server directory:
```
node init.js mongodb://127.0.0.1:27017/phreddit <admin email> <admin username> <admin password>
```

4. Start the server
In the server directory:
```nodemon server.js```

5. Start the frontend client
In the client directory
```npm start```

6. Open the browser
Enter url:
```http://localhost:3000```
