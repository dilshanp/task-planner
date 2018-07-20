import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';


// Task component - represents a single Task item
export default class Task extends Component {
  toggleChecked() {
    // Set the checked property for task to opposite value.
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }
 //Remove the task by id
  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }
  render() {
     // Associate className with task for CSS styling
    const taskClassName = this.props.task.checked ? 'checked' : '';
    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
      <input
        type="checkbox"
        readOnly
        checked={!!this.props.task.checked}
        onClick={this.toggleChecked.bind(this)}
      />
      <span className="text">
        <strong>{this.props.task.username}</strong>: {this.props.task.text}
      </span>
    </li>
  );
}
}