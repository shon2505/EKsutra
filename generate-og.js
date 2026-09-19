const sharp = require('sharp');
const fs = require('fs');

async function generateOGImage() {
  try {
    await sharp('components/logo/eksutra-logo-card.svg')
      .resize(1200, 630)
      .png()
      .toFile('app/opengraph-image.png');
    console.log('OG Image generated successfully');
  } catch (error) {
    console.error('Error generating OG Image:', error);
  }
}

generateOGImage();
