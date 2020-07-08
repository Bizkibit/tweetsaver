import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Task from "./task";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  flex-grow: 1;
  min-height: 100px;
`;

export default class Column extends React.Component {
  render() {
    // return this.props.column.title
    return (
      <Container>
        {/* this is where the searchbar component will go */}
        <Title>{this.props.column.title}</Title>
        {/* wrappes the droppable area */}
        <Droppable
          //has one req props which is id
          droppableId={this.props.column.id}
        >
          {/* Droppable uses renderProps and expects its children to a function returning JSX */}
          {/* the function takes 2 args: 1. provided (obj) */}
          {provided => {
            return (
              <TaskList {...provided.droppableProps} ref={provided.innerRef}>
                {this.props.tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </TaskList>
            );
          }}
        </Droppable>
      </Container>
    );
  }
}
