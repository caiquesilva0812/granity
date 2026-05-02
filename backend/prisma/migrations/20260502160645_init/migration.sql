-- CreateEnum
CREATE TYPE "AppRole" AS ENUM ('GESTOR', 'OPERACIONAL');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('PEDREIRA', 'SERRARIA');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'BRL');

-- CreateEnum
CREATE TYPE "BlockStatus" AS ENUM ('DISPONIVEL', 'RESERVADO', 'VENDIDO');

-- CreateEnum
CREATE TYPE "PhotoAngle" AS ENUM ('FRENTE', 'TOPO', 'TRASEIRA', 'LATERAL_ESQ', 'LATERAL_DIR');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "address" TEXT,
    "type" "CompanyType" NOT NULL DEFAULT 'PEDREIRA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "job_title" TEXT,
    "app_role" "AppRole",
    "cpf" TEXT,
    "phone" TEXT,
    "admitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_types" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "material_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_classifications" (
    "id" TEXT NOT NULL,
    "material_type_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "material_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocks" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "c" DECIMAL(6,2) NOT NULL,
    "l" DECIMAL(6,2) NOT NULL,
    "a" DECIMAL(6,2) NOT NULL,
    "c_net" DECIMAL(6,2) NOT NULL,
    "l_net" DECIMAL(6,2) NOT NULL,
    "a_net" DECIMAL(6,2) NOT NULL,
    "material_type_id" TEXT,
    "material_classification_id" TEXT,
    "status" "BlockStatus" NOT NULL DEFAULT 'DISPONIVEL',
    "extraction_front" TEXT,
    "extracted_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block_photos" (
    "id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "angle" "PhotoAngle" NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "block_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "front" TEXT NOT NULL,
    "labor_count" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "companies"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "employees_company_id_user_id_key" ON "employees"("company_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_company_id_code_key" ON "blocks"("company_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "block_photos_block_id_angle_key" ON "block_photos"("block_id", "angle");

-- CreateIndex
CREATE UNIQUE INDEX "productions_block_id_key" ON "productions"("block_id");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_types" ADD CONSTRAINT "material_types_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_classifications" ADD CONSTRAINT "material_classifications_material_type_id_fkey" FOREIGN KEY ("material_type_id") REFERENCES "material_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_material_type_id_fkey" FOREIGN KEY ("material_type_id") REFERENCES "material_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_material_classification_id_fkey" FOREIGN KEY ("material_classification_id") REFERENCES "material_classifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_photos" ADD CONSTRAINT "block_photos_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productions" ADD CONSTRAINT "productions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productions" ADD CONSTRAINT "productions_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
