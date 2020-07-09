import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./task";
import { Container, Title, TaskList, SearchBar, Btn, Input } from './styledComponents';


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
