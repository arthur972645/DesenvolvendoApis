import { Router } from "express";

import {
  getFuncionarios,
  postFuncionarios,
  buscarFuncionario,
  editarFuncionario,
  deletarFuncionario,
} from "../controllers/funcionarioController.js";

const router = Router();

router.get("/", getFuncionarios);
router.post("/criar", postFuncionarios);
router.get("/:id", buscarFuncionario);
router.put("/editar/:id", editarFuncionario);
router.delete("/remover/:id", deletarFuncionario);

export default router;
