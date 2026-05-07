-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('PILOTO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "RangoPiloto" AS ENUM ('D', 'C', 'B', 'A', 'S');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'INACTIVO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "TipoVehiculo" AS ENUM ('AUTO', 'MOTO', 'MONOPATIN_ELECTRICO');

-- CreateEnum
CREATE TYPE "TipoCarrera" AS ENUM ('CUARTO_MILLA', 'VUELTAS', 'DERRAPE');

-- CreateEnum
CREATE TYPE "EstadoReto" AS ENUM ('PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('RETO_RECIBIDO', 'RETO_ACEPTADO', 'RETO_RECHAZADO', 'RESULTADO', 'RANGO_SUBIDO');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'PILOTO',
    "foto_perfil" VARCHAR(500),
    "zona_localidad" VARCHAR(100),
    "zona_ciudad" VARCHAR(100),
    "zona_estado" VARCHAR(100),
    "zona_pais" VARCHAR(100),
    "rango" "RangoPiloto" NOT NULL DEFAULT 'D',
    "categoria_id" UUID,
    "victorias" INTEGER NOT NULL DEFAULT 0,
    "derrotas" INTEGER NOT NULL DEFAULT 0,
    "retos_consecutivos" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_categories" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "competition_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tipo_vehiculo" "TipoVehiculo" NOT NULL,
    "marca" VARCHAR(100) NOT NULL,
    "modelo" VARCHAR(100) NOT NULL,
    "anio" INTEGER NOT NULL,
    "color" VARCHAR(50) NOT NULL,
    "placa" VARCHAR(20),
    "foto" VARCHAR(500),
    "modificaciones" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" UUID NOT NULL,
    "retador_id" UUID NOT NULL,
    "retado_id" UUID NOT NULL,
    "tipo_carrera" "TipoCarrera" NOT NULL,
    "vehiculo_retador_id" UUID,
    "vehiculo_retado_id" UUID,
    "estado" "EstadoReto" NOT NULL DEFAULT 'PENDIENTE',
    "ganador_id" UUID,
    "pista_id" UUID,
    "fecha_acordada" TIMESTAMPTZ(6),
    "notas" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pistas" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "tipo_carrera" "TipoCarrera" NOT NULL,
    "dificultad" VARCHAR(50),
    "coordenadas" VARCHAR(100),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "mensaje" VARCHAR(500) NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "referencia_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_rango_estado_idx" ON "users"("rango", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_placa_key" ON "vehicles"("placa");

-- CreateIndex
CREATE INDEX "vehicles_user_id_idx" ON "vehicles"("user_id");

-- CreateIndex
CREATE INDEX "challenges_retador_id_estado_idx" ON "challenges"("retador_id", "estado");

-- CreateIndex
CREATE INDEX "challenges_retado_id_estado_idx" ON "challenges"("retado_id", "estado");

-- CreateIndex
CREATE INDEX "notifications_user_id_leida_idx" ON "notifications"("user_id", "leida");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "competition_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_retador_id_fkey" FOREIGN KEY ("retador_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_retado_id_fkey" FOREIGN KEY ("retado_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_ganador_id_fkey" FOREIGN KEY ("ganador_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_pista_id_fkey" FOREIGN KEY ("pista_id") REFERENCES "pistas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_vehiculo_retador_id_fkey" FOREIGN KEY ("vehiculo_retador_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_vehiculo_retado_id_fkey" FOREIGN KEY ("vehiculo_retado_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
