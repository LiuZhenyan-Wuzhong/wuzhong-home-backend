/*
 * @Author:
 * @Date: 2023-02-21 21:34:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-21 23:18:33
 * @Description:
 */

const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    text: String,
    title: String,
    description: String,
    feature_img: String,
    claps: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            text: String,
        },
    ],
});

ArticleSchema.methods.clap = function () {
    this.claps++;
    return this.save();
};

ArticleSchema.methods.comment = function (c) {
    this.comments.push(c);
    return this.save();
};

ArticleSchema.methods.addAuthor = function (author_id) {
    this.author = author_id;
    return this.save();
};

ArticleSchema.methods.getUserArticle = function (author_id) {
    Article.find({ author: author_id }).then((article) => {
        return article;
    });
};

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
