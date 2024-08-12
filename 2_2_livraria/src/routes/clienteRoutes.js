import { Router } from "express";

import {
  getClientes,
  postClientes,
  buscarCliente,
  editarCliente,
} from "../controllers/clienteController.js";

const router = Router();

router.get("/", getClientes);
router.post("/criar", postClientes);
router.get("/:id", buscarCliente);
router.put("/editar/:id", editarCliente);

export default router;
