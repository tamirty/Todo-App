import { todoService } from "../services/todo.service.js"
import { userService } from "../services/user.service.js"

const { createStore } = Redux

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const EDIT_TODO = 'EDIT_TODO'

export const SET_FILTER_BY = 'SET_FILTER_BY'

export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'

export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    todos: [],
    filterBy: todoService.getDefaultFilter(),
    loggedinUser: userService.getLoggedinUser(),
    isLoading: false,
}

export function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id !== cmd.todoId)
            }

        case ADD_TODO:
            return { ...state, todos: [...state.todos, cmd.todo] }

        case EDIT_TODO:
            return {
                ...state, todos:
                    state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo)
            }

        case SET_FILTER_BY:
            return { ...state, filterBy: cmd.filterBy }

        case SET_USER:
            return { ...state, loggedinUser: cmd.loggedinUser }

        case SET_USER_BALANCE:
            if (!state.loggedinUser) return state

            const balance = state.loggedinUser.balance + 10
            var loggedinUser = {...state.loggedinUser, balance}
            return { ...state, loggedinUser }

        case SET_IS_LOADING:
            return { ...state, isLoading: cmd.isLoading }

        default:
            return state
    }
}

export const store = createStore(appReducer)
window.gStore = store