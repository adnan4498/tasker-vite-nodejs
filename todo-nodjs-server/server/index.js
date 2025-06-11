let http = require("http");
let PORT = 3001;

let server = http.createServer((req, res) => {
  let method = req.method;
  let url = req.url;

  console.log(method, "method");
  console.log(url, "url");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method == "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    res.end();
    return;
  } else if (method == "POST" && url == "/api/todos") {
    let body;
    req.on("data", (chunk) => {
      body = String(chunk);
    });

    req.on("end", () => {
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      let { newTodo, existingTodos } = parsed;

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
    let urlParts = url.split("/");
    let todoId = urlParts.pop();
    console.log(todoId, "tttt");

    res.writeHead(200, { "content-type": "application/json" });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log("server is running");
});
