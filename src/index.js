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


    //case the destination of drag is outside of a draggable 
    if (!destination) {
      return;
    }

    //case where item was dragged and droped at the same spot
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    //case where item is being dragged within the same list
    if (start === finish) {
      const column = start;
      const newTaskIds = Array.from(column.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      //check if its being moved within saved list
      if (start.id === 'column-2') {
        const {tasks} = this.state;
        const savedTasks = {};
        newTaskIds.forEach(id => savedTasks[id] = tasks[id])

        const stringifyIds = JSON.stringify(newTaskIds);
        const stringifyTasks = JSON.stringify(savedTasks);

        localStorage.setItem('savedIds', stringifyIds);
        localStorage.setItem('savedTasks', stringifyTasks);
      }

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

      //case where item is being moved between lists
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

      const {tasks} = this.state;
      // case where items are being removed from saved column
      if (start.id === 'column-2') {
        const savedTasks = {};
        startTaskIds.forEach(id => savedTasks[id] = tasks[id])

        const stringifyIds = JSON.stringify(startTaskIds);
        const stringifyTasks = JSON.stringify(savedTasks);

        localStorage.setItem('savedIds', stringifyIds);
        localStorage.setItem('savedTasks', stringifyTasks);
      } else {
        const savedTasks = {};
        finishTaskIds.forEach(id => savedTasks[id] = tasks[id])

        const stringifyIds = JSON.stringify(finishTaskIds);
        const stringifyTasks = JSON.stringify(savedTasks);

        localStorage.setItem('savedIds', stringifyIds);
        localStorage.setItem('savedTasks', stringifyTasks);
      }

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
    //init some tasks
    const mockTasks = {
      "task-1": { id: "task-1", content: "something-1" },
      "task-2": { id: "task-2", content: "something-2" },
      "task-3": { id: "task-3", content: "something-3" },
      "task-4": { id: "task-4", content: "something-4" },
      "task-5": { id: "task-5", content: "something-5" }
    };
    localStorage.setItem('savedTasks', JSON.stringify(mockTasks));

    //read saved tweets from local storage
    new Promise(resolve => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem('savedTasks'));
        const tasksIds = JSON.parse(localStorage.getItem('savedIds'));
        resolve({tasks, tasksIds})
      }, 500);
    }).then(({tasks, tasksIds}) => {

      const savedIds = tasksIds || [];

      const savedColumn = {
        ...this.state.columns["column-2"],
        taskIds: savedIds
      };

      const regColumn = {
        ...this.state.columns["column-1"],
        taskIds: Object.keys(tasks).filter(key => !savedIds.includes(key))
      };

      this.setState({
        tasks: { ...tasks },
        columns: {
          ...this.state.columns,
          "column-1": regColumn,
          "column-2": savedColumn,
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
        //onDragEnd required
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
