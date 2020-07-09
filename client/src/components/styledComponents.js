import styled from "styled-components";

export const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 400px;
  display: flex;
  flex-direction: column;
`;
export const Title = styled.h3`
  padding: 8px;
  text-align: center;
`;
export const TaskList = styled.div`
  padding: 8px;
  flex-grow: 1;
  min-height: 100px;
`;

export const SearchBar = styled.div`
    display: flex;
    height: 35px;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 15px;
    padding-right: 15px;
`;

export const Btn = styled.button`
  display: flex;
  justify-content: center;
  width: 35px;
  height: 35px;
  align-items: center;
`;

export const Input =  styled.input`
  width: 375px
`;