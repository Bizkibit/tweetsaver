import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./components/column";
import { searchTweet, readTweets } from "./api";
import { prepareNewColumns } from "./utils/prepareNewColumns";

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: lightblue;
`;

class App extends React.Component {
  state = {
    tweets: {},
    columns: {
      tweets: {
        id: "tweets",
        title: "Search Twitter",
        tweetIds: []
      },
      saved: {
        id: "saved",
        title: "Saved tweets",
        tweetIds: []
      }
    },
    columnOrder: ["tweets", "saved"]
  };

  //callback for handling dropping action
  onDragEnd = result => {
    const { destination, source } = result;
    const { columns } = this.state;

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

    const { newStart, newFinish, newTweetIds } = prepareNewColumns(
      columns,
      result
    );

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        ...(newFinish && { [newFinish.id]: newFinish })
      }
    };

    this.setState(newState);

    //saving new tweet ids 
    if (
      destination.droppableId === "saved" ||
      destination.droppableId !== source.droppableId
    ) {
      const stringifyIds = JSON.stringify(newTweetIds);
      localStorage.setItem("savedIds", stringifyIds);
    }
  };

  readSavedTweets = () => {
    const tweetIds = JSON.parse(localStorage.getItem("savedIds"));
    const savedIds = tweetIds || [];
    readTweets(savedIds).then(tweets => {
      const savedColumn = {
        ...this.state.columns["saved"],
        tweetIds: savedIds
      };
      this.setState({
        tweets: { ...tweets },
        columns: {
          ...this.state.columns,
          saved: savedColumn
        }
      });
    })
  };

  componentDidMount() {
    this.readSavedTweets();
  }

  onSearch = phrase => {
    searchTweet(phrase)
      .then((tweets = {}) => {
        const newState = {
          tweets: {
            ...this.state.tweets,
            ...tweets
          },
          columns: {
            ...this.state.columns,
            tweets: {
              ...this.state.columns["tweets"],
              tweetIds: Object.keys(tweets)
            }
          }
        };

        this.setState(newState);
      })
      .catch(console.error);
  };

  render() {
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
      >
        <h1>Tweet Saver</h1>
        <hr />
        <Container>
          {this.state.columnOrder.map(columnId => {
            const { [columnId]: column } = this.state.columns;
            const tweets = column.tweetIds.map(
              tweetId => this.state.tweets[tweetId]
            );

            const props = {
              key: column.id,
              column,
              tweets,
              ...(column.id === "tweets" && { onSearch: this.onSearch })
            };
            return <Column {...props} />;
          })}
        </Container>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
