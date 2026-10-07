import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.ts"

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/pessoas", async (req, res) => {
    try {
        const { nome, email, numero_cpf } = req.body;

        const pessoa = await prisma.pessoas.create({
            data: {
                nome,
                email,
                cpf: {
                    create: {
                        numero_cpf
                    }
                }
            },
            include: {
                cpf: true
            }
        });

        console.log("Pessoa criada:", pessoa);

        res.json(pessoa);

    } catch (error) {
        console.error("ERRO:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/pessoas", async (req, res) => {
    const pessoas = await prisma.pessoas.findMany();

    res.json(pessoas);
});

app.get("/pessoas/:id", async (req, res) => {
    try {
        const pessoa = await prisma.pessoas.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                cpf: true
            }
        });

        res.json(pessoa);

    } catch (error) {
        console.error("ERRO:", error);
        res.status(500).json({ error: error.message });
    }
});

app.put("/pessoas/:id", async (req, res) => {
    try {
        const { nome, email, numero_cpf } = await req.body;

        const pessoa = await prisma.pessoas.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                nome,
                email,
                cpf: {
                    update: {
                        numero_cpf
                    }
                }
            },
            include: {
                cpf: true
            }
        });
        res.json(pessoa);
    } catch (error) {
        console.error("ERRO:", error);
        res.status(500).json({ error: error.message });
    }
});

app.delete("/pessoas/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.cpf.delete({
            where: {
                pessoa_id: id
            }
        });

        const pessoa = await prisma.pessoas.delete({
            where: {
                id: id
            }
        });
        res.json(pessoa);
    } catch (error) {
        console.error("ERRO:", error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log("servidor round, round, rounddddd")
});