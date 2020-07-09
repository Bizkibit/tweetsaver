export const prepareNewColumns = (columns, result) => {
  const { destination, source, draggableId } = result;
  const start = columns[source.droppableId];
  const finish = columns[destination.droppableId];

  let newStart = {};
  let newFinish = null;
  let newTweetIds = [];

  //case where item was dragged and droped in the same list
  if (start === finish) {
    const column = start;
    newTweetIds = Array.from(column.tweetIds);
    newTweetIds.splice(source.index, 1);
    newTweetIds.splice(destination.index, 0, draggableId);

    newStart = {
      ...column,
      tweetIds: newTweetIds
    };
  } else {
    //case where item is being moved between lists
    const startTweetIds = Array.from(start.tweetIds);
    startTweetIds.splice(source.index, 1);

    newStart = {
      ...start,
      tweetIds: startTweetIds
    };

    const finishTweetIds = Array.from(finish.tweetIds);
    finishTweetIds.splice(destination.index, 0, draggableId);

    newFinish = {
      ...finish,
      tweetIds: finishTweetIds
    };

    newTweetIds = start.id === "saved" ? startTweetIds : finishTweetIds;
  }

  return {
    newStart,
    newFinish,
    newTweetIds
  };
};
