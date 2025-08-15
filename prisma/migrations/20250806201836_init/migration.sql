-- CreateTable
CREATE TABLE "public"."raw" (
    "id" SERIAL NOT NULL,
    "json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipe_info" (
    "recipe_id" INTEGER NOT NULL,
    "url" VARCHAR(250),
    "host" VARCHAR(250),
    "image" VARCHAR(250),
    "title" VARCHAR(250),
    "author" VARCHAR(250),
    "yields" VARCHAR(250),
    "cuisine" VARCHAR(250),
    "ratings" VARCHAR(250),
    "category" VARCHAR(250),
    "language" VARCHAR(250),
    "cook_time" VARCHAR(250),
    "prep_time" VARCHAR(250),
    "total_time" VARCHAR(250),
    "site_name" VARCHAR(250),
    "description" TEXT,
    "canonical_url" VARCHAR(250),
    "ratings_count" VARCHAR(250),

    CONSTRAINT "recipe_info_pkey" PRIMARY KEY ("recipe_id")
);

-- CreateTable
CREATE TABLE "public"."nutrients" (
    "id" SERIAL NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "calories" VARCHAR(250),
    "fat_content" VARCHAR(250),
    "fiber_content" VARCHAR(250),
    "sugar_content" VARCHAR(250),
    "sodium_content" VARCHAR(250),
    "protein_content" VARCHAR(250),
    "cholesterol_content" VARCHAR(250),
    "carbohydrate_content" VARCHAR(250),
    "saturated_fat_content" VARCHAR(250),
    "unsaturated_fat_content" VARCHAR(250),

    CONSTRAINT "nutrients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dirty_ingredients" (
    "id" SERIAL NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "ingredient" VARCHAR(600) NOT NULL,

    CONSTRAINT "dirty_ingredients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."recipe_info" ADD CONSTRAINT "recipe_info_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."raw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nutrients" ADD CONSTRAINT "nutrients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."raw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dirty_ingredients" ADD CONSTRAINT "dirty_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."raw"("id") ON DELETE CASCADE ON UPDATE CASCADE;
