var todo = require('./models/todo');

module.exports = {
  configure: function(app) {
    app.get('/todo/', function(req, res) {
      todo.get(res);
    });

    //Método que retorna as disciplinas de um professor. (id do professor)
    app.post('/todo/disciplinas/professor/', function(req, res) {
      todo.getDisciplinasProfessor(req.body, res);
    });

    //Método que retorna as disciplinas de um aluno. (id do professor)
    app.post('/todo/disciplinas/aluno/', function(req, res) {
      todo.getDisciplinasAluno(req.body, res);
    });

    //Método que retorna os alunos de uma disciplina. (id da disciplinas)
    app.post('/todo/disciplinas/alunos/', function(req, res) {
      todo.getAlunosDaDisciplina(req.body, res);
    });


    //Login Professor
    app.post('/todo/login/professor/', function(req, res) {
        todo.loginProfessor(req.body, res);
    });

    //Login Aluno
    app.post('/todo/login/aluno/', function(req, res) {
        todo.loginAluno(req.body, res);
    });

    //Recuperar Senha Professor
    app.post('/todo/recuperar/senha/professor/', function(req, res) {
        todo.recuperarSenhaProfessor(req.body, res);
    });

    //Cadastrar aluno
    app.post('/todo/aluno/cadastrar/', function(req, res) {
      todo.cadastrarAluno(req.body, res);
    });

    //Cadastrar dados de um novo professor
    app.post('/todo/cadastrar/dados/professor/', function(req, res) {
      todo.cadastrarDadosProfessor(req.body, res);
    });

    //Cadastrar usuario de acesso de um novo professor
    app.post('/todo/cadastrar/usuario/professor/', function(req, res) {
      todo.cadastrarUsuarioProfessor(req.body, res);
    });

    //Abertura da Chamada
    app.post('/todo/professor/abrir/chamada/', function(req, res) {
      todo.abrirChamada(req.body, res);
    });

    //Fechar Chamada de uma disciplina
    app.put('/todo/professor/fechar/chamada/', function(req, res) {
      todo.fecharChamada(req.body, res);
    });

    //Buscar a chamada que está aberta (Aluno)
    app.post('/todo/aluno/chamada/', function(req, res) {
      todo.obterChamadaAberta(req.body, res);
    });

    //Autenticar presença (Aluno)
    app.post('/todo/aluno/atenticar/presenca/', function(req, res) {
      todo.autenticarPresenca(req.body, res);
    });

    //Adição de alunos manualmente na chamada (Aluno)
    app.post('/todo/presenca/aluno/manual/', function(req, res) {
      todo.autenticarPresenca(req.body, res);
    });

    //Verificar se existe alguma chamada aberta (Professor)
    app.post('/todo/professor/chamada/aberta/', function(req, res) {
      todo.checarChamadasAbertas(req.body, res);
    });

    app.post('/todo/', function(req, res) {
      todo.create(req.body, res);
    });

    app.put('/todo/', function(req, res) {
      todo.update(req.body, res);
    });

    app.delete('/todo/:id/', function(req, res) {
      todo.delete(req.params.id, res);
    });
  }
};
