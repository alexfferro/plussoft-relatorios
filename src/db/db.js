const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Definir o caminho para o arquivo do banco de dados SQLite
const dbPath = path.resolve(__dirname, 'database.sqlite');

// Abrir conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

// Criar a tabela de relatórios (caso não exista)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            query TEXT,
            url_pdf TEXT,
            url_file TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err.message);
        } else {
            console.log('Tabela reports criada com sucesso');
        }
    });
});

module.exports = db;
