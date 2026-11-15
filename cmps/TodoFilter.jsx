import { utilService } from "../services/util.service.js"
import { SET_FILTER_BY } from "../store/todo.reducer.js"

const { useState, useEffect, useRef } = React
const { useSelector, useDispatch } = ReactRedux

export function TodoFilter() {

    const filterBy = useSelector(storeState => storeState.todoModule.filterBy)
    const dispatch = useDispatch()

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const debouncedApplyFilter = useRef(utilService.debounce(filterBy => {
        dispatch({ type: SET_FILTER_BY, filterBy })
    }, 500)).current

    useEffect(() => {
        debouncedApplyFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default: break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // Optional support for LAZY Filtering with a button
    function onSubmitFilter(ev) {
        ev.preventDefault()
        setFilterByToEdit(filterByToEdit)
    }

    const { txt, importance, status } = filterByToEdit
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Search: </label>
                <input value={txt} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt" />

                <label htmlFor="importance">Importance: </label>
                <input value={importance || ''} onChange={handleChange}
                    type="number" placeholder="By Importance" id="importance" name="importance" />

                <label htmlFor="status">Status: </label>
                <select value={status} onChange={handleChange} id="status" name="status">
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="done">Done</option>
                </select>

                <button hidden>Set Filter</button>
            </form>
        </section>
    )
}