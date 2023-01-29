const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://0.0.0.0:27017/databaseagenda';
mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('DB is connected');
});
