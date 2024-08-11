import multer from "multer"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//função para guardar imagens
const imageStore = multer.diskStorage({
    destination: (request, file, callback) => {
        let folter = ""

        if(request.baseUrl.includes("usuarios")){
            folter = "usuarios"
        }else if(request.baseUrl.includes("objetos")){
            folter = "objetos"
        }
        callback(null, path.join(__dirname, `../public/${folter}`)) 
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + String(Math.floor(Math.random() * 100000)) + path.extname(file.originalname))
    },
})
const imageUpload = multer({
    storage: imageStore,
    fileFilter(request, file, callback){
        if(!file.originalname.match(/\.(png||jpg)$/)){ //regex
            return callback(new Error("Por favor, apenas arquivos jpg ou png"))
        }
        callback(null, true)
    },
})
export default imageUpload;