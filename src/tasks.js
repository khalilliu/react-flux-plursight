import { Dispatcher, ReduceStore } from './flux';
import {generate as id} from 'shortid';

const tasksDispatcher = new Dispatcher();

const CREATE_TASK = `CREATE_TASK`;
const COMPLETE_TASK = `COMPLETE_TASK`;
const SHOW_TASKS = `SHOW_TASKS`;

const createNewTaskAction = (content) => {
	return {
		type: CREATE_TASK,
		value: content
	}
}

const completeTaskAction = (id, isComplete) => {
	return {
		type: COMPLETE_TASK,
		id,
		value: isComplete
	}
}

const showTasksAction = (show) => {
	return {
		type: SHOW_TASKS,
		value: show
	}
}

const initialState = {
    tasks: [{
        id: id(),
        content: "Update CSS styles",
        complete: false
    }, {
        id: id(),
        content: "Add unit tests",
        complete: false
    }, {
        id: id(),
        content: "Post to social media",
        complete: false
    },{
        id: id(),
        content: "Install hard drive",
        complete: true
    }],
    showComplete:true
};

class TaskStore extends ReduceStore{
	getInitialState(){
		return initialState;
	}

	reduce(state, action){
		console.log('previour state',state);
		let newState;
		console.log('processing action', action);
		switch (action.type) {
			case CREATE_TASK:
				newState = {...state, tasks: [...state.tasks]};
				newState.tasks.push({
					id:id(),
					content: action.value,
					complete: false
				});
				return newState;
				break;
			case COMPLETE_TASK:
				newState = {...state, tasks: [...state.tasks]};
				const affectedElementIndex = newState.tasks.findIndex(t => t.id === action.id);
				newState.tasks[affectedElementIndex] = { ...state.tasks[affectedElementIndex], complete: true};
				return newState;
				break;
			case SHOW_TASKS:
				newState = {...state, showComplete: action.value};
				return newState;
		}
		return state;
	}

	getState(){
		return this.__state;
	}
}

const tasksStore = new TaskStore(tasksDispatcher);

const render = () => {
	const TaskComponent = ({content, complete, id}) => {
		return (
			`<section>
				${content}<input type='checkbox' name='taskCompleteCheck' data-taskid=${id} ${complete ? 'checked' : ''}>
			</section>`
		)
	}

	const takssSection = document.getElementById('tasks');
	const state = tasksStore.getState();

	console.info('new state', state);

	const rendered = tasksStore.getState().tasks
		.filter(task => state.showComplete ? true : !task.complete )
		.map(TaskComponent).join('');

	takssSection.innerHTML = rendered;

	/* Add listeners to newly generated checkboxes */
	document.getElementsByName('taskCompleteCheck').forEach(element => {
		element.addEventListener('change', (e)=>{
			const id = e.target.attributes['data-taskid'].value;
			const checked = e.target.checked;
			tasksDispatcher.dispatch(completeTaskAction(id,checked));
		})
	})
};


document.forms.newTask.addEventListener('submit', (e)=>{
	e.preventDefault();
	const name = e.target.newTaskName.value;
	if(name){
		tasksDispatcher.dispatch(createNewTaskAction(name));
		e.target.newTaskName.value = null;
	}
});

document.forms.undo.addEventListener('submit',(e)=>{
	e.preventDefault();
	tasksStore.revertLastState();
})

document.getElementById('showComplete').addEventListener('change',({target})=>{
	const showComplete = target.checked;
	tasksDispatcher.dispatch(showTasksAction(showComplete));
})


tasksStore.addListener(()=>{
	render();
})

render();