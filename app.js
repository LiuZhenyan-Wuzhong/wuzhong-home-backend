/*
 * @Author:
 * @Date: 2023-02-22 01:39:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-23 23:21:10
 * @Description:
 */
const express = require('express');
const routes = require('./routes/');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cloudinary = require('cloudinary');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const router = express.Router();
const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medium';

cloudinary.config({
    cloud_name: 'chidumennamdi',
    api_key: '',
    api_secret: '',
});

mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        mongoose.set('debug', false);
        console.log('数据库连接成功');
    })
    .catch((err) => {
        console.log('数据库连接失败,重复,数据库连接失败.');
        console.error(err);
    });

let port = process.env.PORT || 5000;

routes(router);

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
