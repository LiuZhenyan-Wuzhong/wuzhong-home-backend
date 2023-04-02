const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: String,
    text: String,
    description: String,
    feature_img: String,
    claps: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    update_time: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
        },
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
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
