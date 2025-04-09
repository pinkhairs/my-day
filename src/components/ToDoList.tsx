import ToDo from '@/components/ToDo'
import { useState, useEffect } from 'react'

function ToDoList() {
  const [todos, setTodos] = useState<string[]>(['Write to ma']);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [validList, setValidList] = useState<boolean | null>(null);

  // Add todo at the end
  const addTodo = () => {
    const newIndex = todos.length;
    setTodos(prev => [...prev, '']);
    setFocusIndex(newIndex);
  };

  // Add todo after the specified index
  const addTodoAfterIndex = (index: number) => {
    const newIndex = index + 1;
    setTodos(prev => {
      const newTodos = [...prev];
      // Insert new empty todo at index + 1
      newTodos.splice(newIndex, 0, '');
      return newTodos;
    });
    setFocusIndex(newIndex);
  };

  const removeTodo = (indexToRemove: number) => {
    setTodos(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const updateTodo = (index: number, newValue: string) => {
    setTodos(prev => {
      const updated = [...prev];
      updated[index] = newValue;

      return updated;
    });
  };

  useEffect(() => {
    // List is valid if at least one todo has content
    const isValid = todos.some(todo => todo.trim() !== '');
    setValidList(isValid);
  }, [todos]);

  // Reset focus index after focus has been set
  useEffect(() => {
    if (focusIndex !== null) {
      // Reset focus index after a short delay
      const timeoutId = setTimeout(() => setFocusIndex(null), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [focusIndex]);

  return (
    <div className="flex gap-4 h-full relative flex-col">
      <div className="flex gap-4 flex-col">
        {todos.map((value, index) => (
          <ToDo 
            key={`todo-${index}`} 
            value={value} 
            onChange={(newValue: string) => updateTodo(index, newValue)} 
            onRemove={() => removeTodo(index)}
            onShiftEnter={() => addTodoAfterIndex(index)}
            shouldFocus={index === focusIndex}
            disableDelete={index === 0}
          />
        ))}
        <div className="flex flex-col gap-4 lg:flex-row items-center justify-between w-full lg:w-auto">
          <p className="italic hidden lg:block text-gray-500">Add Todo: Shift + Enter or tap the button</p>
          <button 
            type="button" 
            onClick={addTodo}
            className="w-full cursor-pointer lg:w-auto border-gray-300 border rounded-xl px-4 py-3 font-bold"
          >
            + Add Todo
          </button>
        </div>
      </div>
      <div className="flex justify-center lg:hidden">
        <hr className="w-16 text-gray-300" />
      </div>
      <button disabled={!validList} type="button" className="lg:fixed disabled:text-gray-700 disabled:bg-gray-100 text-lg w-full bottom-8 lg:w-[calc(50%-48px)] cursor-pointer bg-green-600 rounded-xl px-6 py-3.5 text-white font-bold">Plan My Day</button>
    </div>
  )
}

export default ToDoList