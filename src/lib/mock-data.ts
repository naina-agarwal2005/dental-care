
import data from '@/app/lib/placeholder-images.json';

const getImg = (id: string) => data.placeholderImages.find(img => img.id === id)?.imageUrl || `https://picsum.photos/seed/${id}/800/600`;

export const PATNA_CLINICS = [
  {
    id: 1,
    name: "Patna Dental College & Hospital",
    address: "Agam Kuan, Patna, Bihar 800007",
    lat: 25.6022,
    lng: 85.1873,
    phone: "0612-2350253",
    emergency: true,
    hours: "24/7",
    email: "pdch.patna@bihar.gov.in"
  },
  {
    id: 2,
    name: "AIIMS Patna Dental Department",
    address: "Phulwari Sharif, Patna, Bihar 801507",
    lat: 25.5645,
    lng: 85.0883,
    phone: "0612-2451070",
    emergency: true,
    hours: "8:00 AM - 10:00 PM",
    email: "dental@aiimspatna.edu.in"
  },
  {
    id: 3,
    name: "Maan Dental Care & Implant Centre",
    address: "Boring Road, Patna, Bihar 800001",
    lat: 25.6175,
    lng: 85.1221,
    phone: "+91 99340 12345",
    emergency: true,
    hours: "9:00 AM - 9:00 PM",
    email: "contact@maandental.com"
  },
  {
    id: 4,
    name: "Smile Dental Clinic",
    address: "Kankarbagh Main Rd, Patna, Bihar 800020",
    lat: 25.5941,
    lng: 85.1565,
    phone: "+91 88776 54321",
    emergency: false,
    hours: "10:00 AM - 8:00 PM",
    email: "info@smiledentalpatna.com"
  },
  {
    id: 5,
    name: "Ruban Memorial Hospital Dental Wing",
    address: "Patliputra Colony, Patna, Bihar 800013",
    lat: 25.6291,
    lng: 85.1154,
    phone: "0612-2270001",
    emergency: true,
    hours: "24/7",
    email: "care@rubanhospital.com"
  }
];

export const EMERGENCY_PROTOCOLS = [
  {
    id: 'severe-pain',
    title: 'Severe Pain',
    description: 'Unbearable throbbing pain that keeps you awake.',
    instructions: '1. Rinse mouth with warm water. 2. Use dental floss to remove trapped food. 3. Apply a cold compress to the outside of your cheek. 4. Take over-the-counter pain relief. 5. Seek immediate professional care.',
    icon: 'Activity',
    severity: 'High',
    lastUpdated: 'Oct 12, 2023',
    thumbnail: getImg('severe-pain'),
    videoThumbnail: getImg('video-pain'),
    duration: '2:15'
  },
  {
    id: 'broken-tooth',
    title: 'Broken Tooth',
    description: 'Fractured, chipped, or cracked tooth structure.',
    instructions: '1. Rinse mouth with warm water. 2. Save any broken pieces. 3. If bleeding, apply gauze for 10 mins. 4. Apply a cold compress to reduce swelling. 5. See a dentist immediately.',
    icon: 'Scissors',
    severity: 'Medium',
    lastUpdated: 'Oct 10, 2023',
    thumbnail: getImg('broken-tooth'),
    videoThumbnail: getImg('video-hygiene'),
    duration: '1:45'
  },
  {
    id: 'knocked-out',
    title: 'Knocked Out',
    description: 'A tooth has been completely displaced from its socket.',
    instructions: '1. Retrieve the tooth, hold by crown ONLY. 2. Rinse with water if dirty, do not scrub. 3. Try to re-insert in socket. 4. If not possible, keep in milk or saline. 5. Reach dentist within 30-60 minutes.',
    icon: 'Target',
    severity: 'Critical',
    lastUpdated: 'Oct 05, 2023',
    thumbnail: getImg('knocked-out'),
    videoThumbnail: getImg('video-knocked-out'),
    duration: '3:10'
  },
  {
    id: 'abscess',
    title: 'Abscess/Swelling',
    description: 'Infection causing swelling in gums or face.',
    instructions: '1. Rinse with mild salt water several times. 2. Do not attempt to pop the abscess. 3. Apply ice to the face for 15 mins. 4. This is a serious infection that can spread. 5. Emergency care is mandatory.',
    icon: 'AlertCircle',
    severity: 'High',
    lastUpdated: 'Sep 28, 2023',
    thumbnail: getImg('abscess'),
    videoThumbnail: getImg('video-abscess'),
    duration: '5:20'
  }
];

export const INSTRUCTIONAL_VIDEOS = [
  {
    id: 1,
    title: "How to handle a knocked-out tooth",
    category: "Trauma",
    duration: "2:15",
    thumbnail: getImg('video-knocked-out'),
    url: "https://youtube.com/watch?v=1",
    status: "Active"
  },
  {
    id: 2,
    title: "Relieving severe dental pain at home",
    category: "First Aid",
    duration: "1:45",
    thumbnail: getImg('video-pain'),
    url: "https://youtube.com/watch?v=2",
    status: "Active"
  },
  {
    id: 3,
    title: "Managing a dental abscess",
    category: "Trauma",
    duration: "3:10",
    thumbnail: getImg('video-abscess'),
    url: "https://youtube.com/watch?v=3",
    status: "Pending Review"
  },
  {
    id: 4,
    title: "Routine Oral Hygiene",
    category: "Routine",
    duration: "5:20",
    thumbnail: getImg('video-hygiene'),
    url: "https://youtube.com/watch?v=4",
    status: "Active"
  }
];
