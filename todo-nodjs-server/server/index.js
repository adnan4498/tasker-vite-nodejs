let http = require("http");
let PORT = 3003;

let server = http.createServer((req, res) => {
  let method = req.method;
  let url = req.url;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  let parsedJSONBody = function (req) {
    return new Promise((resolve, reject) => {
      let body = "";

      req.on("data", (chunk) => {
        body += String(chunk);
      });

      req.on("end", () => {
        try {
          console.log(body, "bbbb");
          let parsed = JSON.parse(body);
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  if (req.method == "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    res.end();
    return;
  } else if (method == "POST" && url == "/api/todos") {
    parsedJSONBody(req).then((body) => {
      const { newTodo, existingTodos } = body;

      if (newTodo.length == 0) {
        res.writeHead(400, { "content-type": "text/html" });
        res.end();
      } else {
        res.writeHead(200, { "content-type": "application/json" });
        let getLastId =
          existingTodos.length != 0 ? existingTodos.slice(-1)[0].id : 0;
        let mergedTodos = [
          ...existingTodos,
          { id: ++getLastId, todoVal: newTodo },
        ];
        res.end(JSON.stringify(mergedTodos));
      }
    });
  } else if (method == "PUT" && url.includes("update")) {
    parsedJSONBody(req).then((body) => {
      const { updatedText, existingTodos } = body;
      let todoId = url.split("/").pop();

      try {
        if (/[!@#$%^&*()]/.test(updatedText)) {
          throw new Error("Invalid characters in updatedText");
        }

        const updatedTodos = existingTodos.map((item) => {
          if (item.id == todoId) {
            item.todoVal = updatedText;
          }
          return item;
        });

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(updatedTodos));
      } catch (error) {
        // res.writeHead(400, { "content-type": "application/json" });
        // res.end(JSON.stringify({ error: error.message }));

        res.statusCode = 400;
        res.end(error);
      }
    });
  } else if (method == "DELETE" && url.includes("delete")) {
    parsedJSONBody(req).then((body) => {
      try {
        res.writeHead(200, { "content-type": "application/json" });

        let getId = url.split("/").pop();
        const { existingTodos } = body;
        let removeDeletedTodo = existingTodos.filter(
          (item) => item.id != getId
        );

        console.log(removeDeletedTodo, "removeDeletedTodo");

        res.end(JSON.stringify(removeDeletedTodo));
      } catch (error) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: error }));
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log("server is running");
});
