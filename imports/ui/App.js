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
      time: new Date()
    };
  }
  currentTime(){
    this.setState({
        time: new Date()})
  }
  componentWillMount() {
    setInterval(() => this.currentTime(), 1000)
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
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return (<Task key={task._id} task={task} showPrivateButton={showPrivateButton} />
      );
    });
  }

  renderTypeTask() {
    return this.props.currentUser ?
    <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
      <input
        type="text" 
        ref="textInput"
        placeholder="Type here to add new tasks"
      />
    </form> : '' //Ternary op for submitting tasks if user is logged in.
  }

  // function getDayOfWeek(date, {
  //   let dateTime = date + " " + time;
  //   var birthday = new Date(dateTime);
  //   var day1 = birthday.getDay();
  //   console.log(day1);
  //   return day1;
  // }
 
  render() {
    return (
      <div className="container">
        <div id="date">{this.state.time.toLocaleDateString()}</div>
        <div id="time">{this.state.time.toLocaleTimeString()} MST</div> 
        <header>
          <h1>Task Planner ({this.props.incompleteCount})</h1>
          <div className="completedTask"><b>{this.props.completeCount}</b> Completed Tasks</div>
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
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    //MongoDB commands for checking how many tasks completed 
    //or not completed.
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    completeCount: Tasks.find({checked: {$eq: true} }).count(),
    currentUser: Meteor.user()
  };
})(App);