#!/usr/bin/env node

/**
 * Protocol Seeding Script
 * 
 * This script creates 10 test protocols (5 first aid, 5 daily care)
 * for the Tooth Aids application.
 * 
 * Usage:
 *   npm run seed:protocols
 * 
 * Or via Docker:
 *   docker compose exec app npm run seed:protocols
 * 
 * Environment Variables Required:
 *   - MONGODB_URI: MongoDB connection string
 */

const mongoose = require('mongoose');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;

// Thumbnail and step image (using local asset)
const PLACEHOLDER_IMAGE = '/assets/protocol-placeholder.jpg';
const VIDEO_URL = 'https://www.youtube.com/watch?v=Pqlk6KDqDJo';

// Trauma Schema (matching the TypeScript model)
const traumaStepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true, min: 1 },
    text: {
      en: { type: String, required: true, trim: true },
      kn: { type: String, required: true, trim: true },
    },
    imageUrl: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const traumaSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true, trim: true },
      kn: { type: String, required: true, trim: true },
    },
    type: { 
      type: String, 
      enum: ['first_aid', 'daily_care'], 
      default: 'first_aid',
      required: true 
    },
    videoUrl: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true, trim: true },
    numberOfFirstAidSteps: { type: Number, required: true, min: 1 },
    steps: {
      type: [traumaStepSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// First Aid Protocols (5 protocols)
const firstAidProtocols = [
  {
    title: {
      en: 'Knocked Out Tooth (Avulsion)',
      kn: 'ಹಲ್ಲು ಬಿದ್ದಿದೆ (ಅವಲ್ಷನ್)',
    },
    type: 'first_aid',
    videoUrl: VIDEO_URL,
    thumbnail: PLACEHOLDER_IMAGE,
    steps: [
      {
        text: {
          en: 'Stay calm. Find the tooth and pick it up by the crown (white part), not the root.',
          kn: 'ಶಾಂತವಾಗಿರಿ. ಹಲ್ಲನ್ನು ಹುಡುಕಿ ಮತ್ತು ಅದನ್ನು ಕಿರೀಟದಿಂದ (ಬಿಳಿ ಭಾಗ) ಎತ್ತಿಕೊಳ್ಳಿ, ಬೇರಿನಿಂದ ಅಲ್ಲ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'If dirty, gently rinse the tooth with milk or saline. Do not scrub or use soap.',
          kn: 'ಕೊಳಕಾಗಿದ್ದರೆ, ಹಲ್ಲನ್ನು ಹಾಲು ಅಥವಾ ಸಲೈನ್‌ನಿಂದ ಮೃದುವಾಗಿ ತೊಳೆಯಿರಿ. ಉಜ್ಜಬೇಡಿ ಅಥವಾ ಸೋಪ್ ಬಳಸಬೇಡಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Try to reinsert the tooth into the socket. Have the child bite down on a clean cloth to hold it in place.',
          kn: 'ಹಲ್ಲನ್ನು ಮತ್ತೆ ಸಾಕೆಟ್‌ನಲ್ಲಿ ಹಾಕಲು ಪ್ರಯತ್ನಿಸಿ. ಮಗುವಿಗೆ ಅದನ್ನು ಸ್ಥಳದಲ್ಲಿ ಹಿಡಿದಿಡಲು ಶುದ್ಧ ಬಟ್ಟೆಯನ್ನು ಕಚ್ಚಲು ಹೇಳಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'If reinsertion is not possible, store the tooth in milk or saliva (in the cheek).',
          kn: 'ಮರುಹಾಕುವಿಕೆ ಸಾಧ್ಯವಾಗದಿದ್ದರೆ, ಹಲ್ಲನ್ನು ಹಾಲು ಅಥವಾ ಲಾಲಾರಸದಲ್ಲಿ (ಕೆನ್ನೆಯಲ್ಲಿ) ಇರಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'See a dentist within 30-60 minutes for the best chance of saving the tooth.',
          kn: 'ಹಲ್ಲನ್ನು ಉಳಿಸುವ ಉತ್ತಮ ಅವಕಾಶಕ್ಕಾಗಿ 30-60 ನಿಮಿಷಗಳಲ್ಲಿ ದಂತವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
    ],
  },
  {
    title: {
      en: 'Severe Toothache',
      kn: 'ತೀವ್ರ ಹಲ್ಲುನೋವು',
    },
    type: 'first_aid',
    videoUrl: VIDEO_URL,
    thumbnail: PLACEHOLDER_IMAGE,
    steps: [
      {
        text: {
          en: 'Rinse the mouth with warm salt water to clean the area.',
          kn: 'ಪ್ರದೇಶವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಲು ಬಾಯಿಯನ್ನು ಬೆಚ್ಚಗಿನ ಉಪ್ಪು ನೀರಿನಿಂದ ತೊಳೆಯಿರಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Use dental floss gently to remove any food stuck between teeth.',
          kn: 'ಹಲ್ಲುಗಳ ನಡುವೆ ಸಿಕ್ಕಿರುವ ಆಹಾರವನ್ನು ತೆಗೆಯಲು ದಂತ ದಾರವನ್ನು ಮೃದುವಾಗಿ ಬಳಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Apply a cold compress to the outside of the cheek to reduce swelling.',
          kn: 'ಊತವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಕೆನ್ನೆಯ ಹೊರಭಾಗದಲ್ಲಿ ತಣ್ಣನೆಯ ಒತ್ತಡವನ್ನು ಹಾಕಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Give age-appropriate pain medication as directed. Never apply aspirin directly to gums.',
          kn: 'ಸೂಚನೆಯಂತೆ ವಯಸ್ಸಿಗೆ ಅನುಗುಣವಾದ ನೋವು ನಿವಾರಕವನ್ನು ನೀಡಿ. ಆಸ್ಪಿರಿನ್ ಅನ್ನು ನೇರವಾಗಿ ಒಸಡುಗಳಿಗೆ ಹಚ್ಚಬೇಡಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Visit a dentist as soon as possible for proper diagnosis and treatment.',
          kn: 'ಸರಿಯಾದ ರೋಗನಿರ್ಣಯ ಮತ್ತು ಚಿಕಿತ್ಸೆಗಾಗಿ ಸಾಧ್ಯವಾದಷ್ಟು ಬೇಗ ದಂತವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
    ],
  },
  {
    title: {
      en: 'Broken or Chipped Tooth',
      kn: 'ಮುರಿದ ಅಥವಾ ಚಿಪ್ ಆದ ಹಲ್ಲು',
    },
    type: 'first_aid',
    videoUrl: VIDEO_URL,
    thumbnail: PLACEHOLDER_IMAGE,
    steps: [
      {
        text: {
          en: 'Collect any broken tooth pieces if possible. Rinse them with water.',
          kn: 'ಸಾಧ್ಯವಾದರೆ ಮುರಿದ ಹಲ್ಲಿನ ತುಂಡುಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ. ಅವುಗಳನ್ನು ನೀರಿನಿಂದ ತೊಳೆಯಿರಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Rinse the mouth with warm water to clean the injured area.',
          kn: 'ಗಾಯಗೊಂಡ ಪ್ರದೇಶವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಲು ಬಾಯಿಯನ್ನು ಬೆಚ್ಚಗಿನ ನೀರಿನಿಂದ ತೊಳೆಯಿರಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Apply gauze to any bleeding area for 10 minutes or until bleeding stops.',
          kn: 'ರಕ್ತಸ್ರಾವವಾಗುತ್ತಿರುವ ಯಾವುದೇ ಪ್ರದೇಶಕ್ಕೆ 10 ನಿಮಿಷಗಳ ಕಾಲ ಅಥವಾ ರಕ್ತಸ್ರಾವ ನಿಲ್ಲುವವರೆಗೆ ಗಾಜ್ ಹಚ್ಚಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Apply a cold compress to reduce swelling.',
          kn: 'ಊತವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ತಣ್ಣನೆಯ ಒತ್ತಡವನ್ನು ಹಾಕಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Cover the broken tooth with dental wax or sugarless gum if sharp edges exist.',
          kn: 'ಚೂಪಾದ ಅಂಚುಗಳಿದ್ದರೆ ಮುರಿದ ಹಲ್ಲನ್ನು ದಂತ ಮೇಣ ಅಥವಾ ಸಕ್ಕರೆರಹಿತ ಚೂಯಿಂಗ್ ಗಮ್‌ನಿಂದ ಮುಚ್ಚಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'See a dentist immediately for repair options.',
          kn: 'ದುರಸ್ತಿ ಆಯ್ಕೆಗಳಿಗಾಗಿ ತಕ್ಷಣ ದಂತವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
    ],
  },
  {
    title: {
      en: 'Bitten Lip or Tongue',
      kn: 'ಕಚ್ಚಿದ ತುಟಿ ಅಥವಾ ನಾಲಿಗೆ',
    },
    type: 'first_aid',
    videoUrl: VIDEO_URL,
    thumbnail: PLACEHOLDER_IMAGE,
    steps: [
      {
        text: {
          en: 'Clean the area gently with water.',
          kn: 'ಪ್ರದೇಶವನ್ನು ನೀರಿನಿಂದ ಮೃದುವಾಗಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Apply firm but gentle pressure with clean gauze or cloth to stop bleeding.',
          kn: 'ರಕ್ತಸ್ರಾವವನ್ನು ನಿಲ್ಲಿಸಲು ಶುದ್ಧ ಗಾಜ್ ಅಥವಾ ಬಟ್ಟೆಯಿಂದ ದೃಢ ಆದರೆ ಮೃದುವಾದ ಒತ್ತಡವನ್ನು ಹಾಕಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Apply a cold compress to the outside of the mouth to reduce swelling.',
          kn: 'ಊತವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಬಾಯಿಯ ಹೊರಭಾಗದಲ್ಲಿ ತಣ್ಣನೆಯ ಒತ್ತಡವನ್ನು ಹಾಕಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'If bleeding does not stop after 15 minutes or the wound is deep, seek medical attention.',
          kn: '15 ನಿಮಿಷಗಳ ನಂತರ ರಕ್ತಸ್ರಾವ ನಿಲ್ಲದಿದ್ದರೆ ಅಥವಾ ಗಾಯ ಆಳವಾಗಿದ್ದರೆ, ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
    ],
  },
  {
    title: {
      en: 'Object Stuck Between Teeth',
      kn: 'ಹಲ್ಲುಗಳ ನಡುವೆ ಸಿಕ್ಕಿಕೊಂಡ ವಸ್ತು',
    },
    type: 'first_aid',
    videoUrl: VIDEO_URL,
    thumbnail: PLACEHOLDER_IMAGE,
    steps: [
      {
        text: {
          en: 'Try to gently remove the object with dental floss.',
          kn: 'ವಸ್ತುವನ್ನು ದಂತ ದಾರದಿಂದ ಮೃದುವಾಗಿ ತೆಗೆಯಲು ಪ್ರಯತ್ನಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Do not use sharp or pointed objects to remove it as this can cause injury.',
          kn: 'ಇದನ್ನು ತೆಗೆಯಲು ಚೂಪಾದ ಅಥವಾ ಮೊನಚಾದ ವಸ್ತುಗಳನ್ನು ಬಳಸಬೇಡಿ ಏಕೆಂದರೆ ಇದು ಗಾಯಕ್ಕೆ ಕಾರಣವಾಗಬಹುದು.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Rinse mouth with warm water to help dislodge the object.',
          kn: 'ವಸ್ತುವನ್ನು ಸಡಿಲಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡಲು ಬಾಯಿಯನ್ನು ಬೆಚ್ಚಗಿನ ನೀರಿನಿಂದ ತೊಳೆಯಿರಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'If you cannot remove it safely, visit a dentist to have it removed professionally.',
          kn: 'ನೀವು ಅದನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ತೆಗೆಯಲು ಸಾಧ್ಯವಾಗದಿದ್ದರೆ, ಅದನ್ನು ವೃತ್ತಿಪರವಾಗಿ ತೆಗೆಯಿಸಲು ದಂತವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
    ],
  },
];

// Daily Care Protocols (5 protocols)
const dailyCareProtocols = [
  {
    title: {
      en: 'Proper Brushing Technique',
      kn: 'ಸರಿಯಾದ ಹಲ್ಲುಜ್ಜುವ ತಂತ್ರ',
    },
    type: 'daily_care',
    videoUrl: VIDEO_URL,
    thumbnail: PLACEHOLDER_IMAGE,
    steps: [
      {
        text: {
          en: 'Use a soft-bristled toothbrush and fluoride toothpaste.',
          kn: 'ಮೃದುವಾದ ಬ್ರಿಸಲ್ ಟೂತ್‌ಬ್ರಷ್ ಮತ್ತು ಫ್ಲೋರೈಡ್ ಟೂತ್‌ಪೇಸ್ಟ್ ಬಳಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Hold the brush at a 45-degree angle to the gums.',
          kn: 'ಬ್ರಷ್ ಅನ್ನು ಒಸಡುಗಳಿಗೆ 45 ಡಿಗ್ರಿ ಕೋನದಲ್ಲಿ ಹಿಡಿಯಿರಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Brush in gentle, circular motions. Do not scrub hard.',
          kn: 'ಮೃದುವಾದ, ವೃತ್ತಾಕಾರದ ಚಲನೆಗಳಲ್ಲಿ ಹಲ್ಲುಜ್ಜಿ. ಗಟ್ಟಿಯಾಗಿ ಉಜ್ಜಬೇಡಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Brush all surfaces: outer, inner, and chewing surfaces of teeth.',
          kn: 'ಎಲ್ಲಾ ಮೇಲ್ಮೈಗಳನ್ನು ಹಲ್ಲುಜ್ಜಿ: ಹಲ್ಲುಗಳ ಹೊರ, ಒಳ ಮತ್ತು ಜಗಿಯುವ ಮೇಲ್ಮೈಗಳು.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Gently brush your tongue to remove bacteria and freshen breath.',
          kn: 'ಬ್ಯಾಕ್ಟೀರಿಯಾವನ್ನು ತೆಗೆಯಲು ಮತ್ತು ಉಸಿರನ್ನು ತಾಜಾಗೊಳಿಸಲು ನಿಮ್ಮ ನಾಲಿಗೆಯನ್ನು ಮೃದುವಾಗಿ ಹಲ್ಲುಜ್ಜಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Brush for at least 2 minutes, twice a day.',
          kn: 'ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಕನಿಷ್ಠ 2 ನಿಮಿಷಗಳ ಕಾಲ ಹಲ್ಲುಜ್ಜಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
    ],
  },
  {
    title: {
      en: 'How to Floss Correctly',
      kn: 'ಸರಿಯಾಗಿ ಫ್ಲಾಸ್ ಮಾಡುವುದು ಹೇಗೆ',
    },
    type: 'daily_care',
    videoUrl: VIDEO_URL,
    thumbnail: PLACEHOLDER_IMAGE,
    steps: [
      {
        text: {
          en: 'Take about 18 inches of floss and wind most of it around your middle fingers.',
          kn: 'ಸುಮಾರು 18 ಅಂಗುಲ ಫ್ಲಾಸ್ ತೆಗೆದುಕೊಂಡು ಅದರ ಹೆಚ್ಚಿನ ಭಾಗವನ್ನು ನಿಮ್ಮ ಮಧ್ಯ ಬೆರಳುಗಳ ಸುತ್ತ ಸುತ್ತಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Hold the floss tightly between your thumbs and forefingers.',
          kn: 'ನಿಮ್ಮ ಹೆಬ್ಬೆರಳು ಮತ್ತು ತೋರುಬೆರಳುಗಳ ನಡುವೆ ಫ್ಲಾಸ್ ಅನ್ನು ಬಿಗಿಯಾಗಿ ಹಿಡಿಯಿರಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Gently guide the floss between teeth using a rubbing motion.',
          kn: 'ಉಜ್ಜುವ ಚಲನೆಯನ್ನು ಬಳಸಿ ಹಲ್ಲುಗಳ ನಡುವೆ ಫ್ಲಾಸ್ ಅನ್ನು ಮೃದುವಾಗಿ ಮಾರ್ಗದರ್ಶನ ಮಾಡಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Curve the floss around each tooth in a C shape and slide it under the gumline.',
          kn: 'ಪ್ರತಿ ಹಲ್ಲಿನ ಸುತ್ತಲೂ C ಆಕಾರದಲ್ಲಿ ಫ್ಲಾಸ್ ಅನ್ನು ಬಾಗಿಸಿ ಮತ್ತು ಅದನ್ನು ಒಸಡು ರೇಖೆಯ ಕೆಳಗೆ ಜಾರಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Use a clean section of floss for each tooth. Floss once daily.',
          kn: 'ಪ್ರತಿ ಹಲ್ಲಿಗೆ ಫ್ಲಾಸ್‌ನ ಶುದ್ಧ ಭಾಗವನ್ನು ಬಳಸಿ. ದಿನಕ್ಕೊಮ್ಮೆ ಫ್ಲಾಸ್ ಮಾಡಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
    ],
  },
  {
    title: {
      en: 'Healthy Diet for Strong Teeth',
      kn: 'ಬಲವಾದ ಹಲ್ಲುಗಳಿಗೆ ಆರೋಗ್ಯಕರ ಆಹಾರ',
    },
    type: 'daily_care',
    videoUrl: VIDEO_URL,
    thumbnail: PLACEHOLDER_IMAGE,
    steps: [
      {
        text: {
          en: 'Eat calcium-rich foods like milk, cheese, and yogurt for strong teeth.',
          kn: 'ಬಲವಾದ ಹಲ್ಲುಗಳಿಗೆ ಹಾಲು, ಚೀಸ್ ಮತ್ತು ಮೊಸರಿನಂತಹ ಕ್ಯಾಲ್ಸಿಯಂ-ಭರಿತ ಆಹಾರಗಳನ್ನು ಸೇವಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Include crunchy fruits and vegetables like apples and carrots that help clean teeth naturally.',
          kn: 'ಸೇಬು ಮತ್ತು ಕ್ಯಾರೆಟ್‌ನಂತಹ ಗರಿಗರಿಯಾದ ಹಣ್ಣುಗಳು ಮತ್ತು ತರಕಾರಿಗಳನ್ನು ಸೇರಿಸಿ, ಅವು ಹಲ್ಲುಗಳನ್ನು ನೈಸರ್ಗಿಕವಾಗಿ ಸ್ವಚ್ಛಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Limit sugary snacks and drinks that can cause cavities.',
          kn: 'ಕುಳಿಗಳಿಗೆ ಕಾರಣವಾಗಬಹುದಾದ ಸಿಹಿ ತಿಂಡಿಗಳು ಮತ್ತು ಪಾನೀಯಗಳನ್ನು ಮಿತಿಗೊಳಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Drink plenty of water, especially after meals, to rinse away food particles.',
          kn: 'ಆಹಾರದ ಕಣಗಳನ್ನು ತೊಳೆಯಲು ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ, ವಿಶೇಷವಾಗಿ ಊಟದ ನಂತರ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Avoid sticky candies that cling to teeth and promote decay.',
          kn: 'ಹಲ್ಲುಗಳಿಗೆ ಅಂಟಿಕೊಳ್ಳುವ ಮತ್ತು ಕೊಳೆಯನ್ನು ಉತ್ತೇಜಿಸುವ ಅಂಟಿಕೊಳ್ಳುವ ಕ್ಯಾಂಡಿಗಳನ್ನು ತಪ್ಪಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
    ],
  },
  {
    title: {
      en: 'When to Replace Your Toothbrush',
      kn: 'ನಿಮ್ಮ ಟೂತ್‌ಬ್ರಷ್ ಅನ್ನು ಯಾವಾಗ ಬದಲಾಯಿಸಬೇಕು',
    },
    type: 'daily_care',
    videoUrl: VIDEO_URL,
    thumbnail: PLACEHOLDER_IMAGE,
    steps: [
      {
        text: {
          en: 'Replace your toothbrush every 3-4 months, or sooner if bristles are frayed.',
          kn: 'ಪ್ರತಿ 3-4 ತಿಂಗಳಿಗೊಮ್ಮೆ ನಿಮ್ಮ ಟೂತ್‌ಬ್ರಷ್ ಅನ್ನು ಬದಲಾಯಿಸಿ, ಅಥವಾ ಬ್ರಿಸಲ್‌ಗಳು ಹರಿದಿದ್ದರೆ ಬೇಗ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Always replace after being sick to avoid reinfection.',
          kn: 'ಮರು ಸೋಂಕನ್ನು ತಪ್ಪಿಸಲು ಅನಾರೋಗ್ಯದ ನಂತರ ಯಾವಾಗಲೂ ಬದಲಾಯಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Worn bristles do not clean teeth effectively.',
          kn: 'ಹರಿದ ಬ್ರಿಸಲ್‌ಗಳು ಹಲ್ಲುಗಳನ್ನು ಪರಿಣಾಮಕಾರಿಯಾಗಿ ಸ್ವಚ್ಛಗೊಳಿಸುವುದಿಲ್ಲ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Store your toothbrush upright and let it air dry between uses.',
          kn: 'ನಿಮ್ಮ ಟೂತ್‌ಬ್ರಷ್ ಅನ್ನು ನೇರವಾಗಿ ಇರಿಸಿ ಮತ್ತು ಬಳಕೆಗಳ ನಡುವೆ ಗಾಳಿಯಲ್ಲಿ ಒಣಗಲು ಬಿಡಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
    ],
  },
  {
    title: {
      en: 'Protecting Teeth During Sports',
      kn: 'ಕ್ರೀಡೆಯ ಸಮಯದಲ್ಲಿ ಹಲ್ಲುಗಳನ್ನು ರಕ್ಷಿಸುವುದು',
    },
    type: 'daily_care',
    videoUrl: VIDEO_URL,
    thumbnail: PLACEHOLDER_IMAGE,
    steps: [
      {
        text: {
          en: 'Always wear a mouthguard during contact sports like cricket, football, or martial arts.',
          kn: 'ಕ್ರಿಕೆಟ್, ಫುಟ್‌ಬಾಲ್ ಅಥವಾ ಮಾರ್ಷಲ್ ಆರ್ಟ್ಸ್‌ನಂತಹ ಸಂಪರ್ಕ ಕ್ರೀಡೆಗಳ ಸಮಯದಲ್ಲಿ ಯಾವಾಗಲೂ ಮೌತ್‌ಗಾರ್ಡ್ ಧರಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Custom-fitted mouthguards from a dentist offer the best protection.',
          kn: 'ದಂತವೈದ್ಯರಿಂದ ಕಸ್ಟಮ್-ಫಿಟ್ ಮಾಡಿದ ಮೌತ್‌ಗಾರ್ಡ್‌ಗಳು ಉತ್ತಮ ರಕ್ಷಣೆಯನ್ನು ನೀಡುತ್ತವೆ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Boil-and-bite mouthguards from stores are a good alternative.',
          kn: 'ಅಂಗಡಿಗಳಿಂದ ಬಾಯಿಲ್-ಮತ್ತು-ಬೈಟ್ ಮೌತ್‌ಗಾರ್ಡ್‌ಗಳು ಉತ್ತಮ ಪರ್ಯಾಯವಾಗಿದೆ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Clean your mouthguard after each use and store it in a ventilated case.',
          kn: 'ಪ್ರತಿ ಬಳಕೆಯ ನಂತರ ನಿಮ್ಮ ಮೌತ್‌ಗಾರ್ಡ್ ಅನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ ಮತ್ತು ಗಾಳಿಯಾಡುವ ಕೇಸ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
      {
        text: {
          en: 'Replace your mouthguard if it becomes worn, damaged, or ill-fitting.',
          kn: 'ನಿಮ್ಮ ಮೌತ್‌ಗಾರ್ಡ್ ಹರಿದಿದ್ದರೆ, ಹಾನಿಗೊಂಡಿದ್ದರೆ ಅಥವಾ ಸರಿಯಾಗಿ ಹೊಂದಿಕೆಯಾಗದಿದ್ದರೆ ಅದನ್ನು ಬದಲಾಯಿಸಿ.',
        },
        imageUrl: PLACEHOLDER_IMAGE,
      },
    ],
  },
];

async function seedProtocols() {
  console.log('\n========================================');
  console.log('  Tooth Aids - Protocol Seeding Script');
  console.log('========================================\n');

  // Validate MongoDB URI
  if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI environment variable is required');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      dbName: 'dentalcare',
    });
    console.log('Connected to MongoDB successfully.\n');

    // Get or create Trauma model
    const Trauma = mongoose.models.Trauma || mongoose.model('Trauma', traumaSchema);

    // Check existing protocols
    const existingCount = await Trauma.countDocuments();
    console.log(`Found ${existingCount} existing protocols.`);

    // Prepare all protocols with step numbers
    const allProtocols = [...firstAidProtocols, ...dailyCareProtocols].map(protocol => ({
      ...protocol,
      numberOfFirstAidSteps: protocol.steps.length,
      steps: protocol.steps.map((step, index) => ({
        ...step,
        stepNumber: index + 1,
      })),
    }));

    // Insert protocols
    console.log('\nCreating 10 test protocols...');
    const created = await Trauma.insertMany(allProtocols);
    
    console.log('\n========================================');
    console.log('  Protocols created successfully!');
    console.log('========================================');
    console.log(`  First Aid protocols: 5`);
    console.log(`  Daily Care protocols: 5`);
    console.log(`  Total protocols created: ${created.length}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\nFailed to seed protocols:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
seedProtocols();
