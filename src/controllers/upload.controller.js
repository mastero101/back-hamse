const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Configuración optimizada para archivos grandes
  requestHandler: {
    httpOptions: {
      timeout: 300000, // 5 minutos para archivos grandes
      connectTimeout: 60000 // 1 minuto para conexión
    }
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

      // Validar tamaño del archivo (máximo 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB en bytes
      if (file.size > maxSize) {
        return res.status(400).json({ 
          status: 'error', 
          message: `El archivo es demasiado grande. Máximo permitido: 50MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB` 
        });
      }

      // Subir archivo a S3
      const key = `uploads/${Date.now()}_${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // Metadata adicional para archivos grandes
        Metadata: {
          'original-name': file.originalname,
          'file-size': file.size.toString(),
          'upload-timestamp': new Date().toISOString()
        }
      });
      
      await s3Client.send(command);
      const fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      return res.json({ status: 'success', url: fileUrl });
    } catch (error) {
      console.error('Error al subir archivo a S3:', error);
      
      // Manejo específico de errores de S3
      if (error.name === 'TimeoutError') {
        return res.status(408).json({ 
          status: 'error', 
          message: 'Timeout al subir el archivo. El archivo puede ser demasiado grande o la conexión es lenta.' 
        });
      }
      
      if (error.name === 'NetworkError') {
        return res.status(503).json({ 
          status: 'error', 
          message: 'Error de red al subir el archivo. Intenta de nuevo.' 
        });
      }

      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = uploadController; 