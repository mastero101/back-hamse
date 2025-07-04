const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const S3_BUCKET = process.env.AWS_S3_BUCKET;

const uploadController = {
  uploadImageS3: async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ status: 'error', message: 'No se proporcionó ningún archivo.' });
      }
      // Subir archivo a S3
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: `uploads/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
      };
      const uploadResult = await s3.upload(s3Params).promise();
      const fileUrl = uploadResult.Location;
      return res.json({ status: 'success', url: fileUrl });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = uploadController; 