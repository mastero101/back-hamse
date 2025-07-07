const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
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
      const key = `uploads/${Date.now()}_${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
      });
      
      await s3Client.send(command);
      const fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      return res.json({ status: 'success', url: fileUrl });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = uploadController; 