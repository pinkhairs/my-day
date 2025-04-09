import ToDoList from '@/components/ToDoList'

function App() {
  return (
    <div className="h-full p-8 flex flex-col gap-8 lg:grid lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-4xl">MyDay</h1>
        <h2 className="text-lg">What do you want to accomplish today?</h2>
        <ToDoList />
      </div>
      <div className="h-full bg-gray-100 rounded-2xl">

      </div>
    </div>
  )
}

export default App
