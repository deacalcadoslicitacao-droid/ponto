````markdown name=README.md
```markdown
# Ponto Eletrônico

Sistema completo para registro de ponto eletrônico com:
- Backend: Node.js + Express + SQLite + JWT
- Frontend: React + Vite + React Router + React Query
- Mobile: Capacitor integrado ao frontend (web -> app)

Funcionalidades principais:
- Registro de ponto com tipos: entrada, intervalo-saida, intervalo-volta, saida
- Cada registro contém: usuário, timestamp, latitude, longitude, tipo
- Perfis: admin (cria/edita/exclui usuários, exporta relatórios CSV) e user (registra ponto)
- GPS obrigatório no frontend; suporta registros offline e sincronização
- Não é permitido editar registros (apenas criar)
- Controle de acesso via JWT

Arquitetura
- ponto-eletronico/
  - backend/    -> API REST
  - frontend/   -> App React (web)
  - mobile/     -> Capacitor config + instruções para gerar APK
  - README.md   -> (este arquivo)

Como usar (resumo)
1. Backend
   - cd backend
   - cp .env.example .env (configure SECRET e PORT se quiser)
   - npm install
   - npm run init-db    # cria banco e usuário admin inicial
   - npm start

2. Frontend (web)
   - cd frontend
   - npm install
   - npm run dev

3. Mobile (APK via Capacitor)
   - cd frontend
   - npm run build
   - cd mobile
   - npx cap sync
   - npx cap open android
   - Build no Android Studio (ou usar npx cap run android --target <device>)

Endpoints (resumo)
- POST /login                          -> { email, password } => { token }
- POST /user/create                    -> ADMIN only
- PUT /user/edit                       -> ADMIN only
- DELETE /user/:id                     -> ADMIN only
- GET /users                           -> ADMIN only
- POST /registro                       -> Create registro (user or admin)
- GET /registros/:id                   -> Get registros for user id (admin or self)
- GET /relatorio/:id/export-csv        -> ADMIN only (download CSV)

Observações
- Backend valida token e roles.
- Frontend inclui lógica para obrigar GPS, salvar offline e sincronizar quando voltar online.
- Relatórios CSV são gerados pelo backend e só podem ser baixados por admins.
- Não há rota para edição de registros (apenas criação e leitura), atendendo ao requisito "Não permitir edição de registros".

Detalhes de implantação, rotas, exemplos de requisições e comandos estão descritos nas pastas backend/README.md e frontend/README.md.
```
````