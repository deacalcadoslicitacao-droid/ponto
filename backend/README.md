# Backend - Ponto Eletrônico

Como rodar:
1. cd backend
2. cp .env.example .env   (edite se necessário)
3. npm install
4. npm run init-db    # cria DB e usuário admin com credenciais do .env
5. npm start

Rotas:
- POST /login
  - Body: { email, password }
  - Retorno: { token, user }

- POST /user/create (admin)
  - Body: { name, email, password, role }

- PUT /user/edit (admin)
  - Body: { id, name, email, role }

- DELETE /user/:id (admin)

- GET /users (admin)

- POST /registro
  - Header: Authorization: Bearer <token>
  - Body: { tipo, latitude, longitude, timestamp? }

- GET /registros/:id
  - Header: Authorization: Bearer <token>
  - id = user id (admin pode ver qualquer id; user só o próprio)

- GET /relatorio/:id/export-csv (admin)
  - Baixa CSV com todos os registros do usuário id

Erros:
- 400 - Requisição inválida
- 401 - Não autorizado
- 404 - Rota inexistente
- 500 - Erro interno
