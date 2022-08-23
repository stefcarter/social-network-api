const { Thought, User } = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        :res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
        })
        .then((user) => 
        !user
        ? res
            .status(404)
            .json({ message: 'Thought created, but found no user with that ID' })
        : res.json('Created the thought')
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //  update the thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought
            ? res.status(404).json({ message: "No thought found with this ID" })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    //  delete a thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: "No thought exists with that ID" })
                : res.json({ message: "Thought deleted" })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },   
    //  add a new reaction to a thought
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            // { new: true }
        )
        .then((thought) => 
        !thought
        ? res
            .status(404)
            .json({ message: "Thought ID not found" })
        : res.json("Added reaction to the thought")
        )
        .catch((err) => res.status(500).json(err));
    },
    // delete a single reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { _id: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
        .then((thought) => 
        !thought
        ? res.status(404).json({ message: "No reaction with this ID" })
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
};