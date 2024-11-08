// /pages/api/connect.js
import net from 'net';

export default function handler(req, res) {
  const HOST = '127.0.0.1';
  const PORT = 65432;
  const client = new net.Socket();

  client.connect(PORT, HOST, () => {
    console.log(`Connected to server at ${HOST}:${PORT}`);
    res.status(200).json({ message: `Connected to ${HOST}:${PORT}` });
  });

  client.on('data', (data) => {
    console.log('Received from server:', data.toString());

    // แยกข้อมูล x, y จาก string "x,y"
    const [x, y] = data.toString().split(',').map(Number); // ใช้ map(Number) เพื่อแปลงค่าเป็นตัวเลข
    console.log(`x: ${x}, y: ${y}`);

    // คุณสามารถใช้ x และ y ตามต้องการที่นี่
  });

  client.on('close', () => {
    console.log('Connection closed');
  });

  client.on('error', (err) => {
    console.error('Connection error:', err);
    res.status(500).json({ error: 'Connection failed' });
  });
}
