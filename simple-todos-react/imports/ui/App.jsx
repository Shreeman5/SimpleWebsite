import React, { useState } from 'react';
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";

export const App = () => {
  const isLoading = useSubscribe("tasks");
  const [hideCompleted, setHideCompleted] = useState(false);
  const hideCompletedFilter = { isChecked: { $ne: true } };
  console.log('no')
  const tasks = useTracker(() =>
    TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      sort: { createdAt: -1 },
    }).fetch()
  );
  const pendingTasksCount = useTracker(() =>
    TasksCollection.find(hideCompletedFilter).count()
  );
  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : ''
  }`;
  const handleToggleChecked = ({ _id, isChecked }) => Meteor.callAsync("tasks.toggleChecked", { _id, isChecked });
  const handleDelete = ({ _id }) => Meteor.callAsync("tasks.delete", { _id });
  

  if (isLoading()) {
    return <div>Loading...</div>;
  }
  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>
              📝️ To Do List
              {pendingTasksTitle}
            </h1>
          </div>
        </div>
      </header>
      
      <div className="main">
        <TaskForm />
        <div className="filter">
         <button onClick={() => setHideCompleted(!hideCompleted)}> {hideCompleted ? 'Show All' : 'Hide Completed'}
         </button>
        </div>
        <ul className="tasks">
          {tasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              onCheckboxClick={handleToggleChecked}
              onDeleteClick={handleDelete}
            />
          ))}
        </ul>
        
      </div>
    </div>
  );
};