/*
  Warnings:

  - The `ratings` column on the `recipe_info` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."recipe_info" DROP COLUMN "ratings",
ADD COLUMN     "ratings" DOUBLE PRECISION;
