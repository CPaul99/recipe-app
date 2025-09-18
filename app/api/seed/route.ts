import { NextResponse } from 'next/server';
import { SEED_RECIPES } from '@/lib/seed/seed-recipes';

export async function POST() {
  try {
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${SEED_RECIPES.length} recipes`,
      recipes: SEED_RECIPES
    });
  } catch (error) {
    console.error('Error seeding recipes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed recipes' },
      { status: 500 }
    );
  }
}