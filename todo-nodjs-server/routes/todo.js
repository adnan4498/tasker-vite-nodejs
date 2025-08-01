import http from "http"
import { auth } from "./routes/auth.js";
import { parsedJSONBody } from "./utils/parseJSON.js";

const PORT = 3003;

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  console.log(url, "url")
  console.log(method, "method")

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,LOGIN,SIGNUP");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (method === "POST" && url === "/api/todos") {
    parsedJSONBody(req)
      .then(({ newTodo, existingTodos }) => {
        if (!newTodo || newTodo.length === 0) {
          res.writeHead(400);
          return res.end();
        }
        const lastId = existingTodos.length ? existingTodos.slice(-1)[0].id : 0;
        const newTodos = [
          ...existingTodos,
          { id: lastId + 1, todoVal: newTodo },
        ];
        console.log(newTodos, "newTodos");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newTodos));
      })
      .catch(() => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Malformed JSON" }));
      });
  } else if (method === "PUT" && url.includes("update")) {
    parsedJSONBody(req)
      .then(({ updatedText, existingTodos }) => {
        const todoId = url.split("/").pop();
        if (!updatedText || /[!@#$%^&*()]/.test(updatedText)) {
          res.writeHead(400);
          return res.end(
            JSON.stringify({ error: "Invalid characters in updatedText" })
          );
        }
        const updatedTodos = existingTodos.map((item) => {
          if (item.id == todoId) item.todoVal = updatedText;
          return item;
        });
        console.log(updatedTodos, "updatedTodos");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedTodos));
      })
      .catch(() => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Malformed JSON" }));
      });
  } else if (method === "DELETE" && url.includes("delete")) {
    parsedJSONBody(req)
      .then(({ existingTodos }) => {
        const getId = url.split("/").pop();
        if (!Array.isArray(existingTodos)) {
          res.writeHead(400);
          return res.end(
            JSON.stringify({ error: "existingTodos must be an array" })
          );
        }
        const remaining = existingTodos.filter((item) => item.id != getId);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(remaining));
      })
      .catch(() => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Malformed JSON" }));
      });
  } 
    else if(method === "POST" && url.includes("signup")){

      let aaa = async function () {
        let getAuth =  await auth(req, res)
        res.end(getAuth)
      }

      aaa()

    }
  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
