import { Router } from "express";
import verifyToken from "../helpers/verify-token.js";
import imageUpload from "../helpers/image-upload.js";

import { create, getAllObjectUser, getObjBtId } from "../controllers/objetoController.js";

const router = Router();
router.post("/create", verifyToken, imageUpload.array("imagens", 10), create);
router.get("/objeto/imagens", verifyToken, getAllObjectUser);
router.get("/:id", getObjBtId)
//listar todos os objetos
//regatar objeto pelo id
//listar todas as imagens de um objeto
//listar todas as imagens que pertence a um usuário

export default router;
