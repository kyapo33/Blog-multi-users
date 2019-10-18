const express = require('express')
const morgan = require('morgan')
const bodyParder = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(morgan('dev'))
app.use(bodyParder.json())
app.use(cookieParser());
app.use(expressValidator());

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useFindAndModify: false
}).then(() => console.log('db connect'));

if(process.env.NODE_ENV === 'development') {
    app.use(cors({origin: `${process.env.CLIENT_URL}`}))
}

const blogRoutes = require('./routes/blog')
const authRoutes = require('./routes/auth')

app.use('/api', authRoutes);
app.use('/api', blogRoutes);

const port = process.env.PORT || 8080 
app.listen(port, () => {
    console.log('Server is running')
})


