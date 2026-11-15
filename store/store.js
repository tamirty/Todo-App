import { todoReducer } from "./todo.reducer.js"
import { userReducer } from "./user.reducer.js"

const { createStore, combineReducers } = Redux

const appReducer = combineReducers({
    todoModule: todoReducer,
    userModule: userReducer,
})

export const store = createStore(appReducer)
window.gStore = store