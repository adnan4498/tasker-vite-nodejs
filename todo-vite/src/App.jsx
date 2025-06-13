import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [val, setVal] = useState("");
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");

  const [updateVal, setUpdateVal] = useState("");
  const [todoId, setTodoId] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [updatingTodo, setUpdatingTodo] = useState(null);

  let handleVal = (e) => {
    setVal(e.target.value);
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    val.length != 0 && setTodoText(val);

    setVal("");
  };

  let handleUpdateVal = (e) => {
    setUpdateVal(e.target.value);
  };

  let handleSubmitUpdate = (e) => {
    e.preventDefault();
    updateVal.length != 0 &&
      setUpdatingTodo({ updatedText: updateVal, existingTodos: todos });

    setUpdateVal("");
    setIsUpdate(false);
  };

  let handleId = (id) => {
    setTodoId(id);
    setIsUpdate(true);
  };

  useEffect(() => {
    let handleTodos = async () => {
      let gettingTodos = async () => {
        let getTodos = await fetch(`http://localhost:3003/api/todos`);
        let res = await getTodos.json();
        setTodos(res);
      };

      let addingTodo = async () => {
        let postTodo = await fetch(`http://localhost:3003/api/todos`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          // body: JSON.stringify([todoText, todos]),
          body: JSON.stringify({
            newTodo: todoText,
            existingTodos: todos,
          }),
        });
        try {
          let contentType = postTodo.headers.get("content-type");
          if (contentType == "text/html") {
            let serverText = await postTodo.text();
            if (postTodo.status == 400)
              throw new Error(`${postTodo.status} ${serverText}`);
          } else {
            let res = await postTodo.json();
            if (res.length == 0)
              throw new Error(res.status, "error : no todo found");
            setTodos(res);
          }
        } catch (error) {
          console.log(error);
        }
      };

      let updatingTodoValue = async () => {
        let updateTodoVal = await fetch(
          `http://localhost:3003/api/update/todos/${todoId}`,
          {
            method: "PUT",
            headers: { "content-type": "application/json" },
            // body: JSON.stringify(updatingTodo),
            body: JSON.stringify([{
              updatedText: updateVal,
              existingTodos: todos,
            }]),
          }
        );

        let res = await updateTodoVal.json();

        console.log(res, "ress");

        try {
          if (!updateTodoVal.ok) throw new Error(res.error);
          setTodos(res);
        } catch (error) {
          alert(error);
        }
      };

      todoText.length != 0 && addingTodo();
      updatingTodo?.length != 0 && updatingTodo != null
        ? updatingTodoValue()
        : "";
      setTodoText("");
    };

    handleTodos();
  }, [todoText, todoId, updatingTodo]);

  console.log(todos, "todos");

  return (
    <>
      <div className="main-container">
        <div className="add-new-todo">
          <form>
            <label className="new-todo">New Todo</label>
            <input type="text" value={val} onChange={(e) => handleVal(e)} />
            <input
              type="submit"
              value="Submit"
              onClick={(e) => handleSubmit(e)}
            />
          </form>
        </div>

        <div className="todo-container">
          {todos?.map((item, index) => (
            <div key={item.id} className="todo-parent">
              <div>
                {isUpdate && todoId == item.id ? (
                  <>
                    <input
                      type="text"
                      value={updateVal}
                      onChange={(e) => handleUpdateVal(e)}
                    />
                    <input
                      type="submit"
                      value="Submit"
                      onClick={(e) => handleSubmitUpdate(e)}
                    />
                  </>
                ) : (
                  <div className="todo-name">{item.todoVal}</div>
                )}

                <div className="todo-btns">
                  <div className="completed-btn">completed</div>
                  <div className="update-btn" onClick={() => handleId(item.id)}>
                    update
                  </div>
                  <div className="delete-btn">delete</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
