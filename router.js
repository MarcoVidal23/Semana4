import { Router } from "express";
import {
  getJoyas,
  filtrarJoyas
  } from "./controller/postController.js";

import { logger } from "./logger.js" 

export const allRoutes = Router();

allRoutes.use(logger);
allRoutes.get("/joyas", getJoyas);
allRoutes.get("/joyas/filtros", filtrarJoyas);


