import { ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react'

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  onShiftEnter?: () => void;
  placeholder?: string;
  shouldFocus?: boolean;
}

function TextField({ 
  value, 
  onChange, 
  onShiftEnter, 
  placeholder = "Enter text",
  shouldFocus = false 
}: TextFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea when shouldFocus prop is true
  useEffect(() => {
    if (shouldFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [shouldFocus]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Shift + Enter
    if (event.key === 'Enter' && event.shiftKey && onShiftEnter) {
      event.preventDefault(); // Prevent the default action (new line)
      onShiftEnter();
    }
  };

  return (
    <label className="bg-gray-100 max-h-24 rounded-xl overflow-hidden w-full px-2 py-1 autogrow-textarea align-top items-center grid" data-value={value}>
      <textarea 
        ref={textareaRef}
        placeholder={placeholder} 
        className="h-full outline-0" 
        value={value} 
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </label>
  )
}

export default TextField