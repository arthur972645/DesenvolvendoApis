import { Router } from "express";

import {
  getEmprestimos,
  postEmprestimo,
  buscarEmprestimo,
  editarEmprestimo,
} from "../controllers/emprestimoController.js";

const router = Router();

router.get("/", getEmprestimos);
router.post("/criar", postEmprestimo);
router.get("/:id", buscarEmprestimo);
router.put("/editar/:id", editarEmprestimo);

export default router;
