const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userController = {
  getUserProfile: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      const { password, email, ...rest } = user._doc;
      return res.status(200).json(rest);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const { currentEmail, currentPass, newEmail, newPass, pic, username } =
        req.body;
      const validPassword = await bcrypt.compare(
        currentPass,
        req.user.password
      );
      if (req.user.email === currentEmail && validPassword) {
        const checkEmail = await User.findOne({ email: newEmail });
        const checkUserName = await User.findOne({ username });
        if (checkEmail) {
          return res.status(401).json("The email already exists");
        }
        if (checkUserName) {
          return res.status(401).json("The username already exists");
        }
        await User.findByIdAndUpdate(
          req.user._id,
          {
            username: username || req.user.username,
            email: newEmail || req.user.email,
            password:
              newPass === ""
                ? req.user.password
                : await bcrypt.hash(newPass, 10),
            avatar: pic || req.user.avatar,
          },
          { new: true }
        );
        return res
          .status(200)
          .json("Successfully updated, please reload the page");
      } else {
        return res.status(404).json("Invalid Information");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.findOneAndDelete({ _id: req.user._id });
      return res.status(200).json("Delete Successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  addToFavoriteLists: async (req, res) => {
    try {
      const { data } = req.body;
      const user = await User.findOne({ _id: req.user.id });
      if (user) {
        const { favMovies } = user;
        const isAlreadyAdded = favMovies.find(({ id }) => id === data.id);
        if (!isAlreadyAdded) {
          await User.findByIdAndUpdate(
            user._id,
            {
              favMovies: [...user.favMovies, data],
            },
            { new: true }
          );
        } else return res.status(400).json("You have already added this");
      }
      return res.json("Added successfully");
    } catch (error) {
      return res.json("Error adding");
    }
  },

  removeAFilm: async (req, res) => {
    try {
      const { data } = req.body;
      const user = await User.findOne({ _id: req.user._id });
      if (user) {
        const { favMovies } = user;
        const isAvailable = favMovies.find(({ id }) => id === data.id);
        if (isAvailable) {
          await User.findByIdAndUpdate(
            user._id,
            {
              favMovies: favMovies.filter(({ id }) => id !== data.id),
            },
            { new: true }
          );
        } else return res.status(400).json("The item is already removed");
      }
      return res.status(200).json("Removed Successfully");
    } catch (error) {
      return res.status(400).json("Error Removing");
    }
  },
  removeAllFilms: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      if (user) {
        const { favMovies } = user;
        if (favMovies.length > 0) {
          await User.findByIdAndUpdate(
            user._id,
            {
              favMovies: [],
            },
            { new: true }
          );
          return res.status(200).json("Remove all films successfully");
        } else {
          return res.status(400).json("You have not added any films yet");
        }
      } else {
        return res.status(404).json("User not found");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = userController;
