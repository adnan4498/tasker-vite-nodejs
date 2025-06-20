import { useEffect, useState } from "react";
import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";

function Home() {
  const [val, setVal] = useState("");
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [updateInputVal, setUpdateInputVal] = useState("");
  const [todoId, setTodoId] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [updatingTodo, setUpdatingTodo] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDelete, setIsDelete] = useState(false);

  // const [userProfile, setUserProfile] = useState({
  //   name: "John Doe",
  //   avatar: "https://i.pravatar.cc/50?img=12",
  // });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  let userInfo = location.state?.userInfo;

  let handleSubmit = (e) => {
    e.preventDefault();
    if (val.length !== 0) setTodoText(val);
    setVal("");
  };

  let handleSubmitUpdate = (e) => {
    e.preventDefault();
    if (updateInputVal.length !== 0) setUpdatingTodo(updateInputVal);
    setUpdateInputVal("");
    setIsUpdate(false);
  };

  let handleId = (id) => {
    setTodoId(id);
    setIsUpdate(true);
  };

  let handleDelete = (id) => {
    setDeleteId(id);
    setIsDelete(true);
  };

  useEffect(() => {
    let handleTodos = async () => {
      let gettingTodos = async () => {
        let getTodos = await fetch(`http://localhost:3003/api/todos`);
        let res = await getTodos.json();
        setTodos(res);
      };

      let addingTodo = async () => {
        try {
          let postTodo = await fetch(`http://localhost:3003/api/todos`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ newTodo: todoText, existingTodos: todos }),
          });

          let contentType = postTodo.headers.get("content-type");
          if (contentType === "text/html") {
            let serverText = await postTodo.text();
            if (!postTodo.ok)
              throw new Error(`${postTodo.status} ${serverText}`);
          } else {
            let res = await postTodo.json();
            if (res.length === 0) throw new Error("No todos returned");
            setTodos(res);
          }
        } catch (error) {
          console.log(error);
        }
      };

      let updatingTodoValue = async () => {
        try {
          let updateTodoVal = await fetch(
            `http://localhost:3003/api/todos/update/${todoId}`,
            {
              method: "PUT",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                updatedText: updatingTodo,
                existingTodos: todos,
              }),
            }
          );

          let res = await updateTodoVal.json();
          if (!updateTodoVal.ok) throw new Error(res.error || "Update failed");
          setTodos(res);
        } catch (error) {
          alert(error.message || "Something went wrong");
        }
      };

      let deletingTodo = async () => {
        try {
          let deleteTodo = await fetch(
            `http://localhost:3003/api/todos/delete/${deleteId}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ existingTodos: todos }),
            }
          );

          if (!deleteTodo.ok)
            throw new Error(`Server error: ${deleteTodo.status}`);

          let res = await deleteTodo.json();
          setTodos(res);
        } catch (error) {
          console.error("Failed to delete todo:", error);
        }
      };

      if (todoText) await addingTodo();
      if (updatingTodo) await updatingTodoValue();
      if (isDelete) await deletingTodo();

      setTodoText("");
      setUpdatingTodo("");
      setIsDelete(false);
    };

    handleTodos();
  }, [todoText, todoId, updatingTodo, deleteId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let handleVal = (e) => setVal(e.target.value);
  let handleUpdateVal = (e) => setUpdateInputVal(e.target.value);

  useEffect(() => {
      
  }, []);

  return (
    <>
      <div className="main-container">
        <div className="navbar">
          <div className="hello">Hello</div>

          <div className="user-profile-container" ref={dropdownRef}>
            <div
              className="user-profile"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="profile-name">{userInfo.user.name}</span>
              <img
                src="https://i.pravatar.cc/50?img=12"
                alt="profile"
                className="profile-pic"
              />
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </div>
                <div className="dropdown-item">Logout</div>
              </div>
            )}
          </div>
        </div>

        <div className="add-new-todo">
          <form>
            <label className="new-todo">New Todo</label>
            <input type="text" value={val} onChange={handleVal} />
            <input type="submit" value="Submit" onClick={handleSubmit} />
          </form>
        </div>

        <div className="todo-container">
          {todos?.map((item) => (
            <div key={item.id} className="todo-parent">
              <div>
                {isUpdate && todoId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={updateInputVal}
                      onChange={handleUpdateVal}
                    />
                    <input
                      type="submit"
                      value="Submit"
                      onClick={handleSubmitUpdate}
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
                  <div
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    delete
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
