const {
    config,
    uploader
} = require('cloudinary').v2;
const DatauriParser = require('datauri/parser');
const cloudinaryConfig = () => config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinaryConfig()
function uploadToCloudinary(image) {
    return new Promise((resolve, reject) => {
        uploader.upload(image, (err, url) => {
            if (err) return reject(err);
            return resolve(url);
        })
            .catch(err => { throw err })
    });
}

function parseImage(req, res, next) {
    req.files.encodedUri = [];
    const parser = new DatauriParser();




    if (req.files.file1) {
        req.files.encodedUri.push(parser.format('.png', req.files.file1.data).content);
    }

    if (req.files.file2) {
        req.files.encodedUri.push(parser.format('.png', req.files.file2.data).content);
    }

    if (req.files.file3) {
        req.files.encodedUri.push(parser.format('.png', req.files.file3.data).content);
    }
    return next();

}
module.exports = {
    cloudinaryConfig,
    uploadToCloudinary,
    parseImage
};