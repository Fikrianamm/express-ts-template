import mongoose from 'mongoose';
import app from './app';

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  try {
    await mongoose.connect(
      process.env.DATABASE_URL as string,
    );
    console.log('🛢️ Connected To Database');
  } catch (error) {
    console.log('⚠️ Error to connect Database');
  }
});
