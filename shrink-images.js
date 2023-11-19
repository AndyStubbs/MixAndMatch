const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const directoryPath = 'assets/images/Custom'; // Replace with your image directory

async function resizeImages(directory) {
	try {
		const files = await fs.readdir(directory);

		for (const file of files) {
			const filePath = path.join(directory, file);
			const fileInfo = await sharp(filePath).metadata();

			// Resize the image to half its size
			sharp(filePath)
				.resize(Math.round(fileInfo.width / 2), Math.round(fileInfo.height / 2))
				.toFile(path.join(directory, 'resized', file), (err, info) => {
					if (err) {
						console.error('Error resizing file:', file, err);
					} else {
						console.log('Resized file:', file, 'to', info);
					}
				});
		}
	} catch (err) {
		console.error('Error processing directory:', err);
	}
}

// Create a resized folder if it doesn't exist
fs.ensureDir(path.join(directoryPath, 'resized'))
	.then(() => {
		resizeImages(directoryPath);
	})
	.catch(err => console.error('Error creating resized directory:', err));
