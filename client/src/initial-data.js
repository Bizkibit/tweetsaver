const initialData = {
    tasks: {
        'task-1': {id: 'task-1', content: 'something-1'},
        'task-2': {id: 'task-2', content: 'something-2'},
        'task-3': {id: 'task-3', content: 'something-3'},
        'task-4': {id: 'task-4', content: 'something-4'},
        'task-5': {id: 'task-5', content: 'something-5'},
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To do',
            //indicated owndership
            //maintain order
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4', 'task-5']
        },
        'column-2': {
            id: 'column-2',
            title: 'In progress',
            //indicated owndership
            //maintain order
            taskIds: []
        }
    },

    //order of columns
    columnOrder : ['column-1', 'column-2']
}

export default initialData;