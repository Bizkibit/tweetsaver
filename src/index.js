import React from "react";
import ReactDOM from "react-dom";
import initialData from "./initial-data";
import Column from "./column";
import { DragDropContext } from "react-beautiful-dnd";

class App extends React.Component {
  state = initialData;

  onDragEnd = (result) => {
    console.log(result);
    const {destination, source, draggableId} = result;

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const column = this.state.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumn.id]: newColumn,
      }
    }

    this.setState(newState);
  }

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
          const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
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
