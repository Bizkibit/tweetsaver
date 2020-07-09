import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./components/column";
import { searchTweet } from './api';

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = {
    tweets: {},
    columns: {
      "tweets": {
        id: "tweets",
        title: "Tweets",
        tweetIds: []
      },
      "saved": {
        id: "saved",
        title: "Saved tweets",
        tweetIds: []
      }
    },
    columnOrder: ["tweets", "saved"]
  };

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
      const newTaskIds = Array.from(column.tweetIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      //check if its being moved within saved list
      if (start.id === 'saved') {
        const {tweets} = this.state;
        const savedTweets = {};
        newTaskIds.forEach(id => savedTweets[id] = tweets[id])

        const stringifyIds = JSON.stringify(newTaskIds);
        const stringifyTasks = JSON.stringify(savedTweets);

        localStorage.setItem('savedIds', stringifyIds);
        localStorage.setItem('savedTweets', stringifyTasks);
      }

      const newColumn = {
        ...column,
        tweetIds: newTaskIds
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
      const startTaskIds = Array.from(start.tweetIds);
      startTaskIds.splice(source.index, 1);

      const newStart = {
        ...start,
        tweetIds: startTaskIds
      };

      const finishTaskIds = Array.from(finish.tweetIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newFinish = {
        ...finish,
        tweetIds: finishTaskIds
      };

      const {tweets} = this.state;
      // case where items are being removed from saved column
      if (start.id === 'saved') {
        const savedTweets = {};
        startTaskIds.forEach(id => savedTweets[id] = tweets[id])

        const stringifyIds = JSON.stringify(startTaskIds);
        const stringifyTasks = JSON.stringify(savedTweets);

        localStorage.setItem('savedIds', stringifyIds);
        localStorage.setItem('savedTweets', stringifyTasks);
      } else {
        const savedTweets = {};
        finishTaskIds.forEach(id => savedTweets[id] = tweets[id])

        const stringifyIds = JSON.stringify(finishTaskIds);
        const stringifyTasks = JSON.stringify(savedTweets);

        localStorage.setItem('savedIds', stringifyIds);
        localStorage.setItem('savedTweets', stringifyTasks);
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
    //read saved tweets from local storage
    new Promise(resolve => {
        const tweets = JSON.parse(localStorage.getItem('savedTweets'));
        const tasksIds = JSON.parse(localStorage.getItem('savedIds'));
        resolve({tweets, tasksIds})
    }).then(({tweets, tasksIds}) => {

      const savedIds = tasksIds || [];

      const savedColumn = {
        ...this.state.columns["saved"],
        tweetIds: savedIds
      };

      this.setState({
        tweets: { ...tweets },
        columns: {
          ...this.state.columns,
          "saved": savedColumn,
        }
      });
    });
  };

  componentDidMount() {
    this.readSavedTweets();
  }

  onSearch = (phrase) => {
    searchTweet(phrase)
    .then((tweets = {}) => {
      const newState = {
        tweets: {
          ...this.state.tweets,
          ...tweets
        },
        columns: {
          ...this.state.columns,
          'tweets': {
            ...this.state.columns['tweets'],
            tweetIds: Object.keys(tweets),
          }
        }
      }

      this.setState(newState)
    }
    ).catch(console.error)
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
            const tweets = column.tweetIds.map(
              taskId => this.state.tweets[taskId]
            );

            const props = {
              key: column.id,
              column,
              tweets,
              ...(column.id === 'tweets' && {onSearch: this.onSearch})
            }
            return <Column {...props}/>;
          })}
        </Container>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
