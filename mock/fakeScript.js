const Mock = require('mockjs');
const mongoose = require('mongoose');
const Article = require('../models/Article.js');
const Category = require('../models/Category.js');
const Tag = require('../models/Tag.js');
const User = require('../models/User.js');

// 连接 MongoDB 数据库 同步的
mongoose.connect('mongodb://127.0.0.1:27017/medium', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

const createCategoryTags = () => {
    const tagData = [
        { name: '#javascript' },
        { name: '#react' },
        { name: '#vue' },
        { name: '#angular' },
        { name: '#nextjs' },
    ];
    const categoryData = [
        { name: 'Developer' },
        { name: 'Software' },
        { name: 'Hacking' },
        { name: 'Tools' },
        { name: 'Books' },
    ];

    return { tagData, categoryData };
};

const createUsers = () => {
    const userData = Mock.mock({
        'users|5': [
            {
                name: '@name',
                email: '@email',
                token: '@guid',
                avatorImgUrl: '@image(80x80)',
                followers: [],
                following: [],
            },
        ],
    }).users;

    return { userData };
};

const createArticles = async () => {
    console.log('MongoDB connected');
    const userData = await db.models.User.find();
    const tagData = await db.models.Tag.find();
    const categoryData = await db.models.Category.find();

    const articleData = Mock.mock({
        'articles|10': [
            {
                title: '@title',
                text: '@paragraph(5, 10)',
                description: '@paragraph(1, 3)',
                feature_img: '@image(400x300)',
                claps: '@integer(0, 100)',
                author: '@pick(' + userData.map((user) => user._id) + ')',
                tags: ['@pick(' + tagData.map((tag) => tag._id) + ')'],
                category:
                    '@pick(' +
                    categoryData.map((category) => category._id) +
                    ')',
                comments: [],
            },
        ],
    }).articles;

    return { articleData };
};

const insertToDB = ({ tagData, categoryData, userData, articleData }) => {
    if (tagData) {
        Tag.deleteMany({}, (err) => {
            if (err) console.log(err);
        });

        Tag.insertMany(tagData, (err, tags) => {
            if (err) console.log(err);
            console.log(tags.length + ' tags inserted');
        });
    }

    if (categoryData) {
        Category.deleteMany({}, (err) => {
            if (err) console.log(err);
        });

        Category.insertMany(categoryData, (err, categories) => {
            if (err) console.log(err);
            console.log(categories.length + ' categories inserted');
        });
    }

    if (articleData) {
        Article.deleteMany({}, (err) => {
            if (err) console.log(err);
        });

        Article.insertMany(articleData, (err, articles) => {
            if (err) console.log(err);
            console.log(articles.length + ' articles inserted');
        });
    }

    if (userData) {
        User.deleteMany({}, (err) => {
            if (err) console.log(err);
        });

        User.insertMany(userData, (err, users) => {
            if (err) console.log(err);
            console.log(users.length + ' users inserted');
        });
    }
};

// const { tagData, categoryData } = createCategoryTags();
// console.log(tagData);
// console.log(categoryData);

// const { userData } = createUsers();
// console.log(userData);

createArticles().then(({ articleData }) => {
    insertToDB({ articleData });
});

// insertToDB({ userData });
