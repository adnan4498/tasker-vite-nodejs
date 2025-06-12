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
          let parseBody = JSON.parse(body);
          resolve(parseBody);
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

    // parsedJSONBody(req).then((body) => {
    //   req.on("end", () => {
    //     console.log(body, "body")
    //     let parsed;
    //     try {
    //       parsed = body;
    //     } catch (error) {
    //       res.statusCode = 400;
    //       res.end(error, "invalid JSON");
    //     }

    //     console.log(parsed, "ppp")
    //     res.writeHead(200, {"content-type" : "application/json"})
    //     res.end({parsed})
    //   });
    // });

    parsedJSONBody(req).then((body) => {
      console.log(body, "bbb")
    })

    // req.on("end", () => {
    // let parsed;
    // try {
    //   parsed = JSON.parse(body);
    // } catch (err) {
    //   res.writeHead(400, { "Content-Type": "application/json" });
    //   return res.end(JSON.stringify({ error: "Invalid JSON" }));
    // }
    // let { newTodo, existingTodos } = parsed;
    // if (newTodo.length == 0) {
    //   res.writeHead(400, { "content-type": "text/html" });
    //   res.end();
    // } else {
    //   res.writeHead(200, { "content-type": "application/json" });
    //   let getLastId =
    //     existingTodos.length != 0 ? existingTodos.slice(-1)[0].id : 0;
    //   let mergedTodos = [
    //     ...existingTodos,
    //     { id: ++getLastId, todoVal: newTodo },
    //   ];
    //   res.end(JSON.stringify(mergedTodos));
    // }
    // });
  } else if (method == "PUT" && url.includes("update")) {
    let urlParts = url.split("/");
    let todoId = urlParts.pop();

    res.writeHead(200, { "content-type": "application/json" });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log("server is running");
});
