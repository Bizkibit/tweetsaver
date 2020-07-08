import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
// import initialData from "./initial-data";
import Column from "./column";
import { DragDropContext } from "react-beautiful-dnd";

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = {
    tasks: {
      // "task-1": { id: "task-1", content: "something-1" },
      // "task-2": { id: "task-2", content: "something-2" },
      // "task-3": { id: "task-3", content: "something-3" },
      // "task-4": { id: "task-4", content: "something-4" },
      // "task-5": { id: "task-5", content: "something-5" }
    },
    columns: {
      "column-1": {
        id: "column-1",
        title: "Tweets",
        //indicated owndership
        //maintain order
        taskIds: []
        // taskIds: ["task-1", "task-2", "task-3", "task-4", "task-5"]
      },
      "column-2": {
        id: "column-2",
        title: "Saved tweets",
        //indicated owndership
        //maintain order
        taskIds: []
      }
    },

    //order of columns
    columnOrder: ["column-1", "column-2"]
  };
  // state = initialData;

  //callback for handling dropping action
  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const column = start;
      const newTaskIds = Array.from(column.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...column,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      };

      this.setState(newState);
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);

      const newStart = {
        ...start,
        taskIds: startTaskIds
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newFinish = {
        ...finish,
        taskIds: finishTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      };
      this.setState(newState);
    }
  };

  readSavedTweets = () => {
    const tasks = {
      "task-1": { id: "task-1", content: "something-1" },
      "task-2": { id: "task-2", content: "something-2" },
      "task-3": { id: "task-3", content: "something-3" },
      "task-4": { id: "task-4", content: "something-4" },
      "task-5": { id: "task-5", content: "something-5" }
    };
    //read saved tweets from local storage
    new Promise(resolve => {
      setTimeout(() => resolve(tasks), 500);
    }).then(response => {
      const savedColumn = {
        ...this.state.columns["column-2"],
        taskIds: Object.keys(response)
      };

      this.setState({
        tasks: { ...response },
        columns: {
          ...this.state.columns,
          "column-2": savedColumn
        }
      });
    });
  };

  componentDidMount() {
    this.readSavedTweets();
  }

  render() {
    return (
      <DragDropContext
        // onDragStart
        // onDragUpdate
        //required
        onDragEnd={this.onDragEnd}
      >
        <Container>
          {this.state.columnOrder.map(columnId => {
            const { [columnId]: column } = this.state.columns;
            const tasks = column.taskIds.map(
              taskId => this.state.tasks[taskId]
            );
            // return column.title;
            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </Container>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
