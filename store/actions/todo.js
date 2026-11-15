import { store } from '../store.js'
import { ADD_TODO, EDIT_TODO, REMOVE_TODO, SET_TODOS, SET_IS_LOADING } from '../todo.reducer.js'
import { SET_USER} from '../user.reducer.js'
import { todoService } from '../../services/todo.service.js'
import { userService } from '../../services/user.service.js'

export function loadTodos() {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    return todoService.query()
        .then(todos => store.dispatch({ type: SET_TODOS, todos }))
        .finally(() => store.dispatch({ type: SET_IS_LOADING, isLoading: false }))
}

export function removeTodo(todoId) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    return todoService.remove(todoId)
        .then(() => store.dispatch({ type: REMOVE_TODO, todoId }))
        .finally(() => store.dispatch({ type: SET_IS_LOADING, isLoading: false }))
}

export function saveTodo(todo) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    const type = todo._id ? EDIT_TODO : ADD_TODO
    const isNew = !todo._id

    return todoService.save(todo)
        .then(savedTodo => {
            store.dispatch({ type, todo: savedTodo })

            const user = userService.getLoggedinUser()

            if (user) {
                const activityType = isNew ? 'todo added' : 'edit todo'
                const credit = isNew ? 10 : 0

                userService.addActivity(user._id, activityType, { todoId: savedTodo._id }, credit)
                    .then(updatedUser => {
                        store.dispatch({ type: SET_USER, loggedinUser: updatedUser })
                    })
            }
            return savedTodo
        })
        .finally(() => store.dispatch({ type: SET_IS_LOADING, isLoading: false }))

}

export function getFilteredTodos(state) {
    const { filterBy, todos } = state.todoModule
    let filteredTodos = [...todos]

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredTodos = todos.filter(todo => regExp.test(todo.txt))
    }

    if (filterBy.importance) {
        filteredTodos = todos.filter(todo => todo.importance >= filterBy.importance)
    }

    if (filterBy.status) {
        filteredTodos = todos.filter(todo => filterBy.status === 'done' ? todo.isDone : !todo.isDone)
    }

    return filteredTodos
}