-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipoNotificacion" ADD VALUE 'NUEVA_PISTA';
ALTER TYPE "TipoNotificacion" ADD VALUE 'CAMBIO_CATEGORIA';

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "categoria_id" UUID,
ADD COLUMN     "pista_id" UUID;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_pista_id_fkey" FOREIGN KEY ("pista_id") REFERENCES "pistas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "competition_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
