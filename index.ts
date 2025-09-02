import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.use(express.json());

app.get("/load-recipes", async (_, res) => {
  const dbrecipes = await prisma.recipe_info.findMany();
  res.json(dbrecipes);
});

app.get("/load-recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await prisma.recipe_info.findUnique({
      where: { recipe_id: id }   // since your model uses recipe_id as a string
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
  
});





app.post("/recipes", async (req, res) => {
  const recipeJson = req.body;

  try {
    // Step 1: Save raw JSON
    const rawEntry = await prisma.raw.create({
      data: {
        json: recipeJson,
        created_at: new Date(),
      },
    });

    const recipeId = rawEntry.id;

    // Step 2: Insert into recipe_info
    if (recipeJson.title || recipeJson.author) {
      await prisma.recipe_info.create({
        data: {
          recipe_id: recipeId,
          title: recipeJson.title,
          author: recipeJson.author,
          yields: recipeJson.yields,
          ratings: recipeJson.ratings,
          category: recipeJson.category,
          description: recipeJson.description,
          host: recipeJson.host,
          image: recipeJson.image,
          instructions: recipeJson.instructions,
          instructions_list: recipeJson.instructions_list, // Ensure this is an array
          prep_time: recipeJson.prep_time,
          ratings_count: recipeJson.ratings_count,
          site_name: recipeJson.site_name,
          total_time: recipeJson.total_time,
          url: recipeJson.url,
          cook_time: recipeJson.cook_time,
          cuisine: recipeJson.cuisine,
          calories: recipeJson.nutrients.calories,
          fat_content: recipeJson.nutrients.fatContent,
          fiber_content: recipeJson.nutrients.fiberContent,
          sugar_content: recipeJson.nutrients.sugarContent,
          sodium_content: recipeJson.nutrients.sodiumContent,
          protein_content: recipeJson.nutrients.proteinContent,
          cholesterol_content: recipeJson.nutrients.cholesterolContent,
          carbohydrate_content: recipeJson.nutrients.carbohydrateContent,
          saturated_fat_content: recipeJson.nutrients.saturatedFatContent,
          unsaturated_fat_content: recipeJson.nutrients.unsaturatedFatContent,


        },
      });
    }




    // Step 4: Insert ingredients
    if (Array.isArray(recipeJson.ingredients) && recipeJson.ingredients.length > 0) {
      await prisma.dirty_ingredients.createMany({
        data: recipeJson.ingredients.map((ingredient: string) => ({
          recipe_id: recipeId,
          ingredient,
        })),
      });
    }

    res.status(201).json({
      success: true,
      id: recipeId,
      message: "Recipe saved and processed successfully",
    });

  } catch (err) {
    if (err instanceof Error) {
      console.error("Error saving recipe:", err.message);
      res.status(500).json({
        success: false,
        error: "Failed to save and process recipe",
        details: err.message,
      });
    } else {
      console.error("Unknown error:", err);
      res.status(500).json({
        success: false,
        error: "Failed to save and process recipe",
        details: "Unknown error occurred",
      });
    }
  }
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
