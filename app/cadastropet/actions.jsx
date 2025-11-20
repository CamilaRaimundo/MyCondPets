"use server";

import pool from "@/app/_lib/db";
import { writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";

// console.log("DEBUG don_id =", formData.get("don_id"));

export async function cadastrarPet(formData) {
  try {
    const nomePet = formData.get("nome-pet");
    const especie = formData.get("especie");
    const raca = formData.get("raca");
    const dataNascimento = formData.get("data-nascimento");
    const sexo = formData.get("sexo");
    const porte = formData.get("porte");
    const foto = formData.get("foto-pet");
    const donoCpf = formData.get("don_cpf"); // Para o nome do arquivo da foto
    const donoId = formData.get("don_id"); // Para o banco de dados

    // Validações básicas
    if (!nomePet || !especie || !raca || !dataNascimento || !sexo || !porte) {
      return { success: false, message: "Preencha todos os campos obrigatórios" };
    }

    let caminhoFoto = null;

    // Processar upload da foto se existir
    if (foto && foto.size > 0) {
  try {
    const bytes = await foto.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const nomeArquivo = `pet_${donoId}_${timestamp}.${foto.name.split(".").pop()}`;
    const caminhoCompleto = join(process.cwd(), "public", "uploads", "pets", nomeArquivo);

    await writeFile(caminhoCompleto, buffer);

    caminhoFoto = `/uploads/pets/${nomeArquivo}`;
  } catch (error) {
    console.error("Erro ao salvar foto do pet:", error);
  }
}

    // Inserir no banco de dados
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

      // Revalidar a página para mostrar o novo pet
      revalidatePath("/cadastro-pet");

      return { 
        success: true, 
        message: "Pet cadastrado com sucesso!",
        petId: result.rows[0].pet_id 
      };

    } catch{
        console.error("ERRO DETALHADO:", error);
    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Erro ao cadastrar pet:", error);
    return { 
      success: false, 
      message: "Erro ao cadastrar pet. Tente novamente." 
    };
  }
}