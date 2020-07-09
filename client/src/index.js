import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./components/column";
import { searchTweet } from "./api";
import { prepareNewColumns } from "./utils/prepareNewColumns";

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = {
    tweets: {},
    columns: {
      tweets: {
        id: "tweets",
        title: "Tweets",
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
    const { columns, tweets } = this.state;

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
    //currently tweet obj are being saved so it can be read on init
    //it can be removed once the init read tweets is implemented.
    if (
      destination.droppableId === "saved" ||
      destination.droppableId !== source.droppableId
    ) {
      const savedTweets = {};
      newTweetIds.forEach(id => (savedTweets[id] = tweets[id]));

      const stringifyIds = JSON.stringify(newTweetIds);
      const stringifyTweets = JSON.stringify(savedTweets);

      localStorage.setItem("savedIds", stringifyIds);
      localStorage.setItem("savedTweets", stringifyTweets);
    }
  };

  readSavedTweets = () => {
    //read saved tweets from local storage
    //currently the tweet objects are being saved and read from localStorage
    //this can be furthere optimized to only save the tweetids and on init a
    // api call to be made to retrieve these tweets and update the state.
    new Promise(resolve => {
      const tweets = JSON.parse(localStorage.getItem("savedTweets"));
      const tweetIds = JSON.parse(localStorage.getItem("savedIds"));
      resolve({ tweets, tweetIds });
    }).then(({ tweets, tweetIds }) => {
      const savedIds = tweetIds || [];

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
    });
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
