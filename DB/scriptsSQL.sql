CREATE DATABASE mycondpets;
USE mycondpets;

CREATE TABLE IF NOT EXISTS dono (
    don_id SERIAL PRIMARY KEY,
    don_nome VARCHAR(150) NOT NULL,
    don_email VARCHAR(150) NOT NULL UNIQUE,
    don_contato VARCHAR(20),
    don_cpf VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS residencia (
    res_id SERIAL PRIMARY KEY,
    res_complemento VARCHAR(200),
    res_numero INT,
    res_rua VARCHAR(150),
    res_bairro VARCHAR(150),
    res_cidade VARCHAR(150),
    res_estado VARCHAR(2),
    res_cep VARCHAR(15),
    don_id INT,
    CONSTRAINT fk_residencia_dono FOREIGN KEY (don_id) 
        REFERENCES dono(don_id)
);

CREATE TABLE IF NOT EXISTS pet (
    pet_id SERIAL PRIMARY KEY,
    pet_nome VARCHAR(150) NOT NULL,
    pet_tipo VARCHAR(100),
    pet_raca VARCHAR(100),
    pet_porte VARCHAR(50),
    pet_sexo VARCHAR(20),
    pet_data_nascimento DATE,
    pet_cor VARCHAR(50),
    pet_foto TEXT,
    don_id INT,
    CONSTRAINT fk_pet_dono FOREIGN KEY (don_id)
        REFERENCES dono(don_id)
);

CREATE TABLE IF NOT EXISTS noticias (
    not_id SERIAL PRIMARY KEY,
    not_titulo VARCHAR(300) NOT NULL,
    not_conteudo TEXT NOT NULL,
    not_data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    don_id INT,
    not_foto TEXT,
    CONSTRAINT fk_noticias_dono FOREIGN KEY (don_id)
        REFERENCES dono(don_id)
);
