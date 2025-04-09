import ToDoList from '@/components/ToDoList'
import { useState } from 'react';

interface PlanHeader {
  relevantEmoji: string;
  daySummary: string;
}

interface TodoItem {
  startTime: string;
  todoName: string;
  explanationOfOrder: string;
}

// Union type for all items in the planResult array
type PlanResultItem = PlanHeader | TodoItem;

function App() {
  const [todos, setTodos] = useState<string[]>(['Write to ma']);
  const [planResult, setPlanResult] = useState<PlanResultItem>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlanDay = async () => {
    setError('');
    setPlanResult(null);
    setIsLoading(true);

    // Filter out empty todos
    const validTodos = todos.filter(todo => todo.trim() !== '');
    
    if (validTodos.length === 0) {
      setError('Please add at least one todo item.');
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todos: validTodos }),
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      
      const data = await res.json();

      // Get the content from the response and parse it as JSON
      const resultContent = data.choices[0].message.content;
      const parsedResult = JSON.parse(resultContent);
      setPlanResult(parsedResult);
    } catch (err) {
      console.error('Error calling chat function:', err);
      setError('Failed to generate your plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full min-h-dvh flex flex-col gap-8 lg:grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 pt-8 lg:py-8 px-8 lg:px-0">
        <div className="flex flex-col gap-2">
        <h1 className="font-bold text-4xl">MyDay</h1>
          <h2 className="text-lg">What do you want to accomplish today? We'll create an ideal schedule.</h2>
        </div>
        <ToDoList 
          todos={todos}
          setTodos={setTodos}
          onPlanDay={handlePlanDay}
          isLoading={isLoading}
        />
      </div>
      <div className="px-8 lg:py-8 pb-8 lg:pl-0 h-full">
        <div className="h-full bg-gray-100 rounded-2xl p-6 flex flex-col">
          <h2 className="font-bold text-3xl mb-4">Your Day Plan</h2>
          
          <div className="flex-grow overflow-auto mb-4 bg-white rounded-lg p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                {/* Loading spinner using an SVG */}
                <svg className="animate-spin h-8 w-8 text-gray-500" viewBox="0 0 24 24">
                  <circle
                    className="opacity-0"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : planResult ? (
              <div className="whitespace-pre-wrap">
                <div className="flex flex-col gap-4">
                  <div className="text-center text-2xl">{planResult[0].relevantEmoji}</div>
                  <div className="text-center italic">{planResult[0].daySummary}</div>
                  {planResult[1].map((item: TodoItem, index: number) => (
                      // Check if item is an object (a schedule step), otherwise output it directly
                      <div key={index} className="mb-4">
                        <div className="text-lg">
                          <strong>{item.startTime}:</strong> {item.todoName}
                        </div>
                        <div className="text-gray-600">
                          {item.explanationOfOrder}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic flex items-center justify-center h-full">
                Your plan for the day will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
