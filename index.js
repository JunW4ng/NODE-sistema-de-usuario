const http = require("http");
const fs = require("fs");
const port = 3000;
const { consultaUsuario, creaUsuario, autentificador } = require("./querys");

http
  .createServer(async (req, res) => {
    //? Levanta Pagina
    if (req.url == "/" && req.method === "GET") {
      res.writeHeader(200, "Content-Type", "text/html");
      fs.readFile("index.html", "utf8", (err, registro) => {
        err
          ? console.log("Error al cargar la pagina", err)
          : console.log("Pagina OK");
        res.end(registro);
      });
    }

    //? Muestra usuarios en tabla
    if (req.url == "/usuarios" && req.method === "GET") {
      const data = await consultaUsuario();
      res.end(JSON.stringify(data));
    }

    //? Crea usuario
    if (req.url == "/usuario" && req.method === "POST") {
      let body = "";
      req.on("data", (chunck) => {
        body += chunck;
      });
      req.on("end", async () => {
        try {
          const datos = Object.values(JSON.parse(body));
          const result = await creaUsuario(datos);
          res.writeHead(200, { "Content-Type": "aplication/json" });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(401, { "Content-Type": "aplication/json" });
          console.log(error);
          res.end("Ocurrio un error al procesar los datos");
        }
      });
    }

    //? Autentifica usuario
    if (req.url == "/login" && req.method === "POST") {
      let body = "";
      try {
        req.on("data", (chunck) => {
          body += chunck;
        });
        req.on("end", async () => {
          const data = Object.values(JSON.parse(body));
          const result = await autentificador(data);
          if (result.rowCount !== 0) {
            res.writeHead(200, { "Content-Type": "aplication/json" });
            res.end(JSON.stringify(result));
          } else {
            res.writeHead(401, { "Content-Type": "aplication/json" });
            res.end();
          }
        });
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  })
  .listen(port, () => {
    console.log(`Escuchando port ${port}`);
  });
