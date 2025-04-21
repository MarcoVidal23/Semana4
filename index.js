import express from "express";
import "dotenv/config";
import { allRoutes } from "./router.js";
import { obtenerBase } from "./bd/database.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Desde mi servidor");
});

app.use(allRoutes);


app.listen(PORT, () => {
  console.log(`Conectado en http://localhost:${PORT}`);
});

obtenerBase();
