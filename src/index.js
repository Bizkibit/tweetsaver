import React from "react";
import ReactDOM from "react-dom";
import initialData from "./initial-data";
import Column from "./column";
import { DragDropContext } from "react-beautiful-dnd";

class App extends React.Component {
  state = initialData;

  onDragEnd = () => {}

  render() {
    return (
      <DragDropContext
        // onDragStart
        // onDragUpdate
        //required
        onDragEnd={this.onDragEnd}
      
      >
        {this.state.columnOrder.map(columnId => {
          const { [columnId]: column } = this.state.columns;
          const tasks = column.tasksIds.map(taskId => this.state.tasks[taskId]);
          console.log(column);
          console.log(tasks);

          // return column.title;
          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
