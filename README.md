Sistema de Cursos React
Sobre o projeto
Aplicação web para gerenciamento de cursos, com autenticação, dashboard e integração externa via API RandomUser para criação de instrutores automáticos.
Inclui:
Login e controle de papéis (usuário e instrutor);
Criação, edição e exclusão de cursos;
Atribuição de instrutores;
Dashboard interativo com autenticação;
Integração com RandomUser API para gerar novos instrutores.

Tecnologias utilizadas:
React (frontend)
Axios (requisições HTTP)
React Router DOM (navegação)
date-fns (manipulação de datas)
json-server (API fake local)
Lucille UI / CSS customizado

Para rodar o projeto localmente
1️⃣ Clonar o repositório
git clone https://github.com/seuusuario/seuprojeto.git
cd seuprojeto

2️⃣ Instalar as dependências
npm install

3️⃣ Subir o servidor backend local
Certifique-se de que o arquivo db.json (ou equivalente) está configurado.
npx json-server --watch db.json --port 3000

4️⃣ Rodar o frontend
Em outro terminal:
npm start
Acesse: http://localhost:5173
(ou a porta do Vite, se estiver usando Vite).

Autor
Desenvolvido por Juan Lucas Clemente de Macena
2025 — Projeto acadêmico e experimental.
