var connection = require('../connection');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var smtpTransport = nodemailer.createTransport(smtpTransport({
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "marcusbrunogm@gmail.com",
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

    this.getDisciplinasProfessor = function (id, res) {
        connection.acquire(function (err, con) {
            //select td.codigo, td.nome, td.descricao from tb_professores_disciplinas as tpd join tb_disciplinas as td on tpd.codigo_disciplina = td.codigo where tpd.codigo_rp = ?'
            con.query('select td.codigo, td.nome, td.descricao from tb_professores_disciplinas as tpd join tb_disciplinas as td on tpd.codigo_disciplina = td.codigo where tpd.codigo_rp = ?', [id], function (err, result) {
                con.release();
                res.send(result);
            });
        });
    };

    this.getAlunosDaDisciplina = function (id, res) {
        var listaAlunos = "";
        connection.acquire(function (err, con) {
            //Query que busca os alunos de uma disciplina. (Retorno: RA)
            con.query('select codigo_ra from tb_alunos_disciplinas where codigo_disciplina = ?', [id], function (err, result) {
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
        console.log(todo);
        console.log(todo.rp);
        console.log(todo.senha);
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
        console.log(todo);
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
        console.log(todo);
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
        console.log(todo.rp);
        console.log(todo.disciplina);
        console.log(todo.horario_inicio);
        console.log(todo.horario_termino);
        console.log(todo.data);
        console.log(todo.situacao);
        console.log(todo.latitude);
        console.log(todo.longitude);
        var idInsert = "";
        emails = "";
        emailProfessor="";
        connection.acquire(function (err, con) {
            con.query('insert into tb_diario (rp, disciplina, horario_inicio, horario_termino, data, situacao, latitude_professor, longitude_professor)' +
                ' VALUES ("' + todo.rp + '","' + todo.disciplina + '","' + todo.horario_inicio + '","' + todo.horario_termino + '","' + todo.data + '","' + todo.situacao + '","' + todo.latitude + '","' + todo.longitude + '")', todo, function (err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'TODO creation failed'});
                } else {
                    idInsert = result.insertId.toString();

                    //Query que busca os emails dos alunos de uma disciplina.
                    con.query('select ta.email from tb_alunos_disciplinas as tad join tb_alunos ta on tad.codigo_ra = ta.ra  WHERE codigo_disciplina LIKE "' + todo.disciplina + '"', function (err, result2) {

                        for (i = 0; i < result2.length; i++) {
                            if ((i + 1) == result2.length) {
                                var email = '' + result2[i]["email"] + '';
                                emails = emails + email;
                            } else {
                                var email = '' + result2[i]["email"] +',';
                                emails = emails + email;
                            }
                        }

                        //Query que busca os emails dos alunos de uma disciplina.
                        con.query('select email from tb_professores  WHERE rp LIKE "' + todo.rp + '"', function (err, result3) {
                            emailProfessor = result3["email"];
                            console.log(result3[0]["email"]);

                            //Enviar email a todos os alunos da disciplina que a chamada está aberta.
                            enviarEmailAosAlunosAberturaChamada(result3[0]["email"], emails);

                        });
                    });
                   //Retorna o id da linha na tabela
                   res.send({id:result.insertId.toString()});
                }
            });
        });
    };
    // Exemplo: { id: '14', situacao: '0' }
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

                    //Enviar email a todos os alunos confirmando o fechamento da chamada e a sua presença
                    //Query que busca os emails dos alunos de uma disciplina.
                    con.query('select ta.email from tb_alunos_disciplinas as tad join tb_alunos ta on tad.codigo_ra = ta.ra  WHERE codigo_disciplina LIKE "' + todo.disciplina + '"', function (err, result2) {

                        for (i = 0; i < result2.length; i++) {
                            if ((i + 1) == result2.length) {
                                var email = '' + result2[i]["email"] + '';
                                emails = emails + email;
                            } else {
                                var email = '' + result2[i]["email"] +',';
                                emails = emails + email;
                            }
                        }
                        //Query que busca os emails dos alunos de uma disciplina.
                        con.query('select email from tb_professores  WHERE rp LIKE "' + todo.rp + '"', function (err, result3) {
                            emailProfessor = result3["email"];
                            console.log(result3[0]["email"]);
                            //Enviar email a todos os alunos da disciplina que a chamada está aberta.
                            enviarEmailAosAlunosEncerramentoChamada(result3[0]["email"], emails);
                        });
                    });
                    //Enviar relatório da lista de chamada no email do professor.
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

function enviarEmailAosAlunosAberturaChamada(emailProfessor, emails) {
    var mailOptions = {
        from: emailProfessor,
        to: emails,
        subject: "IFMS - Chamada está aberta",
        text: "O professor da disciplina abriu a chamada! Você tem 10 minutos para confirmar sua presença.",

    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);

        } else {
            console.log(response.response.toString());
            console.log("Message sent: " + response.message);
        }
    });
}

function enviarEmailAosAlunosEncerramentoChamada(emailProfessor, emails) {
    var mailOptions = {
        from: emailProfessor,
        to: emails,
        subject: "IFMS - Chamada está aberta",
        text: "O professor da disciplina encerrou a chamada!",

    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);

        } else {
            console.log(response.response.toString());
            console.log("Message sent: " + response.message);
        }
    });
}
module.exports = new Todo();
