import { useEffect, useState } from "react";
import { store } from "./fireBaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

interface Todo {
  id: string;
  title: string;
  status: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(store, "Tasks"),
      (querySnapshot) => {
        const todosData: Todo[] = [];
        querySnapshot.forEach((doc) => {
          todosData.push({ id: doc.id, ...doc.data() } as Todo);
        });
        setTodos(todosData);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddTask = async () => {
    if (inputValue.trim() === "") return;
    const newTask = {
      title: inputValue,
      status: "To Do",
    };
    try {
      const docRef = await addDoc(collection(store, "Tasks"), newTask);
      setTodos((prevTodos) => [...prevTodos, { id: docRef.id, ...newTask }]);
      setInputValue("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTitle(todo.title);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleEditSubmit = async (todo: Todo) => {
    if (newTitle.trim() === "") return;
    try {
      const todoRef = doc(store, "Tasks", todo.id);
      await updateDoc(todoRef, { title: newTitle });
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? { ...t, title: newTitle } : t))
      );
      setEditingTodo(null);
      setNewTitle("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (todoId: string) => {
    try {
      const todoRef = doc(store, "Tasks", todoId);
      await deleteDoc(todoRef);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    todoId: string
  ) => {
    event.dataTransfer.setData("todoId", todoId);
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    newStatus: string
  ) => {
    event.preventDefault();
    const todoId = event.dataTransfer.getData("todoId");
    const todoToUpdate = todos.find((todo) => todo.id === todoId);
    if (todoToUpdate) {
      try {
        const todoRef = doc(store, "Tasks", todoToUpdate.id);
        await updateDoc(todoRef, { status: newStatus });
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === todoId ? { ...todo, status: newStatus } : todo
          )
        );
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="p-3">
      <div className="card p-3 w-25 mx-auto mb-3">
        <h1 className="text-center mb-3">Add task</h1>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter task"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="btn btn-primary w-100" onClick={handleAddTask}>
          Add task
        </button>
      </div>
      <div className="d-flex justify-content-center gap-3 mb-3">
        <div
          className="card p-3 w-25"
          onDrop={(event) => handleDrop(event, "To Do")}
          onDragOver={handleDragOver}
        >
          <h1 className="text-center mb-3">To do</h1>
          <ul>
            {todos
              .filter((todo) => todo.status === "To Do")
              .map((todo) => (
                <div
                  key={todo.id}
                  className="card p-3 mb-3 w-100"
                  draggable
                  onDragStart={(event) => handleDragStart(event, todo.id)}
                >
                  {editingTodo?.id === todo.id ? (
                    <div>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={handleEditChange}
                      />
                      <button
                        className="btn btn-success mt-2"
                        onClick={() => handleEditSubmit(todo)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h1>{todo.title}</h1>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEditClick(todo)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ml-2"
                        onClick={() => handleDelete(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </ul>
        </div>
        <div
          className="card p-3 w-25"
          onDrop={(event) => handleDrop(event, "In Progress")}
          onDragOver={handleDragOver}
        >
          <h1 className="text-center mb-3">In Progress</h1>
          <ul>
            {todos
              .filter((todo) => todo.status === "In Progress")
              .map((todo) => (
                <div
                  key={todo.id}
                  className="card p-3 mb-3 w-100"
                  draggable
                  onDragStart={(event) => handleDragStart(event, todo.id)}
                >
                  {editingTodo?.id === todo.id ? (
                    <div>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={handleEditChange}
                      />
                      <button
                        className="btn btn-success mt-2"
                        onClick={() => handleEditSubmit(todo)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h1>{todo.title}</h1>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEditClick(todo)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ml-2"
                        onClick={() => handleDelete(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </ul>
        </div>
        <div
          className="card p-3 w-25"
          onDrop={(event) => handleDrop(event, "Done")}
          onDragOver={handleDragOver}
        >
          <h1 className="text-center mb-3">Done</h1>
          <ul>
            {todos
              .filter((todo) => todo.status === "Done")
              .map((todo) => (
                <div
                  key={todo.id}
                  className="card p-3 mb-3 w-100"
                  draggable
                  onDragStart={(event) => handleDragStart(event, todo.id)}
                >
                  {editingTodo?.id === todo.id ? (
                    <div>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={handleEditChange}
                      />
                      <button
                        className="btn btn-success mt-2"
                        onClick={() => handleEditSubmit(todo)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h1>{todo.title}</h1>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEditClick(todo)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ml-2"
                        onClick={() => handleDelete(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
