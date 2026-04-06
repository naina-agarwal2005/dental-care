const http = require('http');

// Dental clinics in Mandya, Karnataka
const clinics = [
  {
    name: "Mandya Institute of Dental Sciences & Hospital",
    lat: 12.522222,
    lng: 76.895556,
    contactNumber: "9876543220",
    mapsUrl: "https://www.google.com/maps/place/Mandya+Institute+of+Dental+Sciences/@12.522222,76.895556,17z"
  },
  {
    name: "Government Dental College Mandya",
    lat: 12.525000,
    lng: 76.898333,
    contactNumber: "9876543221",
    mapsUrl: "https://www.google.com/maps/place/Government+Dental+College+Mandya/@12.525000,76.898333,17z"
  },
  {
    name: "Sree Siddhartha Dental College Tumkur",
    lat: 13.340556,
    lng: 77.100556,
    contactNumber: "9876543222",
    mapsUrl: "https://www.google.com/maps/place/Sree+Siddhartha+Dental+College/@13.340556,77.100556,17z"
  },
  {
    name: "City Dental Hospital Mandya",
    lat: 12.524167,
    lng: 76.896944,
    contactNumber: "9876543223",
    mapsUrl: "https://www.google.com/maps/place/City+Dental+Hospital+Mandya/@12.524167,76.896944,17z"
  },
  {
    name: "Smile Care Dental Clinic Mandya",
    lat: 12.521389,
    lng: 76.894722,
    contactNumber: "9876543224",
    mapsUrl: "https://www.google.com/maps/place/Smile+Care+Dental+Clinic/@12.521389,76.894722,17z"
  }
];

async function seedClinics() {
  console.log(`Starting to seed ${clinics.length} clinics from Mandya region...`);
  
  for (const clinic of clinics) {
    const postData = JSON.stringify(clinic);
    const options = {
      hostname: 'localhost',
      port: 9002,
      path: '/api/clinics',
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
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log(`✓ Created clinic: ${clinic.name}`);
          } else {
            console.log(`✗ Failed to create ${clinic.name}: ${res.statusCode}`);
          }
          resolve(body);
        });
      });
      req.on('error', (err) => {
        console.error(`✗ Error creating ${clinic.name}:`, err.message);
        reject(err);
      });
      req.write(postData);
      req.end();
    });
  }
  
  console.log('\nSeeding complete!');
}

seedClinics().catch(console.error);
