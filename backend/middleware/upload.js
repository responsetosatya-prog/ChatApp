import multer from "multer";
import path from "path";
import fs from "fs";

/*
==========================================
Create Upload Folder
==========================================
*/

const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {
        recursive: true
    });

}

/*
==========================================
Storage
==========================================
*/

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadPath);

    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);

        cb(

            null,

            uniqueName +
            path.extname(file.originalname)

        );

    }

});

/*
==========================================
Allowed File Types
==========================================
*/

const allowedTypes = [

    "image/jpeg",
    "image/png",
    "image/webp",

    "video/mp4",
    "video/webm",

    "application/pdf",

    "audio/mpeg",
    "audio/wav",
    "audio/ogg"

];

function fileFilter(req, file, cb) {

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    }

    else {

        cb(

            new Error("Unsupported file type."),

            false

        );

    }

}

/*
==========================================
Upload Middleware
==========================================
*/

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 20 * 1024 * 1024

    }

});

export default upload;
