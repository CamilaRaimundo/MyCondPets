"use server";

import pool from "@/app/_lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { revalidatePath } from "next/cache";

export async function cadastrarPet(formData) {
  try {
    const nomePet = formData.get("nome-pet");
    const especie = formData.get("especie");
    const raca = formData.get("raca");
    const dataNascimento = formData.get("data-nascimento");
    const sexo = formData.get("sexo");
    const porte = formData.get("porte");
    const foto = formData.get("foto-pet"); // arquivo enviado
    const donoId = formData.get("don_id");

    // Validações básicas
    if (!nomePet || !especie || !raca || !dataNascimento || !sexo || !porte) {
      return { success: false, message: "Preencha todos os campos obrigatórios." };
    }

    let caminhoFoto = null;

    // ------------------------------
    // 📌 PROCESSAR A FOTO DO PET
    // ------------------------------
    if (foto && foto.size > 0) {
      try {
        const arrayBuffer = await foto.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const extensao = foto.name.split(".").pop();
        const timestamp = Date.now();
        const nomeArquivo = `pet_${donoId}_${timestamp}.${extensao}`;

        const pastaDestino = join(process.cwd(), "public", "uploads", "pets");
        const caminhoCompleto = join(pastaDestino, nomeArquivo);

        // Garantir que a pasta exista
        await mkdir(pastaDestino, { recursive: true });

        // salvar no disco
        await writeFile(caminhoCompleto, buffer);

        caminhoFoto = `/uploads/pets/${nomeArquivo}`;
      } catch (error) {
        console.error("❌ Erro ao salvar foto do pet:", error);
      }
    }

    // --------------------------------
    // 📌 INSERÇÃO NO BANCO
    // --------------------------------
    const client = await pool.connect();

    try {
      const query = `
        INSERT INTO pet (
          pet_nome, 
          pet_tipo, 
          pet_raca, 
          pet_data_nascimento, 
          pet_sexo, 
          pet_porte, 
          pet_foto, 
          don_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING pet_id;
      `;

      const values = [
        nomePet,
        especie,
        raca,
        dataNascimento,
        sexo,
        porte,
        caminhoFoto,
        donoId
      ];

      const result = await client.query(query, values);

      // atualizar a página
      revalidatePath("/cadastropet");

      return {
        success: true,
        message: "Pet cadastrado com sucesso!",
        petId: result.rows[0].pet_id
      };

    } catch (error) {
      console.error("❌ Erro ao inserir pet no banco:", error);
      return { success: false, message: "Erro ao cadastrar no banco." };
    } finally {
      client.release();
    }

  } catch (error) {
    console.error("❌ ERRO GERAL:", error);
    return {
      success: false,
      message: "Erro ao cadastrar pet. Tente novamente."
    };
  }
}
