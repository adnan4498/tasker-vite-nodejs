let http = require("http");
let PORT = 3001;

let server = http.createServer((req, res) => {
  let devTodos = [
    {
      id: 0,
      todoVal: "to office",
    },
    {
      id: 1,
      todoVal: "to namaz",
    },
  ];

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
  }

  if (req.method == "GET" && req.url == "/api/todos") {
    res.writeHead(200, { "content-type": "application/json" });
    res.write(JSON.stringify(devTodos));
    res.end();
  }

  if (req.method == "POST" && req.url == "/api/todos") {
    let body;
    req.on("data", (chunk) => {
      body = String(chunk);
    });

    req.on("end", () => {

      body = JSON.parse(body);
      let newTodo = body[0];
      let existingTodos = body[1];

      if (newTodo.length == 0) {
        res.writeHead(400, { "content-type": "text/html" });
        res.end()
      } else {
        res.writeHead(200, { "content-type": "application/json" });
        let getLastId = existingTodos.length != 0 ? existingTodos.slice(-1)[0].id : 0;

        let mergedTodos = [...existingTodos, {id : ++getLastId, todoVal : newTodo}]
        res.end(JSON.stringify(mergedTodos));
      }
    });
  }

  if(req.method == "PUT" && req.url == "/api/update/todos"){
    console.log("in update")
  }

});

server.listen(PORT, () => {
  console.log("server is running");
});
