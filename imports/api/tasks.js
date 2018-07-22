import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

//Creating and exporting MongoDB task collection
export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    // Server side
    Meteor.publish('tasks', function tasksPublication() {
        //publish public tasks or tasks that are central to a user.
        return Tasks.find({
            $or: [
              { private: { $ne: true }},
              { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    'tasks.insert'(text) {
      check(text, String);
   
      // Check if user is authenticated before adding a task
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }
      Tasks.insert({
        text,
        createdAt: new Date(),
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
      });
    },
    'tasks.remove'(taskId) {
      check(taskId, String);
      const task = Tasks.findOne(taskId);
      //owner can delete task if it's private
      if (task.private && task.owner !== this.userId) {
        throw new Meteor.Error('not-authorized', "private and id's dont match");
      }
      //handles public task that a user should not delete unless it's their own
      if (!task.private && task.owner !=this.userId) {
        throw new Meteor.Error('not-authorized', "can't delete public tasks");
      }
      Tasks.remove(taskId);
    },
    'tasks.setChecked'(taskId, setChecked) {
      check(taskId, String);
      check(setChecked, Boolean);
      const task = Tasks.findOne(taskId);
      //Owner cannot update task unless it's public or it's theirs
      //by userId
      if (task.private && task.owner !== this.userId) {
        throw new Meteor.Error('not-authorized');
      }
      Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);
        const task = Tasks.findOne(taskId);
        //Owner can make their own task private 
        if (task.owner !== this.userId) {
          throw new Meteor.Error('not-authorized', 'user must be authorized');
        }
        Tasks.update(taskId, { $set: { private: setToPrivate } });
      },
  });
