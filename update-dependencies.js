const { execSync } = require('child_process');

console.log('🔄 Actualizando dependencias de AWS SDK...');

try {
    // Remover AWS SDK v2
    console.log('📦 Removiendo aws-sdk v2...');
    execSync('npm uninstall aws-sdk', { stdio: 'inherit' });
    
    // Instalar AWS SDK v3
    console.log('📦 Instalando @aws-sdk/client-s3...');
    execSync('npm install @aws-sdk/client-s3', { stdio: 'inherit' });
    
    console.log('📦 Instalando @aws-sdk/s3-request-presigner...');
    execSync('npm install @aws-sdk/s3-request-presigner', { stdio: 'inherit' });
    
    console.log('✅ Dependencias actualizadas exitosamente!');
    console.log('🚀 Ahora puedes hacer deploy a Vercel con: vercel --prod');
    
} catch (error) {
    console.error('❌ Error actualizando dependencias:', error.message);
    process.exit(1);
} 