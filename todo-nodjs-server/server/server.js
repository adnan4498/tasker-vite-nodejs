import http from "http";
import { auth } from "../routes/auth.js";
import { parsedJSONBody } from "../utils/parseJSON.js";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware.js";

const PORT = 3003;

mongoose
  .connect("mongodb://127.0.0.1:27017/signup_demo")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  console.log(url, "url");
  console.log(method, "method");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
  } else if (method === "POST" && url.includes("signup")) {
    try {
      auth(req, res);
    } catch (error) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(JSON.stringify({ error: error }));
    }
  } else if (method === "POST" && url.includes("login")) {
    try {
      auth(req, res);
    } catch (error) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(JSON.stringify({ error: error }));
    }
  } else if (method === "GET" && url.includes("settings")) {
    try {
      authMiddleware(req, res, () => {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            accessGranted: true,
          })
        );
      });
    } catch (error) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(JSON.stringify({ error: error }));
    }
  } else if (method == "POST" && url.includes("emailUpdate")) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ url: url }));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
