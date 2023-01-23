import multer from "multer";

const storage = (folderName: string) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/${folderName}`);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
};

export default storage;
