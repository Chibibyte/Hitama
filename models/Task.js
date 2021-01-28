const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');
const schemaUtil = require('./schemaUtil');
const crud = require('../api/crud');

const TaskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    icon: {
        type: Schema.Types.Mixed,
        required: [true, 'Icon is required'],
        default: schemaUtil.forwardRelPath(__dirname, 'res/task_icon.png')
    },
    public: {
        type: Boolean,
        default: false
    },
    tasks: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
        required: [true, 'Tasks are required'],
        default: []
    },
    parent: {
        type: Schema.ObjectId,
        ref: 'Task',
        default: null
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner is required']
    },
    group: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        required: [true, 'Group is required'],
        default: []
    },
    complete: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true })


TaskSchema.pre('save', async function (next) {
    schemaUtil.storeIcon(this, ['db_public', 'tasks', this._id + ""]);

    // completion
    // only possible if subtasks completed
    if (this.complete && this.tasks && this.tasks.length > 0) {
        let completion = true;
        for (let i = 0; i < this.tasks.length; i++) {
            const subId = this.tasks[i];
            let subtask = await mongoose.models.Task.findById(subId);
            if (subtask && !subtask.complete) {
                completion = false;
                break;
            }
        }
        this.complete = completion;
    }

    // add to parent and update its completion
    if (this.parent) {
        let parent = await mongoose.models.Task.findById(this.parent);
        if (!parent.tasks.includes(this._id)) {
            parent.tasks.push(mongoose.Types.ObjectId(this._id));
            if (!this.complete && parent.complete) parent.complete = false;
            await parent.save({ validateModifiedOnly: true });
        }
    }
    // update user tasks and group
    let owner = await mongoose.models.User.findById(this.owner);
    if (owner && !owner.tasks.includes(this._id)) {
        // update user tasks
        owner.tasks.push(mongoose.Types.ObjectId(this._id));
        crud.outputFilter(owner, ['tasks', '_id'], true);

        // update group
        if (this.group.includes(owner._id)) {
            let index = this.group.indexOf(owner._id);
            this.group.splice(index, 1);
        }

        await owner.save({ validateBeforeSave: false });
    }
    next();
});

TaskSchema.pre('remove', async function (next) {
    // remove subtasks
    if (this.tasks.length > 0) {
        let subtasks = await mongoose.models.Task.find({ '_id': { $in: this.tasks } });
        if (!subtasks) return next();
        let promises = [];
        subtasks.forEach(sub => promises.push(sub.remove()));
        await Promise.all(promises);
    }

    // remove self from parent
    if (this.parent !== null) {
        let parent = await mongoose.models.Task.findById(this.parent);
        if (!parent) return;
        let index = parent.tasks.indexOf(this._id);
        if (index >= 0) {
            parent.tasks.splice(index, 1);
            crud.outputFilter(parent, ['tasks', '_id'], true);
            await parent.save({ validateBeforeSave: false });
        }
    }

    // update user tasks
    let owner = await mongoose.models.User.findById(this.owner);
    if (owner.tasks.includes(this._id)) {
        let index = owner.tasks.indexOf(this._id);
        owner.tasks.splice(index, 1);
        crud.outputFilter(owner, ['tasks', '_id'], true);
        await owner.save({ validateBeforeSave: false });
    }

    next();
})

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;