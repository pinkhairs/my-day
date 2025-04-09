import TextField from '@/components/TextField'

interface ToDoProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  onShiftEnter?: () => void;
  shouldFocus?: boolean;
  disableDelete: boolean;
}

function ToDo({ value, onChange, onRemove, onShiftEnter, shouldFocus = false, disableDelete }: ToDoProps) {
  return (
    <div className="flex items-center">
      <TextField 
        value={value} 
        onChange={onChange} 
        onShiftEnter={onShiftEnter}
        placeholder="Enter a todo"
        shouldFocus={shouldFocus}
      />
      <button 
        disabled={disableDelete}
        type="button" 
        onClick={onRemove}
        className="disabled:text-gray-700 disabled:bg-gray-100 cursor-pointer mx-4 w-8 h-7 flex items-center justify-center bg-red-400 rounded-full text-white"
      >
        &times;
      </button>
    </div>
  )
}

export default ToDo