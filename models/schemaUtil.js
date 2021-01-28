const mongoose = require('mongoose');
const apiUtil = require('../api/util');
const path = require('path');

function forwardRelPath(first, second) {
    let absPath = path.resolve(first, second);
    let relPath = path.relative(first, absPath);
    return relPath;
}

function uniqueValidator(modelName, path) {
    return {
        validator: async (value) => {
            const pathCount = await mongoose.models[modelName].countDocuments({ [path]: value });
            return !pathCount;
            // const docs = await mongoose.models[modelName].find({ [path]: value });
            // return (docs.length === 0);
        },
        message: () => `${apiUtil.capitalize(path)} already exists`
    }
}

function regexPathValidator(schema, path, regex) {
    schema.path(path).validate(async (value) => {
        return regex.test(value);
    }, `Not a valid ${path}!`);
}

function storeIcon(modelInstance, iconSubDirs) {
    if (modelInstance.icon && typeof modelInstance.icon !== 'string') {
        try {
            // store image
            apiUtil.dbStoreIcon(iconSubDirs, modelInstance.icon);
            // replace icon file with path
            let absPath = path.resolve(apiUtil.publicFilesPath, ...iconSubDirs, 'icon', modelInstance.icon.name);
            modelInstance.icon = path.relative(apiUtil.publicFilesPath, absPath);
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = {
    uniqueValidator,
    regexPathValidator,
    storeIcon,
    forwardRelPath
}