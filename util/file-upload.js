const cloudinary = require("cloudinary").v2;

async function uploadFile(req) {
  let result;
  if (req.files) {
    result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: "buxury",
    });
  } else {
    result = "";
  }

  return result;
}

module.exports = uploadFile;
