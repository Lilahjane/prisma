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
        },
      });
    }

    // Step 3: Insert into nutrients
    if (recipeJson.calories || recipeJson.nutrients) {
      await prisma.nutrients.create({
        data: {
          recipe_id: recipeId,
          calories: recipeJson.calories,
          fat_content: recipeJson.fat_content,
          fiber_content: recipeJson.fiber_content,
          sugar_content: recipeJson.sugar_content,
          sodium_content: recipeJson.sodium_content,
          protein_content: recipeJson.protein_content,
          cholesterol_content: recipeJson.cholesterol_content,
          carbohydrate_content: recipeJson.carbohydrate_content,
          saturated_fat_content: recipeJson.saturated_fat_content,
          unsaturated_fat_content: recipeJson.unsaturated_fat_content,
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
