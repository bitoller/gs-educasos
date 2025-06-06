# Educa SOS - Frontend

Esta é a aplicação frontend da Plataforma Educa SOS, construída com React e Vite.

## Funcionalidades

*   Autenticação de Usuário (Login, Cadastro)
*   Gerenciamento de Kit de Emergência (Visualizar, Criar, Editar, Deletar Kits Automáticos e Personalizados)
*   Conteúdo de Conscientização sobre Desastres (Visualizar Conteúdo)
*   Quizzes interativos e Pontuação
*   Alertas de Desastres Naturais

## Começando

Para configurar e executar a aplicação frontend, siga estes passos:

1.  **Navegue até a raiz do projeto frontend:**

    ```bash
    cd /caminho/para/o/seu/projeto/raiz
    ```

2.  **Instale as Dependências:**

    ```bash
    npm install
    ```

3.  **Inicie o Servidor de Desenvolvimento:**

    ```bash
    npm run dev
    ```

    A aplicação frontend deverá estar rodando em `http://localhost:5173` (ou em outra porta, caso a 5173 esteja em uso).

## Comunicação com a API

Esta aplicação frontend se comunica com a API do backend. Certifique-se de que o backend esteja em execução antes de iniciar o servidor de desenvolvimento do frontend.

O servidor de desenvolvimento do frontend está configurado para fazer proxy das requisições da API (que começam com `/api`) para o backend, que deve estar rodando em `http://localhost:8080/disaster-awareness`.

Para mais detalhes sobre como configurar e executar o backend, consulte o arquivo `README.md` localizado no diretório `backend/` .
