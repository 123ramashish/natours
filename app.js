/*global require,process,module,__dirname*/

/*// routing using node js

// const http = require('http');
const server = http.createServer((req, res) => {
  const  pathname = req.url;

// if (pathname === '/' || pathname === '/overview') {
//     res.writeHead(200, {
//       'Content-type': 'text/html'
//     });
//     res.end("overvoew page");

//     // Product page
//   } else if (pathname === '/product') {
//     res.writeHead(200, {
//       'Content-type': 'text/html'
//     });
//     res.end("product");


//     // Not found
//   } else {
//     res.writeHead(404, {
//       'Content-type': 'text/html',
//       'my-own-header': 'hello-world'
//     });
//      res.end('<h1>Page not found!</h1>');
//   }
// });

// server.listen(8000, '127.0.0.1', () => {
//   console.log('Listening to requests on port 8000');
// });
*/

// routing using express

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))



// 1.) Global Middleware

// serving static file
app.use(express.static(path.join(__dirname, 'public')));

// console.log(process.env.NODE_ENV)
// set security http header


app.use(helmet());
// development loggin
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  

// limit request from same API address
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
  app.use('/api', limiter);
  
  // Body parser, reading data from body into req.body
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({extended: true, limit:'10kb'}))
  app.use(cookieParser())
  
  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());
  
  // Data sanitization against XSS
  app.use(xss());

// prevent parameter pollution
app.use(
    hpp({
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
      ]
    })
  );
  
// app.use((req, res, next)=>{
// console.log('Hello from the middleware 👋');
// next();
// })

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
  });
  

//useing json instead of send
// app.get('/', (req,res)=>{
//     res.status(200).json({message:'Hello from the server side!', app:'Natours'})
// })



// app.post('/', (req, res)=>{
//     res.send('You are post to the endpoint...')
// })

// app.get('/api/v1/tours', (req,res)=>{
//    res.status(200).json({
//     status:'success',
//     results: tours.length,
//     data:{
//         tours
//     }
//    })
// })

//88888888888888888888888888888 ////
// 2.) ROUTE HANDLERS

/* see in file tourRouters.js and userRouter.js */

/********************* */
// app.get('api/v1/tours', getAllTours)
// app.get('api/v1/tours/:id', getTour)
// app.post('api/v1/tours', CreateTour)
// app.patch('/api/v1/tours/:id', UpdateTour)
// app.delete('/api/v1/tours/:id',deleteTour)

// 3.) ROUTE
//mounting the router

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

/********************** */

/*
//crud  read operation
app.get('/api/v1/tours/:id', (req,res)=>{
    console.log(req.params)
   const id = req.params.id * 1;

const tour = tours.find(el => el.id === id);
// if(id >tours.length){
    if(!tour){
    return res.status(404).json({
        status:'fail',
        message:'Invalid Id'
    })
}
   res.status(200).json({
    status:'success',
    data:{
        tour
    }
   })
})
*/

/*
//crud create operation
app.post('/api/v1/tours', (req,res)=>{
// console.log(req.body)
const newId = tours[tours.length-1].id+1;
const newTour = Object.assign({id:newId},req.body);
tours.push(newTour)

fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err=>{
    res.status(201).json({
        status:'success',
        data:{
            tour:newTour
        }
    })
})
})

*/


/*
//crud  update operation
app.patch('/api/v1/tours/:id', (req,res)=>{
if(req.params.id * 1 >tours.length){
        return res.status(404).json({
            status:'fail',
            message:'Invalid Id'
        })
    }

    res.status(200).json({
        status:'success',
        data:{
            tour:'<Updated tour here... >'
        }
    })
})
*/


/*

app.delete('/api/v1/tours/:id', (req,res)=>{
    if(req.params.id * 1 >tours.length){
            return res.status(404).json({
                status:'fail',
                message:'Invalid Id'
            })
        }
    // 204 means not content
        res.status(204).json({
            status:'success',
            data:null
        })
    })
*/
//88888888888888888888888///

// 4.) START SERVER
//see in server.js file

app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
    // err.status = 'fail',
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;


