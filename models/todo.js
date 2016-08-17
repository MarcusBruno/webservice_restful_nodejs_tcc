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
            //select td.codigo, td.nome, td.descricao from tb_professores_disciplinas as tpd join tb_disciplinas as td on tpd.codigo_disciplina = td.codigo where tpd.codigo_rp = ?'
            con.query('select td.* from tb_professores_disciplinas as tpd join tb_disciplinas as td on tpd.codigo_disciplina = td.codigo where tpd.codigo_rp = '+todo.rp+'', function (err, result) {
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
                  console.log(result);
                    res.send({"message": null, "status":[{"status":"0"}]});
                } else {
                    console.log(result);
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
        var idInsert = "";
        emails = "";
        emailProfessor="";
        connection.acquire(function (err, con) {
            con.query('INSERT INTO  tb_diario (id, rp, codigo_disciplina, horario_inicio, situacao, latitude_professor, longitude_professor)' +
                ' VALUES ("' + null  + '","' + todo.rp + '","' + todo.disciplina + '","' + todo.horario_inicio + '","' + todo.situacao + '","' + todo.latitude + '","' + todo.longitude + '")', todo, function (err, result) {
                con.release();

                if (err) {
                  console.log("1");
                   res.send({status: 1, message: 'TODO creation failed'});
                } else {
                    console.log({id:result.insertId.toString()});
                   //Retorna o id da linha na tabela
                   res.send({"return":[{"id":result.insertId.toString()}]});
                }
            });
        });
    };

    this.fecharChamada = function (todo, res) {
        emails = "";
        emailProfessor="";
        console.log(todo);
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

    this.autenticarPresenca = function (todo, res) {
        console.log(todo);
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

    this.create = function (todo, res) {
        connection.acquire(function (err, con) {
            con.query('insert into todo_list set ?', todo, function (err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'TODO creation failed'});
                } else {
                    res.send({status: 0, message: 'TODO created successfully'});
                }
            });
        });
    };
    this.update = function (todo, res) {
        connection.acquire(function (err, con) {
            con.query('update todo_list set ? where id = ?', [todo, todo.id], function (err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'TODO update failed'});
                } else {
                    res.send({status: 0, message: 'TODO updated successfully'});
                }
            });
        });
    };
    this.delete = function (id, res) {
        connection.acquire(function (err, con) {
            con.query('delete from todo_list where id = ?', [id], function (err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'Failed to delete'});
                } else {
                    res.send({status: 0, message: 'Deleted successfully'});
                }
            });
        });
    };
}

module.exports = new Todo();
