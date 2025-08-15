-- AlterTable
ALTER TABLE "public"."recipe_info" ADD COLUMN     "instructions" VARCHAR(250),
ADD COLUMN     "instructions_list" TEXT[];
