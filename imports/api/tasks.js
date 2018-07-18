import { Mongo } from 'meteor/mongo';
//Creating and exporting MongoDB task collection
export const Tasks = new Mongo.Collection('tasks');