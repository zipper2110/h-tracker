import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Entry from '@/models/Entry';

// GET - Get all entries
export async function GET() {
  try {
    await connectToDatabase();
    const entries = await Entry.find({}).sort({ date: -1 });
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

// POST - Create new entry
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate the entry
    if (!body.date || !body.mood || !body.activity || !body.sweetFood) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if entry for this date already exists
    const existingEntry = await Entry.findOne({
      date: {
        $gte: new Date(new Date(body.date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(body.date).setHours(23, 59, 59, 999))
      }
    });
    
    if (existingEntry) {
      // Update existing entry
      const updated = await Entry.findByIdAndUpdate(
        existingEntry._id,
        { ...body },
        { new: true, runValidators: true }
      );
      return NextResponse.json(updated);
    } else {
      // Create new entry
      const entry = await Entry.create(body);
      return NextResponse.json(entry, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
} 