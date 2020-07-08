import React from "react";
import ReactDOM from "react-dom";
import initialData from './initial-data';
import Column from './column';

class App extends React.Component {
  state = initialData;
  render() {
    return this.state.columnOrder.map((columnId) => {
      const {[columnId]: column} = this.state.columns;
      const tasks = column.tasksIds.map(taskId => this.state.tasks[taskId]);
      console.log(column);
      console.log(tasks);

      // return column.title;
      return <Column key={column.id} column={column} tasks={tasks}/>
    })
  }
};

ReactDOM.render(<App />, document.getElementById("root"));
