import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Task from "./task";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 400px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
  text-align: center;
`;
const TaskList = styled.div`
  padding: 8px;
  flex-grow: 1;
  min-height: 100px;
`;

const SearchBar = styled.div`
    display: flex;
    height: 35px;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 15px;
    padding-right: 15px;
`;

const Btn = styled.button`
  display: flex;
  justify-content: center;
  width: 35px;
  height: 35px;
  align-items: center;
`;

const Input =  styled.input`
  width: 375px
`;


export default class Column extends React.Component {

  state = {value : ''}

  handleSearch = () => {
    this.props.onSearch(this.state.value);
  }

  handleChange = (event) => {
    this.setState({value: event.target.value})
  }

  render() {
    return (
      <Container>
        {this.props.column.id === "tweets" ? (
          <SearchBar>
            <Input
              value={this.state.value}
              onChange={this.handleChange}
              // id={this.props.column.id}
              placeholder={this.props.column.title}
            ></Input>
            <Btn
              onClick={this.handleSearch}
            >
              <span>{'\uD83D\uDD0D'}</span>
            </Btn>
          </SearchBar>
        ) : (
          <Title>{this.props.column.title}</Title>
        )}
        {/* wrappes the droppable area */}
        <Droppable
          //has one req props which is id
          droppableId={this.props.column.id}
        >
          {/* Droppable uses renderProps and expects its children to be a function returning JSX */}
          {/* the function takes a single arg: provided (obj) */}
          {provided => {
            return (
              <TaskList {...provided.droppableProps} ref={provided.innerRef}>
                {this.props.tweets.map((task, index) => (
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
