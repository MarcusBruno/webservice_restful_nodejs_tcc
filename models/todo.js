var connection = require('../connection');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var smtpTransport = nodemailer.createTransport(smtpTransport({
  host: "smtp.gmail.com",
  secureConnection: false,
  port: 587,
  auth: {
    user: "",
    pass: ""
  }
}));

function Todo() {
  this.get = function (res) {
    connection.acquire(function (err, con) {
      con.query('select * from tb_alunos', function (err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getDisciplinasProfessor = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('select td.* from tb_professores_disciplinas as tpd join tb_disciplinas as td on tpd.codigo_disciplina = td.codigo where tpd.codigo_rp = '+todo.rp+'', function (err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getDisciplinasAluno = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('select td.* from tb_alunos_disciplinas as tad join tb_disciplinas as td on tad.codigo_disciplina = td.codigo where tad.codigo_ra = '+todo.ra+'', function (err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getAlunosDaDisciplina = function (todo, res) {
    var listaAlunos = "";
    connection.acquire(function (err, con) {
      //Query que busca os alunos de uma disciplina. (Retorno: RA)
      con.query('select codigo_ra from tb_alunos_disciplinas where codigo_disciplina = '+todo.id+'', function (err, result) {
        con.release();

        for (i = 0; i < result.length; i++) {
          if ((i + 1) == result.length) {
            var aluno = "'" + result[i]["codigo_ra"] + "'";
            listaAlunos = listaAlunos + aluno;
          } else {
            var aluno = "'" + result[i]["codigo_ra"] + "',";
            listaAlunos = listaAlunos + aluno;
          }
        }
        //Query que busca os alunos pelo RA.
        con.query('select * from tb_alunos where ra in (' + listaAlunos + ')', function (err, result2) {
          res.send(result2);
        });
      });
    });
  };

  this.loginProfessor = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('SELECT p.* FROM tb_usuarios AS u JOIN tb_professores AS p ON u.rp = p.rp WHERE u.rp LIKE '+todo.rp+' AND u.senha_usuario LIKE '+todo.senha+'', todo, function (err, result) {
        con.release();
        if (err || result == "") {
          res.send({"message": null, "status":[{"status":"0"}]});
        } else {
          res.send({"message": result, "status":[{"status":"1"}]});
        }
      });
    });
  };

  this.loginAluno = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('SELECT a.* FROM tb_usuarios AS u JOIN tb_alunos AS a ON u.ra = a.ra WHERE u.ra LIKE ? AND u.senha_usuario LIKE ?', [todo.ra, todo.senha], function (err, result) {
        con.release();
        console.log(result);
        if (err || result == "") {
          res.send({"message": null, "status":[{"status":"0"}]});
        } else {
          res.send({"message": result, "status":[{"status":"1"}]});
        }
      });
    });
  };

  this.recuperarSenhaProfessor = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('SELECT * FROM tb_professores WHERE rp LIKE "' + todo.rp + '" and email LIKE "' + todo.email + '" and mac_address LIKE "' + todo.mac + '"', todo, function (err, result) {
        con.release();
        if (err) {
          res.send(result);
        } else {
          //Enviar ao email do professor seus dados de acesso.
          res.send(result);
        }
      });
    });
  };

  this.cadastrarDadosProfessor = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('insert into tb_professores set ?', todo, function (err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: false});
        } else {
          res.send({status: 0, message: true});
        }
      });
    });
  };

  this.cadastrarUsuarioProfessor = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('insert into tb_usuarios (rp, senha_usuario, tipo_de_usuario, situacao_do_usuario) VALUES ("' + todo.rp + '","' + todo.senha_usuario + '","' + todo.tipo_de_usuario + '","' + todo.situacao_do_usuario + '")', todo, function (err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: false});
        } else {
          res.send({status: 0, message: true});
        }
      });
    });
  };

  this.abrirChamada = function (todo, res) {
    console.log(todo);
    connection.acquire(function (err, con) {
      con.query('INSERT INTO  tb_diario (id, rp, codigo_disciplina, horario_inicio, horario_fim, situacao, latitude_professor, longitude_professor)' +
      ' VALUES ("' + null  + '","' + todo.rp + '","' + todo.disciplina + '","' + todo.horario_inicio + '","' + todo.horario_fim + '","' + todo.situacao + '","' + todo.latitude + '","' + todo.longitude + '")', todo, function (err, result) {
        con.release();

        if (err) {
          res.send({status: 1, message: 'TODO creation failed'});
        } else {
          //Retorna o id da linha na tabela
          res.send({"return":[{"id":result.insertId.toString()}]});
        }
      });
    });
  };

  this.fecharChamada = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('update tb_diario set ? where id = ?', [todo, todo.id], function (err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'TODO update failed'});
        } else {
          res.send({status: 0, message: 'TODO updated successfully'});
        }
      });
    });
  };

  this.obterChamadaAberta = function(todo, res){
    console.log(todo);
    connection.acquire(function (err, con) {
      con.query('SELECT tp.nome as nome_professor, tp.email as email_professor, tp.mac_address as mac_address_professor, tp.rp, tp.telefone, td.codigo as codigo_disciplina, td.nome as nome_disciplina, td.descricao as descricao_disciplina, tdia.id as id_diario, tdia.latitude_professor, tdia.longitude_professor, tdia.situacao, tdia.horario_inicio, tdia.horario_fim FROM tb_alunos AS ta JOIN tb_alunos_disciplinas AS tad ON ta.ra = tad.codigo_ra JOIN tb_disciplinas AS td ON tad.codigo_disciplina = td.codigo JOIN tb_professores_disciplinas AS tpd ON td.codigo = tpd.codigo_disciplina JOIN tb_professores AS tp ON tpd.codigo_rp = tp.rp JOIN tb_diario AS tdia ON tp.rp = tdia.rp WHERE tad.codigo_disciplina = tpd.codigo_disciplina AND tdia.situacao =1 AND tdia.horario_fim >= NOW( ) AND ta.ra =  ? GROUP BY tdia.codigo_disciplina', todo.ra, function (err, result) {
        con.release();
        if (err) {
          res.send({ "message":null});
        } else {
          if(result == ""){
            res.send({"message":null});
          }else{
            res.send({"message": result, "status":[{"status":"1"}]});
          }
        }
      });
    });
  };

  this.autenticarPresenca = function (todo, res) {
    connection.acquire(function (err, con) {
      //Concluir - Inserir os valores aos campos
      con.query('insert into tb_lista_frequencia (codigo_ra, codigo_rp, codigo_disciplina, id_diario, data) VALUES ("' + todo.rp + '","' + todo.senha_usuario + '","' + todo.tipo_de_usuario + '","' + todo.situacao_do_usuario + '")', todo, function (err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: false});
        } else {
          res.send({status: 0, message: true});
        }
      });
    });
  };
}

module.exports = new Todo();
