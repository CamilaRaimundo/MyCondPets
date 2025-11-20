import { NextResponse } from 'next/server';
import pool from '../../_lib/db';

export async function GET() {
  console.log('🔍 Iniciando requisição ao dashboard...');
  let client;
  
  try {
    console.log('📡 Tentando conectar ao banco de dados...');
    client = await pool.connect();
    console.log('✅ Conectado ao banco!');
    
    // ============================== 
    // CONSULTAS DO DASHBOARD 
    // ============================== 
    
    // Total de Pets
    const totalPetsResult = await client.query(`
      SELECT COUNT(*) AS total_pets 
      FROM pet;
    `);
    console.log('📊 Total pets:', totalPetsResult.rows[0]);
    
    // Pets Perdidos - usando a coluna pet_porte como indicador temporário
    // Você pode adicionar uma coluna 'perdido' depois ou usar outra lógica
    const totalPetsPerdidosResult = await client.query(`
      SELECT COUNT(*) AS total_perdidos 
      FROM pet 
      WHERE pet_porte IS NULL OR pet_porte = '';
    `);
    console.log('📊 Pets perdidos:', totalPetsPerdidosResult.rows[0]);
    
    // Total de Donos
    const totalDonosResult = await client.query(`
      SELECT COUNT(*) AS total_donos 
      FROM dono;
    `);
    console.log('📊 Total donos:', totalDonosResult.rows[0]);
    
    // Apartamentos com Pets - usando res_numero ao invés de res_apto
    const totalAptosPetsResult = await client.query(`
      SELECT COUNT(DISTINCT residencia.res_numero) AS total_aptos_com_pets 
      FROM residencia 
      JOIN pet ON pet.don_id = residencia.don_id;
    `);
    console.log('📊 Aptos com pets:', totalAptosPetsResult.rows[0]);
    
    // OBJETO FINAL PARA O FRONT
    const dashboard = {
      petsCadastrados: parseInt(totalPetsResult.rows[0].total_pets) || 0,
      petsPerdidos: parseInt(totalPetsPerdidosResult.rows[0].total_perdidos) || 0,
      donosCadastrados: parseInt(totalDonosResult.rows[0].total_donos) || 0,
      aptosComPets: parseInt(totalAptosPetsResult.rows[0].total_aptos_com_pets) || 0,
    };
    
    console.log('✅ Dados do dashboard:', dashboard);
    return NextResponse.json(dashboard, { status: 200 });
    
  } catch (error) {
    console.error('❌ Erro ao buscar dados do dashboard:', error);
    console.error('Stack:', error.stack);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do dashboard', details: error.message }, 
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}