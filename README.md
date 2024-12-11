[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/MVUO33FO)
# Term Project

Add design docs in *images/*

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
Make sure MongoDB is running. This can be done with ```mongosh```
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

## Team Member 1 Contribution
Cody Jiang
Both contributed to the project. Worked was pretty much split evenly
as we also had to debug and understand the other person's code.

## Team Member 2 Contribution
Shaoyang Li
Both contributed to the project. Worked was pretty much split evenly
as we also had to debug and understand the other person's code.