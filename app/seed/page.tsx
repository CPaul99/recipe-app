import { SeedDataLoader } from "@/components/seed-data-loader";

export default function SeedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Recipe App Setup</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Load Sample Recipes</h2>
          <p className="text-gray-600 mb-4">
            This page helps you quickly set up the recipe app with sample data for testing.
            Click the button below to load 12 sample recipes with images.
          </p>
          <SeedDataLoader />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Alternative Methods</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Command line:</strong> Run <code className="bg-gray-200 px-2 py-1 rounded">make backend-seed</code> to generate the recipes.json file</p>
            <p><strong>API endpoint:</strong> POST to <code className="bg-gray-200 px-2 py-1 rounded">/api/seed</code> to get the seed data</p>
          </div>
        </div>
      </div>
    </div>
  );
}