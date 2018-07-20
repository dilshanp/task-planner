import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';


//Creating and exporting MongoDB task collection
export const Tasks = new Mongo.Collection('tasks');
Meteor.methods({
    'tasks.insert'(text) {
      check(text, String);
   
      // Check if user is authenticated before adding a task
      if (! this.userId) {
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
   
      Tasks.remove(taskId);
    },
    'tasks.setChecked'(taskId, setChecked) {
      check(taskId, String);
      check(setChecked, Boolean);
   
      Tasks.update(taskId, { $set: { checked: setChecked } });
    },
  });
