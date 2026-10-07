-- CreateTable
CREATE TABLE "pessoa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cpf" (
    "id" SERIAL NOT NULL,
    "numero_cpf" TEXT NOT NULL,
    "pessoa_id" INTEGER NOT NULL,

    CONSTRAINT "cpf_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_email_key" ON "pessoa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cpf_numero_cpf_key" ON "cpf"("numero_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "cpf_pessoa_id_key" ON "cpf"("pessoa_id");

-- AddForeignKey
ALTER TABLE "cpf" ADD CONSTRAINT "cpf_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
