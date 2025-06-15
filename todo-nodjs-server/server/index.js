const http = require("http");
const PORT = 3003;

function parsedJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += String(chunk);
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
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
        console.log(newTodos, "newTodos")
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
        console.log(updatedTodos, "updatedTodos")
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedTodos));
      })
      .catch(() => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Malformed JSON" }));
      });
  } 
  
  else if (method === "DELETE" && url.includes("delete")) {
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
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
