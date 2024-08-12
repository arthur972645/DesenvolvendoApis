import { Router } from "express";

import {
  getLivros,
  postLivros,
  buscarLivro,
  editarLivro,
  deletarLivro,
} from "../controllers/livrosController.js";

const router = Router();

router.get("/", getLivros);
router.post("/criar", postLivros);
router.get("/:id", buscarLivro);
router.put("/editar/:id", editarLivro);
router.delete("/remover/:id", deletarLivro);

export default router;
