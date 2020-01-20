const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema({
  userName: {
    type: String,
    max: 20,
    required: [true, "Username can't be blank"],
    unique: [true, 'Username should be an unique field']
  },
  email: {
    type: String,
    required: [true, 'Email address should be unique'],
    unique: [true, 'Email address should be unique']
  },
  password: {
    type: String,
    required: [true, "Password can't be blank"],
    min: [8, "Can't be less than 8 chrecters"],
    max: [20, "Can't be more than 20 chrecters"]
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


// =======================================================================
// password hashing & creating admin user 
// =======================================================================
userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {

    //generating salt
    bcrypt.genSalt(saltRounds, (err, salt) => {

      // hashing the password 
      bcrypt.hash(this.password, salt, (err, hash) => {

        if (err) {
          throw err;
        }
        if (hash) {
          this.password = hash;

          // creating admin user
          if (this.email === process.env.EMAIL) {
            console.log("inside mail check pre-save hook...");
            this.isAdmin = true;
            this.isVerified = true;
            next();
          } else next();
        }
      });
    });
  }
});


const User = mongoose.model('User', userSchema);
module.exports = User;