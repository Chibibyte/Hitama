const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');
const schemaUtil = require('./schemaUtil');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        validate: schemaUtil.uniqueValidator('User', 'name')
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: schemaUtil.uniqueValidator('User', 'email')
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [4, 'Password must have 4 characters or more']
    },
    icon: {
        type: Schema.Types.Mixed,
        required: [true, 'Icon is required'],
        default: schemaUtil.forwardRelPath(__dirname, 'res/user_icon.png')
    },
    tasks: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
        required: [true, 'Tasks are required'],
        default: []
    },
},
    { timestamps: true })


UserSchema.pre('save', async function (next) {
    // check if crypt necessary
    let oldDoc = await mongoose.models.User.findById(this._id);
    if (this.password && (!oldDoc || oldDoc.password !== this.password)) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    schemaUtil.storeIcon(this, ['db_public', 'users', this._id + '']);
    next();
});

UserSchema.pre('remove', async function (next) {
    // remove tasks
    if (this.tasks.length > 0) {
        let tasks = await mongoose.models.Task.find({ '_id': { $in: this.tasks } });
        if (!tasks) return next();
        let promises = [];
        tasks.forEach(task => promises.push(task.remove()));
        await Promise.all(promises);
    }
    next();
})

// more validation
schemaUtil.regexPathValidator(UserSchema, 'email', /^\S+@\S+\.\S+$/);


const User = mongoose.model('User', UserSchema);
module.exports = User;