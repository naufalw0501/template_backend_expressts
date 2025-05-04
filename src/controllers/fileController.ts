import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const getImage = (req: Request, res: Response) => {
  const { image_category, filename } = req.params;

  const allowedFolders = ['products'];
  if (!allowedFolders.includes(image_category)) {
    res.status(400).json({ message: 'File Category is Not Available', status: 404 });
    return 
  }

  const safeFilename = path.basename(filename); 
  const filePath = path.join(__dirname, `../uploads/${image_category}/${safeFilename}`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: 'File Not Found', status: 404 });
    return 
  }

  res.status(200).sendFile(filePath, (err) => {
    if (err) {
      res.status(500).json({ 
        message: `Failed to Send File : (${err.message })`, 
        status: 500, 
      });
    } else {
      // console.log(`[SUCCESS] File sent: ${filePath}`); 
    }
  });
};
