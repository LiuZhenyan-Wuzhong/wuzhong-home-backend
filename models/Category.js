const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: String,
    bg_color: String,
});

CategorySchema.pre('save', (next) => {
    if (!this.bg_color) {
        this.bg_color = '#0070f3';
    }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
