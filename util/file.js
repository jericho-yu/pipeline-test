import { promises as fs } from 'fs';

async function readJsonFile() {
    try {
        const data = await fs.readFile('./config.json', 'utf8');
        return data;
    } catch (err) {
        console.error('Error:', err);
        return null;
    }
}

export default readJsonFile;