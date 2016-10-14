## About
This project serves a Frontend that allows to gather signatures of people. Its build with Angular2. Further more the backend is capable of using
the data and calculate certainties for signatures to belong to a certain person.

The whole application is served by a node.js serer running the express module for REST API.

## Backend structure
![alt text](assets/structure.png)

## Deployment on MacOS

```js
  npm install

  // This command will output some errors, 
  // those errors are fine and do not need to be fixed.
  npm run compile
  
  npm start
```

**After starting the application, the neural network is being trained at first. This may take a while. You might want to take a coffee brake now.**

After training you can access the application at [http://localhost:7070](http://localhost:7070). Signatures can only be signed on mobile devices.

#### Problems?
> Installing may cause Problems with the **canvas** npm module. Look [Here](https://github.com/Automattic/node-canvas/wiki/Installation---OSX) for help

## Deactivating Neural network
If you would not like to wait for the network to be trained you can just comment out line 30 in file app.js. But then you would not get any results at all from 
the neural network.