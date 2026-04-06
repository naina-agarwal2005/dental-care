const http = require('http');

const items = Array.from({ length: 15 }).map((_, i) => ({
  title: { en: `Example Protocol ${i + 1}`, kn: `ಉದಾಹರಣೆ ಪ್ರೋಟೋಕಾಲ್ ${i + 1}` },
  videoUrl: "https://www.youtube.com/watch?v=SnY34dD7lvA",
  thumbnail: "https://i.imgur.com/BFXX09K.jpeg",
  steps: [
    {
      stepNumber: 1,
      text: { en: "Clean the affected area gently.", kn: "ಪೀಡಿತ ಪ್ರದೇಶವನ್ನು ನಿಧಾನವಾಗಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ." },
      imageUrl: "https://i.imgur.com/BFXX09K.jpeg"
    },
    {
      stepNumber: 2,
      text: { en: "Apply a cold compress and seek medical attention.", kn: "ಕೋಲ್ಡ್ ಕಂಪ್ರೆಸ್ ಅನ್ನು ಅನ್ವಯಿಸಿ ಮತ್ತು ವೈದ್ಯಕೀಯ ಗಮನವನ್ನು ಪಡೆಯಿರಿ." },
      imageUrl: "https://i.imgur.com/BFXX09K.jpeg"
    }
  ]
}));

async function seed() {
  for (const item of items) {
    const postData = JSON.stringify(item);
    const options = {
      hostname: 'localhost',
      port: 9002,
      path: '/api/traumas',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          console.log(`Created protocol ${item.title.en}: ${res.statusCode}`);
          resolve(body);
        });
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }
}

seed().catch(console.error);
