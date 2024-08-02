import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/app/data.json');

const readData = () => {
  const jsonData = fs.readFileSync(dataFilePath);
  return JSON.parse(jsonData);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const data = readData();
      res.status(200).json(data);
      break;

    case 'POST':
      const newData = req.body;
      const currentData = readData();
      newData.id = currentData.length ? currentData[currentData.length - 1].id + 1 : 1;
      currentData.push(newData);
      writeData(currentData);
      res.status(201).json(newData);
      break;
      
    case 'PUT':
      const updateData = req.body;
      const existingData = readData();
      const index = existingData.findIndex(item => item.id === updateData.id);
      if (index !== -1) {
        existingData[index] = updateData;
        writeData(existingData);
        res.status(200).json(updateData);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
      break;

    case 'DELETE':
      const { id } = req.body;
      const dataToDelete = readData();
      const filteredData = dataToDelete.filter(item => item.id !== id);
      writeData(filteredData);
      res.status(200).json({ message: 'Item deleted' });
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}
