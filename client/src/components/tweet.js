import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
  background-color: white;
`;

export default class Tweet extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.tweet.id} index={this.props.index}>
        {/* //these are gonna be the tweets */}
        {provided => (
          <Container
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <img 
              src={this.props.tweet.pic} 
              alt=''
            />
            <div>{this.props.tweet.name} <span>{`@${this.props.tweet.handle}`}</span></div>
            {this.props.tweet.content}
          </Container>
        )}
      </Draggable>
    );
  }
}
