const { Thought, User } = require('../models');

module.exports = {
    // get all users
    getUsers(req, res) {
        User.find()
        .populate('thoughts')
        .populate('friends')
        // .populate('friends', { username: 1 })
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },
    // get one user
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId })
        .select('-__v')
        .populate('thoughts')
        .populate('friends')
        // .populate('friends', { username: 1 })
        .then((user) => 
        !user 
        ? res.status(404).json({ message: 'No user with that ID' }) 
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // create a new user
    createUser(req, res) {
        User.create(req.body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(500).json(err));
    },
    //  delete a user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
            !user
                ? res.status(404).json({ message: "No user exists with that ID" })
                : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: "User and associated thoughts deleted" }))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    // update a user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) =>
        !user
            ? res.status(404).json({ message: "No user wit h this ID" })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    //  add a friend to user's friend list
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } },
            // { new: true }
        )
        .then((user) => 
        !user
        ? res
            .status(404)
            .json({ message: 'Friend created, but found no user with that ID' })
        : res.json('Added Friend to friend list')
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //  deletes a friend from user's friend list
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((user) => 
        !user
        ? res.status(404).json({ message: "No friend found with this ID" })
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
};