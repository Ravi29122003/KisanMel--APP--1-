const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  try {
    // Use env variable if provided, else fallback to local MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisan-mel';
    console.log(`Connecting to ${uri}`);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get list of collections in the current database
    const collections = await mongoose.connection.db.listCollections().toArray();

    if (!collections.length) {
      console.log('No collections found in this database.');
    }

    for (const { name } of collections) {
      const col = mongoose.connection.db.collection(name);
      const count = await col.countDocuments();
      const sampleDocs = await col.find({}).limit(5).toArray();

      console.log('---------------------------');
      console.log(`Collection: ${name}`);
      console.log(`Document count: ${count}`);
      console.log('Sample documents (up to 5):');
      console.dir(sampleDocs, { depth: null, colors: true });
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Error while listing collections:', err);
    process.exit(1);
  }
})(); 