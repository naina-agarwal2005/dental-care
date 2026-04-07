const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'dentalcare' });
    await mongoose.connection.db.collection('admins').drop();
    console.log('Admin account cleared successfully.');
  } catch (e) {
    console.log('Admin account missing or already cleared.');
  } finally {
    process.exit(0);
  }
}
run();
