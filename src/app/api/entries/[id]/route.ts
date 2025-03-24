import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Entry from '@/models/Entry';

type Params = {
  params: {
    id: string;
  };
};

// GET - Get a specific entry by ID
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = params;
    await connectToDatabase();
    
    const entry = await Entry.findById(id);
    
    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entry' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing entry
export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await req.json();
    
    await connectToDatabase();
    
    const updatedEntry = await Entry.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );
    
    if (!updatedEntry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an entry
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = params;
    await connectToDatabase();
    
    const deletedEntry = await Entry.findByIdAndDelete(id);
    
    if (!deletedEntry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
} 