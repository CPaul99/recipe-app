#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const generateId = () => crypto.randomUUID();

const RecipeTag = {
  Breakfast: "breakfast",
  Lunch: "lunch",
  Dinner: "dinner",
  Dessert: "dessert",
  Snack: "snack",
  Beverage: "beverage",
  Vegan: "vegan",
  Vegetarian: "vegetarian",
  GlutenFree: "gluten-free",
  DairyFree: "dairy-free",
  LowCarb: "low-carb",
  Quick: "quick",
  Healthy: "healthy",
};

const SEED_RECIPES = [
  {
    id: generateId(),
    title: "Classic Spaghetti Carbonara",
    description: "A traditional Italian pasta dish with eggs, cheese, and pancetta",
    author: "Chef Marco",
    imageUrl: "/seed-data/images/dish1.jpg",
    tags: [RecipeTag.Dinner, RecipeTag.Quick],
    ingredients: [
      { id: generateId(), name: "Spaghetti", quantity: "400g" },
      { id: generateId(), name: "Pancetta", quantity: "200g", preparation: "diced" },
      { id: generateId(), name: "Eggs", quantity: "4 large" },
      { id: generateId(), name: "Parmesan cheese", quantity: "100g", preparation: "grated" },
      { id: generateId(), name: "Black pepper", quantity: "to taste" }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Cook spaghetti in salted boiling water until al dente", timerMinutes: 10 },
      { id: generateId(), order: 2, instruction: "Fry pancetta until crispy" },
      { id: generateId(), order: 3, instruction: "Beat eggs with cheese and pepper" },
      { id: generateId(), order: 4, instruction: "Combine hot pasta with pancetta, then quickly mix in egg mixture" }
    ],
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Fresh Garden Salad",
    description: "A vibrant mix of seasonal vegetables with homemade vinaigrette",
    author: "Sarah Green",
    imageUrl: "/seed-data/images/dish2.jpg",
    tags: [RecipeTag.Lunch, RecipeTag.Healthy, RecipeTag.Vegetarian, RecipeTag.Quick],
    ingredients: [
      { id: generateId(), name: "Mixed greens", quantity: "200g" },
      { id: generateId(), name: "Cherry tomatoes", quantity: "150g", preparation: "halved" },
      { id: generateId(), name: "Cucumber", quantity: "1 medium", preparation: "sliced" },
      { id: generateId(), name: "Red onion", quantity: "1/4", preparation: "thinly sliced" },
      { id: generateId(), name: "Olive oil", quantity: "3 tbsp" },
      { id: generateId(), name: "Balsamic vinegar", quantity: "1 tbsp" }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Wash and dry all vegetables thoroughly" },
      { id: generateId(), order: 2, instruction: "Combine greens, tomatoes, cucumber, and onion in a large bowl" },
      { id: generateId(), order: 3, instruction: "Whisk olive oil and balsamic vinegar together" },
      { id: generateId(), order: 4, instruction: "Drizzle dressing over salad and toss gently" }
    ],
    servings: 2,
    prepTimeMinutes: 15,
    totalTimeMinutes: 15,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Chocolate Chip Cookies",
    description: "Soft and chewy homemade cookies with plenty of chocolate chips",
    author: "Baker Betty",
    imageUrl: "/seed-data/images/dish3.jpg",
    tags: [RecipeTag.Dessert, RecipeTag.Snack],
    ingredients: [
      { id: generateId(), name: "All-purpose flour", quantity: "2 1/4 cups" },
      { id: generateId(), name: "Butter", quantity: "1 cup", preparation: "softened" },
      { id: generateId(), name: "Brown sugar", quantity: "3/4 cup" },
      { id: generateId(), name: "White sugar", quantity: "3/4 cup" },
      { id: generateId(), name: "Eggs", quantity: "2 large" },
      { id: generateId(), name: "Vanilla extract", quantity: "2 tsp" },
      { id: generateId(), name: "Chocolate chips", quantity: "2 cups" }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Preheat oven to 375°F (190°C)" },
      { id: generateId(), order: 2, instruction: "Cream butter and sugars until fluffy", timerMinutes: 3 },
      { id: generateId(), order: 3, instruction: "Beat in eggs and vanilla" },
      { id: generateId(), order: 4, instruction: "Gradually mix in flour" },
      { id: generateId(), order: 5, instruction: "Fold in chocolate chips" },
      { id: generateId(), order: 6, instruction: "Drop spoonfuls onto baking sheet and bake", timerMinutes: 12 }
    ],
    servings: 24,
    prepTimeMinutes: 20,
    cookTimeMinutes: 12,
    totalTimeMinutes: 32,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Grilled Salmon with Herbs",
    description: "Perfectly seasoned salmon fillet with fresh herbs and lemon",
    author: "Chef Alex",
    imageUrl: "/seed-data/images/dish4.jpg",
    tags: [RecipeTag.Dinner, RecipeTag.Healthy, RecipeTag.Quick],
    ingredients: [
      { id: generateId(), name: "Salmon fillets", quantity: "4 pieces", preparation: "skin-on" },
      { id: generateId(), name: "Fresh dill", quantity: "2 tbsp", preparation: "chopped" },
      { id: generateId(), name: "Fresh parsley", quantity: "2 tbsp", preparation: "chopped" },
      { id: generateId(), name: "Lemon", quantity: "1 large", preparation: "sliced" },
      { id: generateId(), name: "Olive oil", quantity: "2 tbsp" },
      { id: generateId(), name: "Salt and pepper", quantity: "to taste" }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Preheat grill to medium-high heat" },
      { id: generateId(), order: 2, instruction: "Pat salmon dry and brush with olive oil" },
      { id: generateId(), order: 3, instruction: "Season with salt, pepper, and herbs" },
      { id: generateId(), order: 4, instruction: "Grill for 4-6 minutes per side", timerMinutes: 10 },
      { id: generateId(), order: 5, instruction: "Serve with lemon slices" }
    ],
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    totalTimeMinutes: 22,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Avocado Toast",
    description: "Simple and nutritious breakfast with creamy avocado on sourdough",
    author: "Morning Maven",
    imageUrl: "/seed-data/images/dish5.jpg",
    tags: [RecipeTag.Breakfast, RecipeTag.Healthy, RecipeTag.Vegetarian, RecipeTag.Quick],
    ingredients: [
      { id: generateId(), name: "Sourdough bread", quantity: "2 slices" },
      { id: generateId(), name: "Avocado", quantity: "1 large", preparation: "ripe" },
      { id: generateId(), name: "Lime juice", quantity: "1 tsp" },
      { id: generateId(), name: "Red pepper flakes", quantity: "pinch", optional: true },
      { id: generateId(), name: "Sea salt", quantity: "to taste" },
      { id: generateId(), name: "Everything bagel seasoning", quantity: "1 tsp", optional: true }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Toast bread until golden brown", timerMinutes: 3 },
      { id: generateId(), order: 2, instruction: "Mash avocado with lime juice and salt" },
      { id: generateId(), order: 3, instruction: "Spread avocado mixture on toast" },
      { id: generateId(), order: 4, instruction: "Sprinkle with red pepper flakes and seasoning" }
    ],
    servings: 1,
    prepTimeMinutes: 5,
    totalTimeMinutes: 8,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Beef Tacos",
    description: "Flavorful ground beef tacos with fresh toppings",
    author: "Taco Tuesday",
    imageUrl: "/seed-data/images/dish6.jpg",
    tags: [RecipeTag.Dinner, RecipeTag.Quick],
    ingredients: [
      { id: generateId(), name: "Ground beef", quantity: "1 lb" },
      { id: generateId(), name: "Taco shells", quantity: "8" },
      { id: generateId(), name: "Onion", quantity: "1 medium", preparation: "diced" },
      { id: generateId(), name: "Lettuce", quantity: "2 cups", preparation: "shredded" },
      { id: generateId(), name: "Tomatoes", quantity: "2 medium", preparation: "diced" },
      { id: generateId(), name: "Cheddar cheese", quantity: "1 cup", preparation: "shredded" },
      { id: generateId(), name: "Taco seasoning", quantity: "1 packet" }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Brown ground beef in a large skillet", timerMinutes: 8 },
      { id: generateId(), order: 2, instruction: "Add taco seasoning and water, simmer", timerMinutes: 5 },
      { id: generateId(), order: 3, instruction: "Warm taco shells according to package directions" },
      { id: generateId(), order: 4, instruction: "Fill shells with beef and desired toppings" }
    ],
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    totalTimeMinutes: 30,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Green Smoothie Bowl",
    description: "Nutrient-packed smoothie bowl with fresh fruits and superfoods",
    author: "Wellness Warrior",
    imageUrl: "/seed-data/images/dish7.jpg",
    tags: [RecipeTag.Breakfast, RecipeTag.Healthy, RecipeTag.Vegan, RecipeTag.Quick],
    ingredients: [
      { id: generateId(), name: "Frozen banana", quantity: "2 medium" },
      { id: generateId(), name: "Spinach", quantity: "2 cups", preparation: "fresh" },
      { id: generateId(), name: "Mango", quantity: "1/2 cup", preparation: "frozen chunks" },
      { id: generateId(), name: "Coconut milk", quantity: "1/4 cup" },
      { id: generateId(), name: "Fresh berries", quantity: "1/4 cup", preparation: "for topping" },
      { id: generateId(), name: "Chia seeds", quantity: "1 tbsp", preparation: "for topping" },
      { id: generateId(), name: "Granola", quantity: "2 tbsp", preparation: "for topping" }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Blend banana, spinach, mango, and coconut milk until smooth" },
      { id: generateId(), order: 2, instruction: "Pour into a bowl" },
      { id: generateId(), order: 3, instruction: "Top with berries, chia seeds, and granola" },
      { id: generateId(), order: 4, instruction: "Serve immediately" }
    ],
    servings: 1,
    prepTimeMinutes: 8,
    totalTimeMinutes: 8,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Chicken Stir Fry",
    description: "Quick and colorful stir fry with tender chicken and crisp vegetables",
    author: "Wok Master",
    imageUrl: "/seed-data/images/dish8.jpg",
    tags: [RecipeTag.Dinner, RecipeTag.Quick, RecipeTag.Healthy],
    ingredients: [
      { id: generateId(), name: "Chicken breast", quantity: "2 large", preparation: "sliced thin" },
      { id: generateId(), name: "Bell peppers", quantity: "2", preparation: "sliced" },
      { id: generateId(), name: "Broccoli", quantity: "2 cups", preparation: "florets" },
      { id: generateId(), name: "Soy sauce", quantity: "3 tbsp" },
      { id: generateId(), name: "Garlic", quantity: "3 cloves", preparation: "minced" },
      { id: generateId(), name: "Ginger", quantity: "1 tbsp", preparation: "grated" },
      { id: generateId(), name: "Vegetable oil", quantity: "2 tbsp" }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Heat oil in a wok or large skillet over high heat" },
      { id: generateId(), order: 2, instruction: "Cook chicken until golden and cooked through", timerMinutes: 6 },
      { id: generateId(), order: 3, instruction: "Add vegetables and stir-fry until crisp-tender", timerMinutes: 4 },
      { id: generateId(), order: 4, instruction: "Add garlic, ginger, and soy sauce, stir for 1 minute" },
      { id: generateId(), order: 5, instruction: "Serve immediately over rice" }
    ],
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    totalTimeMinutes: 27,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Pancakes",
    description: "Fluffy buttermilk pancakes perfect for weekend mornings",
    author: "Pancake Pro",
    imageUrl: "/seed-data/images/dish9.jpg",
    tags: [RecipeTag.Breakfast, RecipeTag.Vegetarian],
    ingredients: [
      { id: generateId(), name: "All-purpose flour", quantity: "2 cups" },
      { id: generateId(), name: "Buttermilk", quantity: "1 3/4 cups" },
      { id: generateId(), name: "Eggs", quantity: "2 large" },
      { id: generateId(), name: "Sugar", quantity: "2 tbsp" },
      { id: generateId(), name: "Baking powder", quantity: "2 tsp" },
      { id: generateId(), name: "Salt", quantity: "1 tsp" },
      { id: generateId(), name: "Butter", quantity: "4 tbsp", preparation: "melted" }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Mix dry ingredients in a large bowl" },
      { id: generateId(), order: 2, instruction: "Whisk together wet ingredients in another bowl" },
      { id: generateId(), order: 3, instruction: "Combine wet and dry ingredients until just mixed" },
      { id: generateId(), order: 4, instruction: "Cook pancakes on griddle until bubbles form, then flip", timerMinutes: 6 }
    ],
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Caesar Salad",
    description: "Classic Caesar salad with homemade dressing and croutons",
    author: "Salad Supreme",
    imageUrl: "/seed-data/images/dish10.jpg",
    tags: [RecipeTag.Lunch, RecipeTag.Vegetarian],
    ingredients: [
      { id: generateId(), name: "Romaine lettuce", quantity: "2 heads", preparation: "chopped" },
      { id: generateId(), name: "Parmesan cheese", quantity: "1/2 cup", preparation: "grated" },
      { id: generateId(), name: "Croutons", quantity: "1 cup" },
      { id: generateId(), name: "Mayonnaise", quantity: "1/3 cup" },
      { id: generateId(), name: "Lemon juice", quantity: "2 tbsp" },
      { id: generateId(), name: "Worcestershire sauce", quantity: "1 tsp" },
      { id: generateId(), name: "Garlic", quantity: "2 cloves", preparation: "minced" }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Wash and chop romaine lettuce" },
      { id: generateId(), order: 2, instruction: "Make dressing by whisking mayo, lemon juice, Worcestershire, and garlic" },
      { id: generateId(), order: 3, instruction: "Toss lettuce with dressing" },
      { id: generateId(), order: 4, instruction: "Top with Parmesan and croutons" }
    ],
    servings: 4,
    prepTimeMinutes: 15,
    totalTimeMinutes: 15,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Vegetable Curry",
    description: "Aromatic and creamy vegetable curry with coconut milk",
    author: "Spice Route",
    imageUrl: "/seed-data/images/dish11.jpg",
    tags: [RecipeTag.Dinner, RecipeTag.Vegetarian, RecipeTag.Vegan, RecipeTag.Healthy],
    ingredients: [
      { id: generateId(), name: "Mixed vegetables", quantity: "4 cups", preparation: "chopped (carrots, potatoes, peas)" },
      { id: generateId(), name: "Coconut milk", quantity: "1 can" },
      { id: generateId(), name: "Onion", quantity: "1 large", preparation: "diced" },
      { id: generateId(), name: "Curry powder", quantity: "2 tbsp" },
      { id: generateId(), name: "Ginger", quantity: "1 tbsp", preparation: "grated" },
      { id: generateId(), name: "Garlic", quantity: "3 cloves", preparation: "minced" },
      { id: generateId(), name: "Vegetable oil", quantity: "2 tbsp" }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Heat oil in large pot and sauté onion until soft", timerMinutes: 5 },
      { id: generateId(), order: 2, instruction: "Add garlic, ginger, and curry powder, cook for 1 minute" },
      { id: generateId(), order: 3, instruction: "Add vegetables and coconut milk" },
      { id: generateId(), order: 4, instruction: "Simmer until vegetables are tender", timerMinutes: 20 },
      { id: generateId(), order: 5, instruction: "Serve over rice" }
    ],
    servings: 6,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    totalTimeMinutes: 40,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Iced Coffee",
    description: "Refreshing cold brew coffee perfect for hot days",
    author: "Caffeine Queen",
    imageUrl: "/seed-data/images/dish12.jpg",
    tags: [RecipeTag.Beverage, RecipeTag.Quick],
    ingredients: [
      { id: generateId(), name: "Strong coffee", quantity: "2 cups", preparation: "cooled" },
      { id: generateId(), name: "Ice cubes", quantity: "2 cups" },
      { id: generateId(), name: "Milk or cream", quantity: "1/4 cup", optional: true },
      { id: generateId(), name: "Sugar or sweetener", quantity: "to taste", optional: true },
      { id: generateId(), name: "Vanilla extract", quantity: "1/2 tsp", optional: true }
    ],
    steps: [
      { id: generateId(), order: 1, instruction: "Brew strong coffee and let cool completely" },
      { id: generateId(), order: 2, instruction: "Fill glasses with ice cubes" },
      { id: generateId(), order: 3, instruction: "Pour coffee over ice" },
      { id: generateId(), order: 4, instruction: "Add milk, sweetener, and vanilla if desired" },
      { id: generateId(), order: 5, instruction: "Stir and serve immediately" }
    ],
    servings: 2,
    prepTimeMinutes: 5,
    totalTimeMinutes: 5,
    likes: Math.floor(Math.random() * 50) + 10,
    dislikes: Math.floor(Math.random() * 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create the public/seed-data directory if it doesn't exist
const seedDataDir = path.join(process.cwd(), 'public', 'seed-data');
if (!fs.existsSync(seedDataDir)) {
  fs.mkdirSync(seedDataDir, { recursive: true });
}

// Write the seed recipes to a JSON file in public directory
const outputPath = path.join(seedDataDir, 'recipes.json');
fs.writeFileSync(outputPath, JSON.stringify(SEED_RECIPES, null, 2));

console.log(`✅ Successfully created ${SEED_RECIPES.length} seed recipes at ${outputPath}`);

// Copy images from seed-data/images to public/seed-data/images if they exist
const sourceImagesDir = path.join(process.cwd(), 'seed-data', 'images');
const destImagesDir = path.join(process.cwd(), 'public', 'seed-data', 'images');

if (fs.existsSync(sourceImagesDir)) {
  if (!fs.existsSync(destImagesDir)) {
    fs.mkdirSync(destImagesDir, { recursive: true });
  }

  // Copy each dish image
  for (let i = 1; i <= 12; i++) {
    const imageFile = `dish${i}.jpg`;
    const sourcePath = path.join(sourceImagesDir, imageFile);
    const destPath = path.join(destImagesDir, imageFile);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
  console.log('📷 Copied recipe images to public/seed-data/images/');
} else {
  console.log('⚠️  Images not found in seed-data/images/ - recipe cards will show without images');
}

console.log('🌐 The recipes are now ready to be loaded into your application!');