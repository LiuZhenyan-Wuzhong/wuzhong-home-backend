/*
 * @Author:
 * @Date: 2023-02-21 22:42:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-23 23:15:54
 * @Description:
 */
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const cloudinary = require('cloudinary');

const articleCtrller = {
    addArticle: (req, res, next) => {
        console.log(req.body);
        const { text, title, claps, description } = req.body;

        if (req.files && req.files.image) {
            cloudinary.uploader.upload(
                req.files.image.path,
                (result) => {
                    const obj = {
                        text,
                        title,
                        claps,
                        description,
                        feature_img: result.url != null ? result.url : '',
                    };

                    saveArticle(obj);
                },
                {
                    resource_type: 'image',
                    eager: [{ effect: 'sepia' }],
                }
            );
        } else {
            saveArticle({ text, title, claps, description, feature_img: '' });
        }

        function saveArticle(obj) {
            new Article(obj).save((err, article) => {
                if (err) {
                    res.send(err);
                } else if (!article) {
                    res.send(400);
                } else {
                    return article
                        .addAuthor(req.body.author_id)
                        .then((_article) => {
                            return res.send(_article);
                        });
                }
                next();
            });
        }
    },

    getAll: (req, res, next) => {
        console.log(`get all articles`);

        Article.find({})
            .select('title description feature_img claps author category tags')
            .populate('author')
            .exec((err, article) => {
                if (err) {
                    res.status(400).json({ msg: err });
                } else {
                    res.json(article);
                }
                next();
            });
    },

    getAllArticleIds: (req, res, next) => {
        console.log(`get all article ids`);

        Article.find({})
            .select('_id')
            .exec((err, articleIds) => {
                if (err) {
                    res.status(400).json({ msg: err });
                } else {
                    res.json(articleIds.map((id) => id.toObject()._id));
                }
            });
    },

    getConditionalArticles: (req, res, next) => {
        const { conditions, projection, options } = req.body;

        const articles = Article.find(conditions, projection, options);

        articles
            .populate('author')
            .populate('comments')
            .exec((err, articles) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(articles);
                }
                next();
            });
    },

    /**
     * @description:
     * @params {}req
     * @return {void}
     */
    getArticle: async (req, res, next) => {
        const { articleId } = req.params;
        console.log(`get article ${articleId}`);

        Article.findById(articleId)
            .populate('author')
            .populate('comments')
            .exec((err, article) => {
                if (err) {
                    res.status(404).json({ msg: err.message });
                } else if (!article) {
                    res.status(404).json({ msg: 'Not article.' });
                } else {
                    res.json(article.toObject());
                }
                next();
            });
    },

    clapArticle: async (req, res, next) => {
        const { articleId } = req.body;
        const article = await Article.findById(articleId);

        if (!article) {
            res.status(404).json({ msg: 'No article.' });
            next();
            return;
        }
        try {
            article.clap().then((newArticle) => {
                const { claps } = newArticle;
                res.json({ claps });
                next();
            });
        } catch (err) {
            console.error(err);
            res.status(400).json({ msg: err.message });
        }
    },

    commentArticle: async (req, res, next) => {
        const { user } = req;
        const { articleId, commentText } = req.body;
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ msg: 'No article.' });
        }

        try {
            const comment = await Comment.create({
                author: user._id,
                text: commentText,
            });
            const newArticle = article.comment(comment);
            const comments = await Comment.find({ $in: newArticle.comments });
            res.status(200).json(comments);
            next();
        } catch (err) {
            return res.status(400).json({ msg: err.message });
        }
    },

    getAllArticleComments: async (req, res, next) => {
        const { articleId } = req.body;

        try {
            const article = await Article.findById(articleId)
                .select('comments')
                .populate('comments');
            if (!article) {
                return res.status(404).json({ msg: 'No article.' });
            }

            const { comments } = article;

            res.json({ comments });
            next();
        } catch (err) {
            return res.status(400).json({ msg: err.message });
        }
    },

    deleteComment: async (req, res, next) => {
        const { user } = req;
        const { commentId } = req.body;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ msg: 'No comment.' });
        }

        if (user._id.toString() != comment.author.toString()) {
            return res.status(403).json({ msg: 'Not author.' });
        }

        try {
            await comment.remove().then((token) => {
                res.json(token);
                next();
            });
        } catch (err) {
            console.error(err);
            return res.status(400).json({ msg: err });
        }
    },
};

module.exports = articleCtrller;
