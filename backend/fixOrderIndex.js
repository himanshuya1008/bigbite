import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixOrderIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');
    
    // List all indexes
    const indexes = await ordersCollection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(index => console.log('  -', JSON.stringify(index)));
    
    // Drop the orderNumber index if it exists
    try {
      await ordersCollection.dropIndex('orderNumber_1');
      console.log('\n✅ Dropped orderNumber_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n⚠️ orderNumber_1 index does not exist');
      } else {
        throw error;
      }
    }
    
    // List indexes after dropping
    const indexesAfter = await ordersCollection.indexes();
    console.log('\n📋 Indexes after cleanup:');
    indexesAfter.forEach(index => console.log('  -', JSON.stringify(index)));
    
    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixOrderIndex();
