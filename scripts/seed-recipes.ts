#!/usr/bin/env tsx

import { SEED_RECIPES } from "../lib/seed/seed-recipes";

// Node.js script to call the seeding API endpoint
async function seedRecipes() {
  try {
    const PORT = process.env.PORT || 3000;
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXTAUTH_URL || `http://localhost:${PORT}`
      : `http://localhost:${PORT}`;

    console.log('🌱 Starting recipe seeding process...');

    // First, start the Next.js development server if not already running
    const { spawn } = await import('child_process');

    let serverProcess: any = null;
    let serverReady = false;

    try {
      // Test if server is already running
      const testResponse = await fetch(`${baseUrl}/api/seed`);
      serverReady = true;
      console.log('✅ Next.js server is already running');
    } catch {
      console.log('🚀 Starting Next.js development server...');
      serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: false
      });

      // Wait for server to be ready
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Server startup timeout'));
        }, 30000);

        const checkServer = async () => {
          try {
            await fetch(`${baseUrl}/api/seed`);
            clearTimeout(timeout);
            serverReady = true;
            resolve();
          } catch {
            setTimeout(checkServer, 1000);
          }
        };

        setTimeout(checkServer, 3000);
      });
    }

    if (serverReady) {
      console.log('📡 Calling seeding API endpoint...');
      const response = await fetch(`${baseUrl}/api/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Seeding API returned ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`✅ ${result.message}`);

      // Also write to JSON file for backup
      const { writeFileSync } = await import('fs');
      const { join } = await import('path');
      const outputPath = join(process.cwd(), 'seed-data', 'recipes.json');
      writeFileSync(outputPath, JSON.stringify(SEED_RECIPES, null, 2));
      console.log(`💾 Backup created at ${outputPath}`);
    }

    if (serverProcess) {
      console.log('🛑 Stopping development server...');
      serverProcess.kill('SIGTERM');
    }

  } catch (error) {
    console.error('❌ Error seeding recipes:', error);
    process.exit(1);
  }
}

// Run the seeding function if this script is executed directly
if (require.main === module) {
  seedRecipes();
}