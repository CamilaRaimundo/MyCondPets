CREATE DATABASE mycondpets;
USE mycondpets;

CREATE TABLE IF NOT EXISTS dono (
  don_id SERIAL PRIMARY KEY,
  don_nome VARCHAR(100) NOT NULL,
  don_email VARCHAR(100) NOT NULL UNIQUE,
  don_contato VARCHAR(15),
  don_cpf VARCHAR(11) UNIQUE
);

CREATE TABLE IF NOT EXISTS residencia (
  res_id SERIAL PRIMARY KEY,
  res_complemento VARCHAR(200) NOT NULL,
  res_numero INT NOT NULL,
  res_cep VARCHAR(10) NOT NULL,
  don_id INT,
  CONSTRAINT fk_residencia_dono FOREIGN KEY (don_id) REFERENCES dono(don_id)
);

CREATE TABLE IF NOT EXISTS pet (
  pet_id SERIAL PRIMARY KEY,
  pet_nome VARCHAR(100) NOT NULL,
  pet_tipo VARCHAR(50) NOT NULL,
  pet_raca VARCHAR(50),
  pet_foto BYTEA,
  pet_cor VARCHAR(30),
  pet_idade INT,
  don_id INT,
  CONSTRAINT fk_pet_dono FOREIGN KEY (don_id) REFERENCES dono(don_id)
);

CREATE TABLE IF NOT EXISTS noticias (
  not_id SERIAL PRIMARY KEY,
  not_titulo VARCHAR(200) NOT NULL,
  not_conteudo TEXT NOT NULL,
  not_data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  don_id INT,
  CONSTRAINT fk_noticias_dono FOREIGN KEY (don_id) REFERENCES dono(don_id)
);