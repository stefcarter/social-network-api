const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

const thoughtSchema = new Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        text: {
            type: String,
            minLength: 15,
            maxLength: 500,
        },
        username: {
            type: String,
            required: true
        },
        reactions: [Reaction],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought; 