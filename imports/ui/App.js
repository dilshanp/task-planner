import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js';
import Task from './Task.js';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.js';

 
// App component - represents the whole app

class App extends Component {
  constructor(props) { //Properties for App class
    super(props);
    this.state = {
      hideCompleted: false,
    };
  }
  handleSubmit(event) {
    event.preventDefault();
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('tasks.insert', text);
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({hideCompleted: !this.state.hideCompleted})
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  renderTypeTask() {
    return this.props.currentUser ?
    <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
      <input
        type="text" 
        ref="textInput"
        placeholder="Type to add new tasks"
      />
    </form> : '' //Ternary operation for submitting tasks if user is logged in.
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Task Planner ({this.props.incompleteCount})</h1>
          <div className="completedTask"><b>{this.props.completeCount}</b> Completed Task(s) </div>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            <b>Hide Completed Tasks</b>
          </label>
          <AccountsUIWrapper />
          {this.renderTypeTask()}
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    //MongoDB commands for checking how many tasks completed 
    //or not completed.
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    completeCount: Tasks.find({checked: {$eq: true} }).count(),
    currentUser: Meteor.user()
  };
})(App);