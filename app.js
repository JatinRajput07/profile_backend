require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const userRouter = require('./routers/userRouter');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const app = express();
const port = process.env.PORT || 3200;


mongoose.connect('mongodb://localhost:27017/my-profile', {}).then(() => { console.log('MongoDB connected') }).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());


// if (cluster.isMaster) {
//   mongoose.connect('mongodb://localhost:27017/my-profile', {})
//     .then(() => {
//       console.log('MongoDB connected');
//       for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//       }

//       cluster.on('exit', (worker) => {
//         console.log(`Worker ${worker.process.pid} died, starting a new one.`);
//         cluster.fork();
//       });
//     })
//     .catch(err => {
//       console.error('Failed to connect to MongoDB:', err);
//       process.exit(1); 
//     });
// } else {

//   app.use('/admin', userRouter);

//   app.listen(port, () => {
//     console.log(`Worker ${process.pid} running on http://localhost:${port}`);
//   });
// }

app.use('/admin', userRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});