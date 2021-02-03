# HiTaMa
## Hierarchical TaskManager

HiTaMa is a ***single page application (SPA)*** for basic task management with groups and subgroups. It consists of a ***frontend made in Vue*** and an ***API for a MongoDB database*** on the backend.

#### Summary

The ***main functionality*** consists of managing:
- *tasks and subtasks*
- *groups and subgroups*
- *access rights for different user types*

By creating a task you automatically become its owner. You can add users to the task, who will be able to extend it with their own subtasks. Beeing a level above your group, you can edit their tasks and subtasks as you wish (***including the ownership***). This creates the *hierarchical* structure.

#### Terminology

**Task:** Main document type of this application. Currently consisting of: *title, description, icon, owner, group, tasks (*subtasks*), access and completion status as well as the dates of its creation and the last update*.
**SubTask:** A task that is *child* to another task, its *ParentTask*.
**ParentTask:** *See SubTask*
**RootTask**: A task without a parent

#### Access

Regarding a task the users are separated into owner, group, user and other.

**Owner:** Owns the task. Full access.
**Group:** Member of a tasks group. Can read the task and create subtasks.
**User:** Normal logged in User. Can read task, if public.
**Other:** Not logged in user. No access at all. Won't even know if any tasks exist.


#### Navigation

From left to right the navbar shows the tabs *Tasks*, *Task*, *Parent*, *Account* and the logout button.

**Tasks:** Table of all *roottasks*. 
**Task:** Active task. By default no task is active. To set a task as active, go to the *Tasks* tab and select an existing task or create a new one
**Parent:** Parent of the active task, if one exists. Makes navigation through the hierarchy more comfortable.
**Account:** User account information.
**Logout:** I don't think this button requires an explanation.


### Settings

##### Frontend
testmodes: *./hitama/src/conf.js*
color themes: *./hitama/src/plugins/vuetify.js*

##### Backend
server configuration: *./conf.js*
session configuration: *./sessionConf.js*

### Build
Simply run...
```
npm run freshSetup
```
...in the console and ...
```
npm run start 
```
...to start the server or...
```
npm run dev
```
...to use nodemon.

### License
HiTaMa is licenced under the [MIT license](https://choosealicense.com/licenses/mit/).

### Sources

Icons: [pixabay.com](https://www.pixabay.com).