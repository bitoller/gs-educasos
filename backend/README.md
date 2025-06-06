# Educa SOS - Backend

Uma aplicação web Java para gerenciamento de conteúdo de conscientização sobre desastres e kits de emergência.

## Pré-requisitos

- Java JDK 11 ou superior
- Maven 3.6 ou superior
- Banco de Dados Oracle (para conectividade JDBC)

## Estrutura do Projeto

```
disaster-awareness/backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── disasterawareness/
│   │   │           ├── controller/    # Servlet controllers (@WebServlet annotations define endpoints)
│   │   │           ├── dao/          # Data Access Objects (Database interaction)
│   │   │           ├── model/        # Entity classes
│   │   │           ├── service/      # Business logic
│   │   │           └── utils/        # Utility classes (like ConnectionFactory)
│   │   ├── resources/
│   │   │   ├── db/                  # Database scripts (init.sql)
│   │   │   └── logging.properties   # Logging configuration
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   └── web.xml          # Web application configuration (Filters, etc.)
│   │       └── index.jsp            # Simple index page
└── pom.xml                          # Maven configuration (Dependencies, build, Tomcat plugin)
```

## Instruções de Configuração

1. **Configuração do Banco de Dados**
   - Instale o Oracle Database.
   - Crie um novo usuário de banco de dados.
   - Execute o script de inicialização localizado em `src/main/resources/db/init.sql`. Esse script cria as tabelas necessárias e insere dados iniciais de exemplo para conteúdos, kits e quizzes.

2. **Configuração**
   - Atualize os dados de conexão no arquivo `src/main/java/com/disasterawareness/utils/ConnectionFactory.java` conforme sua configuração Oracle.
   - A aplicação utiliza a seguinte configuração padrão (ajustável no `pom.xml` com Tomcat embutido):
     - Porta: 8080
     - Caminho de contexto: `/disaster-awareness`
     - Codificação de caracteres: UTF-8

## Executando o Backend

#### Pré-requisitos
- **Java JDK 11+** instalado.
- **Maven** instalado e configurado no PATH.
- **Oracle Database** em execução, com schema e dados iniciais configurados (via `src/main/resources/db/init.sql`).

#### Executando com Tomcat Embutido via Maven
1.  **Abra um terminal** na raiz do projeto backend.
    ```sh
    mvn clean tomcat7:run
    ```
    - Isso iniciará o servidor backend. Observe que acessar diretamente a URL raiz ([http://localhost:8080/disaster-awareness](http://localhost:8080/disaster-awareness)) pode resultar em erro, pois não há servlet mapeado para o caminho raiz. Os endpoints da API estão sob `/api/*`.

## Testando a API com Insomnia

Um arquivo de coleção do Insomnia estará disponível em `src/main/resources/` (`Insomnia_Collection.json`). Você pode importar esse arquivo no Insomnia para testar facilmente todos os endpoints do backend.

**Para usar a coleção do Insomnia:**
1.  Certifique-se de que o backend está rodando (com `mvn clean tomcat7:run` ou via Tomcat standalone).
2.  Importe o arquivo `Insomnia_Collection.json` no Insomnia.
3.  As requisições da coleção já vêm configuradas com as URLs e corpos de requisição corretos. Lembre-se de obter um token JWT no endpoint `/api/login` e incluí-lo no cabeçalho `Authorization: Bearer <token>` para acessar os endpoints protegidos.

## Endpoints da API

O backend fornece os seguintes endpoints REST da API.

**Nota:** Esses endpoints só estão acessíveis enquanto o servidor backend estiver em execução.

### Autenticação
-   `POST /api/register`: Registra um novo usuário.
    -   Corpo da requisição: Objeto JSON com `name`, `email`, e `password`.
-   `POST /api/login`: Autentica um usuário e retorna um token JWT.
    -   Corpo da requisição: Objeto JSON com `email` e `password`.
    -   Para fins de teste, você pode usar as seguintes credenciais de admin: `admin@mail.com` / `password123`  (Será necessário atualizar manualmente o campo `is_admin` do usuário no banco para 1 após o cadastro para torná-lo admin).

### Endpoints de Admin
Esses endpoints exigem **privilégios de administrador** e um **token JWT** válido (`Authorization: Bearer <token>` header):
-   `GET /api/admin/users`: Retorna todos os usuários.
-   `GET /api/admin/users/{id}`: Retorna um usuário específico por ID.
-   `PUT /api/admin/users/{id}`: Atualiza informações de um usuário.
    -   Corpo da requisição: Objeto JSON com campos opcionais `name`, `email`, e `isAdmin`.
-   `DELETE /api/admin/users/{id}`: Deleta um usuário.
-   `PUT /api/admin/user/score`: Atualiza a pontuação de um usuário.
    -   Corpo da requisição: Objeto JSON com `userId` (Long) e `score` (Integer).

### Gerenciamento de Pontuação
-   `GET /api/leaderboard`: Retorna o ranking de usuários ordenado por pontuação.
    -   Retorno: Lista de usuários com suas pontuações em ordem decrescente.
    -   **Nota:** Este endpoint é **público** e não requer autenticação.

### Gerenciamento de Kits
Esses endpoints requerem um **token JWT** válido (`Authorization: Bearer <token>` header):
-   `GET /api/kit`: Retorna todos os kits de emergência. Para usuários comuns, retorna kits **criados pelo usuário autenticado**. **Administradores podem ver todos os kits.** Cada kit inclui o campo `recommendedItems` com uma string JSON de itens recomendados com base nos atributos do kit.
-   `POST /api/kit`: Cria um novo kit de emergência. O kit será associado ao **usuário autenticado**.
    -   Para kits **gerados automaticamente** forneça `houseType`, `numResidents`, `hasChildren`, `hasElderly`, `hasPets`, e `region`. Itens recomendados serão gerados automaticamente.
        ```json
        {
          "houseType": "CASA",
          "numResidents": 4,
          "hasChildren": true,
          "hasElderly": false,
          "hasPets": true,
          "region": "SUDOESTE"
        }
        ```
    -   Para kits **customizados** inclua `isCustom: true` e forneça os itens desejados no campo `recommendedItems` como um array JSON com `name` e `description`. Outros atributos do kit ainda podem ser fornecidos como contexto, mas não serão usados na geração de itens.
        ```json
        {
          "houseType": "APARTAMENTO",
          "numResidents": 1,
          "hasChildren": false,
          "hasElderly": false,
          "hasPets": false,
          "region": "SUDESTE",
          "isCustom": true,
          "recommendedItems": "[{\"name\":\"Minha Bateria Portátil\",\"description\":\"Para carregar meu celular em emergências.\"}, {\"name\":\"Meu Livro Favorito\",\"description\":\"Para me manter entretido.\"}]"
        }
        ```
-   `GET /api/kit/{id}`: Retorna um kit de emergência específico por ID. **Requer que o usuário autenticado seja o dono do kit ou um administrador.** O objeto do kit inclui o campo `recommendedItems` e a flag `isCustom`.
    -   `{id}`: O ID do kit (parâmetro de rota).
-   `PUT /api/kit/{id}`: Atualiza um kit de emergência existente. **Requer que o usuário autenticado seja o dono do kit ou um administrador.**
    -   `{id}`: O ID do kit (parâmetro de rota).
    -   Corpo da requisição: Pode incluir atributos padrão atualizados do kit. Se `recommendedItems` for fornecido no corpo da requisição, o kit será marcado como customizado e os itens fornecidos serão salvos. Caso contrário, se o kit não for customizado, os itens recomendados serão regenerados com base nos atributos fornecidos.
-   `DELETE /api/kit/{id}`: Deleta um kit de emergência pelo seu ID. **Requer que o usuário autenticado seja o dono do kit ou um administrador.**
    -   `{id}`: O ID do kit (parâmetro de rota).
-   `GET /api/kit/house/{houseType}`: Retorna kits filtrados por tipo de moradia.
    -   `{houseType}`: O tipo de moradia (ex.: APARTAMENTO, CASA, SITIO) (parâmetro de rota).
-   `GET /api/kit/region/{region}`: Retorna kits filtrados por região.
    -   `{region}`: A região (ex.: SUDESTE, NORDESTE, SUL, NORTE) (parâmetro de rota).

### Gerenciamento de Conteúdo
Estes endpoints requerem um **token JWT** válido (`Authorization: Bearer <token>` header):
-   `GET /api/content`: Retorna todo o conteúdo de conscientização sobre desastres.
    -   **Nota:** Este endpoint agora é **publicamente acessível** e não requer autenticação.
-   `POST /api/content`: Cria novo conteúdo de conscientização sobre desastres.
-   `GET /api/content/{id}`: Retorna um item de conteúdo específico pelo seu ID.
    -   `{id}`: O ID do item de conteúdo (parâmetro de rota).
    -   **Nota:** Este endpoint agora é **publicamente acessível** e não requer autenticação.
-   `PUT /api/content/{id}`: Atualiza um item de conteúdo existente.
-   `DELETE /api/content/{id}`: Deleta um item de conteúdo pelo seu ID.
-   `GET /api/content/disaster/{disasterType}`: Retorna conteúdo filtrado por tipo de desastre.
    -   `{disasterType}`: O tipo de desastre (parâmetro de rota).
    -   **Nota:** Este endpoint agora é **publicamente acessível** e não requer autenticação.

### Endpoints de Quiz

Esses endpoints são para acessar quizzes e enviar respostas.

-   `GET /api/quizzes`: Retorna uma lista de todos os quizzes disponíveis.
    -   Retorna: Array JSON de objetos Quiz (sem perguntas/opções inicialmente).
    -   **Nota:** Este endpoint é **público** e não requer autenticação.
-   `GET /api/quizzes/{id}`: Retorna um quiz específico por ID, incluindo suas perguntas e opções de resposta.
    -   `{id}`: O ID do quiz (parâmetro de rota).
    -   Retorna: Objeto JSON do Quiz com objetos aninhados de Question e AnswerChoice.
    -   **Nota:** Este endpoint é **público** e não requer autenticação.
-   `POST /api/quizzes/submit`: Envia respostas de um quiz para calcular a pontuação e atualizar a pontuação total do usuário.
    -   Requer: **Cabeçalho de Autenticação JWT** (`Authorization: Bearer <token>`).
    -   Corpo da requisição: Objeto JSON com `quizId` (Long) e `submittedAnswers` (objeto JSON onde as chaves são IDs de pergunta (String) e os valores são IDs das opções de resposta enviadas (Long)).
        ```json
        {
            "quizId": 1,
            "submittedAnswers": {
                "1": 3,  // ID da Pergunta 1, ID da opção de resposta enviada 3
                "2": 5   // ID da Pergunta 2, ID da opção de resposta enviada 5
                // ... mais respostas
            }
        }
        ```
    -   Retorna: Objeto JSON indicando sucesso e a pontuação obtida.
        ```json
        {
            "message": "Quiz enviado com sucesso",
            "scoreEarned": 20
        }
        ```

## Segurança

A aplicação usa autenticação baseada em JWT para a maioria dos endpoints `/api/*`.
Endpoints públicos como `/api/leaderboard`, `GET /api/quizzes`, e `GET /api/quizzes/{id}` não requerem autenticação.

Endpoints de administração (`/api/admin/*`) ão protegidos por um filtro adicional que verifica o campo `isAdmin` do usuário autenticado.

## Solução de Problemas

-   **Problemas de Conexão com o Banco de Dados:** Verifique as credenciais do banco de dados e certifique-se de que o Oracle Database está em execução e acessível.
-   **Erros 500 após Inserção no Banco:** Se você encontrar um erro 500 após confirmar que uma entrada foi criada (especialmente para operações INSERT em que o backend precisa do ID gerado), pode haver um problema ao recuperar o ID automaticamente gerado pelo Oracle. Verifique os logs do servidor para exceções. Os arquivos `ContentDAOImpl` e `KitDAOImpl` contêm tratamento específico para Oracle. Certifique-se de que você executou o script `init.sql` completa e corretamente.
-   **Erros 404:** Verifique o caminho de contexto (`/disaster-awareness`) nas URLs da sua requisição e certifique-se de que a aplicação foi implantada corretamente e está rodando no Tomcat. Lembre-se de que a URL raiz pode exibir erro, mas os endpoints da API estão sob `/api/*`.
-   **Porta Já Está em Uso:** Se a porta 8080 estiver em uso, você pode alterá-la no `pom.xml` na configuração do `tomcat7-maven-plugin` .
-   **Pontuação Incorreta no Quiz:** Certifique-se de ter executado completamente o script `init.sql` para popular corretamente as tabelas de quiz, já que os campos `is_correct` determinam as respostas corretas.