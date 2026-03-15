# **App Name**: SwiftDental

## Core Features:

- Emergency Symptom Grid & Guides: A mobile-first grid of symptom cards ('Severe Pain', 'Broken Tooth') leading to immediate, detailed trauma care instructions for each dental emergency.
- Clinic Locator Map: An interactive map displaying nearby emergency dental clinics, initialized with mock data from 'mockData.js' for 5 dental hospitals in Patna.
- Instructional Video Library: A gallery of first-aid instructional videos fetched from a storage URL, providing visual guidance for common dental emergencies.
- Admin Panel Authentication: Secure access to a hidden Admin Panel using Firebase Authentication for content managers to manage all application content.
- Trauma Protocol Management (Admin): An Admin Panel interface allowing authenticated users to create, update, and delete trauma protocols and associated instructions, stored in Cloud Firestore.
- AI-Assisted Instruction Refinement: A generative AI tool within the Admin Panel that assists content managers in simplifying complex trauma care instructions or adapting medical jargon for various literacy levels to ensure high urgency triggers are clearly conveyed.
- Cloud Firestore for Content: Integration with Cloud Firestore for storing all dynamic application content, including clinic metadata and detailed trauma protocols.

## Style Guidelines:

- A clean, medical aesthetic with high-urgency triggers using a light color scheme. The primary color is a calming yet professional blue (#297DA3).
- The background color is a very light, desaturated blue-grey (#EEF3F5), maintaining a sterile and clean feel.
- An accent color of vibrant green (#26C896) will be used for high-urgency elements, call-to-actions, and positive feedback.
- Headlines will use 'Inter', a clean and objective sans-serif, to clearly convey urgent information. Body text will use 'PT Sans', a humanist sans-serif, for optimal readability and a modern, personable touch in instruction.
- Use minimalist, clean line icons that reinforce the medical and emergency themes, with a clear and concise visual language to reduce cognitive load during urgent situations.
- Implement a mobile-first responsive grid system for optimal readability and navigation across devices, ensuring critical information is easily accessible. Visual hierarchy will prioritize urgent instructions and immediate actions.
- Subtle, non-distracting animations for transitions and feedback, enhancing user experience without impeding the urgency of information delivery. Animations will help draw attention to critical elements only when necessary.