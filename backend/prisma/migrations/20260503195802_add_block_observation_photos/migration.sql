-- CreateTable
CREATE TABLE "block_observation_photos" (
    "id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "block_observation_photos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "block_observation_photos" ADD CONSTRAINT "block_observation_photos_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
