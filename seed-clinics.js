const http = require('http');

// Sample clinics across different cities in India with real coordinates
const clinics = [
  {
    name: "Vokkaligara Sangha Dental College & Hospital",
    lat: 12.954357,
    lng: 77.574687,
    contactNumber: "9876543210",
    mapsUrl: "https://www.google.com/maps/place/Vokkaligara+Sangha+Dental+College+%26+Hospital/@12.9543622,77.5721121,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae15e5588a7227:0xa7fe8d29e8c308b9!8m2!3d12.954357!4d77.574687!16s%2Fg%2F1tqt82xt"
  },
  {
    name: "Manipal College of Dental Sciences",
    lat: 12.916666,
    lng: 77.498611,
    contactNumber: "9876543211",
    mapsUrl: "https://www.google.com/maps/place/Manipal+College+of+Dental+Sciences/@12.916666,77.498611,17z"
  },
  {
    name: "RV Dental College & Hospital",
    lat: 12.919722,
    lng: 77.498889,
    contactNumber: "9876543212",
    mapsUrl: "https://www.google.com/maps/place/RV+Dental+College+%26+Hospital/@12.919722,77.498889,17z"
  },
  {
    name: "KLE Society's Institute of Dental Sciences",
    lat: 15.854664,
    lng: 74.499722,
    contactNumber: "9876543213",
    mapsUrl: "https://www.google.com/maps/place/KLE+Society's+Institute+of+Dental+Sciences/@15.854664,74.499722,17z"
  },
  {
    name: "Government Dental College & Hospital",
    lat: 13.010778,
    lng: 77.552056,
    contactNumber: "9876543214",
    mapsUrl: "https://www.google.com/maps/place/Government+Dental+College+%26+Hospital/@13.010778,77.552056,17z"
  },
  {
    name: "JSS Dental College & Hospital",
    lat: 12.305278,
    lng: 76.638889,
    contactNumber: "9876543215",
    mapsUrl: "https://www.google.com/maps/place/JSS+Dental+College+%26+Hospital/@12.305278,76.638889,17z"
  },
  {
    name: "SDM College of Dental Sciences",
    lat: 13.346944,
    lng: 74.792222,
    contactNumber: "9876543216",
    mapsUrl: "https://www.google.com/maps/place/SDM+College+of+Dental+Sciences/@13.346944,74.792222,17z"
  },
  {
    name: "AB Shetty Memorial Institute of Dental Sciences",
    lat: 12.911111,
    lng: 74.855833,
    contactNumber: "9876543217",
    mapsUrl: "https://www.google.com/maps/place/AB+Shetty+Memorial+Institute/@12.911111,74.855833,17z"
  },
  {
    name: "MS Ramaiah Dental College & Hospital",
    lat: 13.029167,
    lng: 77.566111,
    contactNumber: "9876543218",
    mapsUrl: "https://www.google.com/maps/place/MS+Ramaiah+Dental+College/@13.029167,77.566111,17z"
  },
  {
    name: "Dayananda Sagar College of Dental Sciences",
    lat: 12.905556,
    lng: 77.534722,
    contactNumber: "9876543219",
    mapsUrl: "https://www.google.com/maps/place/Dayananda+Sagar+College+of+Dental/@12.905556,77.534722,17z"
  }
];

async function seedClinics() {
  console.log(`Starting to seed ${clinics.length} clinics...`);
  
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
