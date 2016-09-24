var connection = require('../connection');
var nodemailer = require("nodemailer");
var momentTimezone = require('moment-timezone');
var moment = require('moment');
var smtpTransport = require("nodemailer-smtp-transport");
var smtpTransport = nodemailer.createTransport(smtpTransport({
  host: "smtp.gmail.com",
  secureConnection: false,
  port: 587,
  auth: {
    user: "marcusbrunogm@gmail.com",
    pass: "13MB96gm12!"
  }
}));

function Todo() {
  //Professor: Função que retorna as disciplinas de um professor
  this.getDisciplinasProfessor = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('select td.* from tb_professores_disciplinas as tpd join tb_disciplinas as td on tpd.codigo_disciplina = td.codigo where tpd.codigo_rp = '+todo.rp+'', function (err, result) {
        con.release();
        res.send(result);
      });
    });
  };
  //Aluno: Funcão que retorna as disciplinas de um aluno
  this.getDisciplinasAluno = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('select td.* from tb_alunos_disciplinas as tad join tb_disciplinas as td on tad.codigo_disciplina = td.codigo where tad.codigo_ra = '+todo.ra+'', function (err, result) {
        con.release();
        res.send(result);

      });
    });
  };
  //Professor: Função que retorna os alunos de uma disciplina
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
        con.query('select * from tb_alunos where tb_alu_ra in (' + listaAlunos + ')', function (err, result2) {
          res.send(result2);
        });
      });
    });
  };
  //Professor: Função que valida o acesso de um usuário professor.
  this.loginProfessor = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query('SELECT p.* FROM tb_usuarios AS u JOIN tb_professores AS p ON u.tb_usu_rp = p.tb_prof_rp WHERE u.tb_usu_rp LIKE '+todo.rp+' AND u.tb_usu_senha LIKE '+todo.senha+'', todo, function (err, result) {
        con.release();
        if (err || result == "") {
          res.send({"message": null, "status":[{"status":"0"}]});
        } else {
          res.send({"message": result, "status":[{"status":"1"}]});
        }
      });
    });
  };
  //Aluno: Função que valida o acesso de um usuário aluno.
  this.loginAluno = function (todo, res) {
    console.log("Entrada: "+ todo.ra +" - "+todo.senha +" - "+todo.mac_address);
    connection.acquire(function (err, con) {
      con.query('SELECT a.* FROM tb_usuarios AS u JOIN tb_alunos AS a ON u.tb_usu_ra = a.tb_alu_ra WHERE u.tb_usu_ra LIKE ? AND u.tb_usu_senha LIKE ?  AND u.tb_usu_tipo = "Aluno"', [todo.ra, todo.senha], function (err, result) {
        con.release();
        console.log(result);
        if (err || result == "") {
          res.send({"message": false, "status":"0"});
        } else {
          console.log(result[0].tb_alu_mac_address +" - "+ todo.mac_address);
          if(result[0].tb_alu_mac_address.toString() === todo.mac_address.toString()){
            console.log("Entrou");
            res.send({"message": result, "status":"1"});
          }else{
            console.log("Falha");
            res.send({"message": false, "status":"-1"});
          }
        }
      });
    });
  };
  //Professor: Função de recuperação de senha. Função que envia o código de segurança ao email do professor.
  this.recuperarSenhaProfessor = function (todo, res) {
    var code = makeid().toUpperCase();
    connection.acquire(function (err, con) {
      con.query('UPDATE tb_usuarios SET  tb_usu_recuperar_senha="'+code+'" WHERE tb_usu_rp = ?', todo.rp, function (err, result) {
        con.release();
        if (err) {
          res.send({"status":"-1"});
        } else {
          //Get email do professor.
          con.query('SELECT tb_prof_email FROM tb_professores WHERE tb_prof_rp = ?', todo.rp, function (err2, result2) {

            if (err2) {
              result2.send({"status":"-1"});
            } else {
              //Enviar ao email do professor seus dados de acesso.
              var retorno = enviarEmailRecuperacaoSenha(result2[0].tb_prof_email, code);
              res.send({"message":code, "status":"1"});
            }
          });
        }
      });
    });
  };
  //Aluno: Função de recuperação de senha para os alunos. Função que envia o código de segurança ao email do professor.
  this.recuperarSenhaAluno = function (todo, res) {
    var code = makeid().toUpperCase();
    connection.acquire(function (err, con) {
      con.query('UPDATE tb_usuarios SET  tb_usu_recuperar_senha="'+code+'" WHERE tb_usu_ra = ?', todo.ra, function (err, result) {
        con.release();
        if (err) {
          res.send({"status":"-1"});
        } else {
          //Get email do professor.
          con.query('SELECT tb_prof_email FROM tb_professores WHERE tb_prof_ra = ?', todo.ra, function (err2, result2) {

            if (err2) {
              result2.send({"status":"-1"});
            } else {
              //Enviar ao email do professor seus dados de acesso.
              var retorno = enviarEmailRecuperacaoSenha(result2[0].tb_prof_email, code);
              res.send({"message":code, "status":"1"});
            }
          });
        }
      });
    });
  };
  //Aluno:Cadastro do professor que utilizará o sistema.
  this.cadastrarProfessor = function (todo, res) {
    console.log(todo);

    connection.acquire(function (err, con) {
      con.query('insert into tb_usuarios (tb_usu_rp, tb_usu_senha, tb_usu_tipo, tb_usu_situacao, tb_usu_ultimo_acesso) VALUES (?,?,?,?,?);', [todo.tb_usu_rp, todo.tb_usu_senha, todo.tb_usu_tipo, todo.tb_usu_situacao, todo.tb_usu_ultimo_acesso], function (err, result) {
        con.release();
        if(!err){
          console.log("Cadastrou Usuário");

          con.query('insert into tb_professores (tb_prof_rp, tb_prof_nome, tb_prof_telefone, tb_prof_email, tb_prof_mac_address) VALUES (?,?,?,?,?)', [todo.tb_prof_rp, todo.tb_prof_nome, todo.tb_prof_telefone, todo.tb_prof_email, todo.tb_prof_mac_address], function (err2, result2) {
            if (err2) {
              console.log("Falhou");
              con.query('DELETE FROM tb_usuarios WHERE tb_usu_id = ? ', result.insertId.toString(), function (err3, result3) {
                if(!err3){
                  console.log("Operação desfeita com sucesso! R.P.:"+todo.tb_prof_rp);
                  res.send({"status":"0", "message": false});
                }else{
                  console.log("FALHA GRAVE: Operação que busca desfazer o cadastro do Professor "+ todo.tb_prof_rp+" falhou!");
                  res.send({"status":"-1", "message": false});
                }
              });
            } else {
              console.log("SUCESSO: CADASTROU PROFESSOR COM ID:" +result.insertId.toString());
              res.send({"message": true, "status":"1"});
            }
          });
        }else{
          console.log("FALHA: Não foi possivel cadastrar o professor");
          res.send({"message": false, "status":"-0"});
        }
      });
    });
  };
  //Aluno: Cadastro de alunos que utilizarão o sistema.s
  this.cadastrarAluno = function (todo, res) {
    console.log(todo);
    connection.acquire(function (err, con) {
      con.query('insert into tb_usuarios (tb_usu_ra, tb_usu_senha, tb_usu_tipo, tb_usu_situacao, tb_usu_ultimo_acesso) VALUES (?,?,?,?,?);', [todo.tb_usu_ra, todo.tb_usu_senha, todo.tb_usu_tipo, todo.tb_usu_situacao, todo.tb_usu_ultimo_acesso], function (err, result) {
        con.release();
        if(!err){
          console.log("Cadastrou Usuário");

          con.query('insert into tb_alunos (tb_alu_ra, tb_alu_nome, tb_alu_telefone, tb_alu_email, tb_alu_mac_address) VALUES (?,?,?,?,?)', [todo.tb_alu_ra, todo.tb_alu_nome, todo.tb_alu_telefone, todo.tb_alu_email, todo.tb_alu_mac_address], function (err2, result2) {
            if (err2) {
              console.log("Falhou");
              con.query('DELETE FROM tb_usuarios WHERE tb_usu_id = ? ', result.insertId.toString(), function (err3, result3) {
                if(!err3){
                  console.log("Operação desfeita com sucesso! R.A.:"+todo.tb_alu_ra);
                  res.send({"status":"0", "message": false});
                }else{
                  console.log("Falha na operação ! Cadastro de usuário sem aluno atrelado! R.A.:"+todo.tb_alu_ra);
                  res.send({"status":"-1", "message": false});
                }
              });
            } else {
              console.log("Cadastrou Aluno");
              res.send({"message": true, "status":"1"});
            }
          });
        }else{
          console.log("Falhou no cadastro do aluno");
          res.send({"message": false, "status":"-0"});
        }
      });
    });
  };
  //Professor: Função que abre a chamada de uma disciplina
  this.abrirChamada = function (todo, res) {
    console.log(todo);

    var dateTimeAbertura = toTimeZone(new Date(), 'America/Campo_Grande');
    var fechamento = new Date(dateTimeAbertura);
    fechamento.setMinutes(fechamento.getMinutes() + 10);
    var dateTimeFechamento = toTimeZone(fechamento, 'America/Campo_Grande')

    connection.acquire(function (err, con) {
      con.query('INSERT INTO  tb_diario (id, rp, codigo_disciplina, horario_inicio, horario_fim, situacao, latitude_professor, longitude_professor)' +
      ' VALUES ("' + null  + '","' + todo.rp + '","' + todo.disciplina + '","' +dateTimeAbertura+ '","' + dateTimeFechamento+ '","' + todo.situacao + '","' + todo.latitude + '","' + todo.longitude + '")', todo, function (err, result) {
        con.release();

        if (err) {
          res.send({"return":[{"id":"0"}]});
        } else {
          //Retorna o id da linha na tabela
          res.send({"return":[{"id":result.insertId.toString()}]});
        }
      });
    });
  };
  //Professor: Função que realiza o fechamento de uma chamada.
  this.fecharChamada = function (todo, res) {
    console.log(todo);
    var dateTimeFechamento = toTimeZone(new Date(), 'America/Campo_Grande');
    connection.acquire(function (err, con) {
      con.query('update tb_diario set situacao='+todo.situacao+', horario_fim="'+dateTimeFechamento+'" where id = "'+todo.id+'"', function (err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'TODO update failed'});
        } else {
          res.send({status: 0, message: 'TODO updated successfully'});
        }
      });
    });
  };
  //Aluno: Obtem a chamada aberta.
  this.obterChamadaAberta = function(todo, res){
    console.log(todo);
    connection.acquire(function (err, con) {
      con.query('SELECT tp.	tb_prof_nome as nome_professor, tp.tb_prof_rp,  td.codigo as codigo_disciplina, td.nome as nome_disciplina, tdia.id as id_diario, tdia.latitude_professor, tdia.longitude_professor FROM tb_alunos AS ta JOIN tb_alunos_disciplinas AS tad ON ta.tb_alu_ra = tad.codigo_ra JOIN tb_disciplinas AS td ON tad.codigo_disciplina = td.codigo JOIN tb_professores_disciplinas AS tpd ON td.codigo = tpd.codigo_disciplina JOIN tb_professores AS tp ON tpd.codigo_rp = tp.tb_prof_rp JOIN tb_diario AS tdia ON tp.tb_prof_rp = tdia.rp WHERE tad.codigo_disciplina = tpd.codigo_disciplina AND tdia.situacao =1 AND tdia.horario_inicio <= NOW( ) AND tdia.horario_fim >= NOW( ) AND ta.tb_alu_ra =  ? GROUP BY tdia.codigo_disciplina', todo.ra, function (err, result) {
        con.release();
        if (err) {
          res.send({ "message":null, "status":"0"});
        } else {
          if(result == ""){
            res.send({"message":null, "status":"0"});
          }else{
            console.log(result);
            res.send({"message": result, "status":"1"});
          }
        }
      });
    });
  };
  //Aluno: Autentica a presença.
  this.autenticarPresenca = function (todo, res) {
    console.log(todo);
    var dateTime = toTimeZone(new Date(), 'America/Campo_Grande');
    connection.acquire(function (err, con) {
      con.query('SELECT td.horario_inicio, td.horario_fim FROM tb_diario as td WHERE td.id = "'+todo.tb_lista_freq_id_diario+'" ', todo, function (err, result) {
        con.release();
        if(!err){
          if(toTimeZone(new Date(dateTime), 'America/Campo_Grande') >= toTimeZone(new Date(result[0].horario_inicio), 'America/Campo_Grande') && toTimeZone(new Date(dateTime), 'America/Campo_Grande') <= toTimeZone(new Date(result[0].horario_fim), 'America/Campo_Grande')){
            console.log("entrou");
            con.query('insert into tb_lista_frequencia (tb_lista_freq_codigo_ra, tb_lista_freq_codigo_rp, tb_lista_freq_codigo_disciplina, tb_lista_freq_id_diario, tb_lista_freq_data_hora, tb_lista_freq_latitude_aluno, tb_lista_freq_longitude_aluno, tb_lista_freq_presenca) VALUES ("' + todo.tb_lista_freq_codigo_ra + '","' + todo.tb_lista_freq_codigo_rp + '","' + todo.tb_lista_freq_codigo_disciplina + '","' + todo.tb_lista_freq_id_diario  + '","' + dateTime + '","' + todo.tb_lista_freq_latitude_aluno + '","' + todo.tb_lista_freq_longitude_aluno + '","'+ todo.tb_lista_freq_presenca+'")', todo, function (err, result) {
              if (err) {
                console.log("FALHA: O Aluno "+ todo.tb_lista_freq_codigo_ra + " não conseguiu autenticar sua presença na chamada " +todo.tb_lista_freq_id_diario+ ", do professor " +todo.tb_lista_freq_codigo_rp);
                res.send({"status":"0", "message": false});
              } else {
                console.log("SUCESSO: O Aluno "+ todo.tb_lista_freq_codigo_ra + " autenticou sua presença na chamada " +todo.tb_lista_freq_id_diario+ ", do professor " +todo.tb_lista_freq_codigo_rp);
                res.send({"message": true, "status":"1"});
              }
            });
          }else{
            console.log("não entrou");
            res.send({"status": "-1", "message": false});
          }
        }
      });
    });
  };
  //Professor: Adiciona as faltas e presenças aos alunos que sobraram na lista de chamda.
  this.autenticarPresencaManual = function (todo, res) {
    console.log(todo);
    var dateTime = toTimeZone(new Date(), 'America/Campo_Grande');
    connection.acquire(function (err, con) {

      con.query('insert into tb_lista_frequencia (tb_lista_freq_codigo_ra, tb_lista_freq_codigo_rp, tb_lista_freq_codigo_disciplina, tb_lista_freq_id_diario, tb_lista_freq_data_hora, tb_lista_freq_latitude_aluno, tb_lista_freq_longitude_aluno, tb_lista_freq_presenca) VALUES ("' + todo.tb_lista_freq_codigo_ra + '","' + todo.tb_lista_freq_codigo_rp + '","' + todo.tb_lista_freq_codigo_disciplina + '","' + todo.tb_lista_freq_id_diario  + '","' + dateTime + '","' + todo.tb_lista_freq_latitude_aluno + '","' + todo.tb_lista_freq_longitude_aluno + '","'+ todo.tb_lista_freq_presenca+'")', todo, function (errQuery, result) {
        con.release();
        if (errQuery) {
          res.send({"status":"0", "message": false});
        } else {
          res.send({"message": todo.tb_lista_freq_codigo_ra, "status":"1"});
        }
      });
    });
  };
  //Professor: Verifica se o professor não deixou nenhuma chamada aberta.
  this.checarChamadasAbertas = function(todo, res){
    console.log(todo);
    connection.acquire(function (err, con) {
      con.query('SELECT td.id, td.rp, td.codigo_disciplina, td.horario_inicio as timestamp, tp.tb_prof_nome as professor, tds.nome as disciplina FROM tb_diario as td join tb_professores as tp on td.rp = tp.tb_prof_rp JOIN tb_disciplinas as tds on td.codigo_disciplina = tds.codigo WHERE td.situacao = "1" AND td.rp = ? ', todo.rp, function (err, result) {
        con.release();
        if (err) {
          res.send({ "message":null, "status":"0"});
        } else {
          if(result == ""){
            res.send({"message":null, "status":"0"});
          }else{
            console.log(result);
            res.send({"message": result, "status":"1"});
          }
        }
      });
    });
  };
  //Professor: Função ouve as autenticações realizadas e retorna os alunos presentes para serem retirados da lista.
  this.buscarAutenticaoRealizadas = function(todo, res){
    console.log(todo);
    connection.acquire(function (err, con) {
      var param ="\"\"";
      arrParam = todo.alunos.split(",");

      for(var i=0; i< arrParam.length; i++){
        if(!(param == "\"\"")){
          param += ",\""+arrParam[i]+"\"";
        }else{
          param += "\""+arrParam[i]+"\"";
        }
      }

      con.query('SELECT t.tb_lista_freq_codigo_ra FROM tb_lista_frequencia as t WHERE t.tb_lista_freq_codigo_ra NOT IN ('+param+') AND t.tb_lista_freq_id_diario = "'+todo.diario+'" ', function (err, result) {
        con.release();
        if (err) {
          res.send({ "message":null});
        } else {
          res.send(result);
        }
      });
    });
  };
  //Aluno: Função que retorna as presenças e faltas de um aluno em uma determinada disciplina.
  this.buscarListaFrequenciaAluno = function(todo, res){
    console.log(todo);
    connection.acquire(function (err, con) {
      con.query('SELECT tlf.tb_lista_freq_data_hora, tlf.tb_lista_freq_presenca FROM tb_lista_frequencia as tlf WHERE tlf.tb_lista_freq_codigo_disciplina = ? AND tlf.tb_lista_freq_codigo_ra = ? ORDER BY tlf.tb_lista_freq_data_hora', [todo.disciplina, todo.ra], function (err, result) {
        con.release();
        if (err) {
          res.send({ "message":null, "status":"0"});
        } else {
          if(result == ""){
            res.send({"message":null, "status":"0"});
          }else{
            console.log(result);
            res.send({"message": result, "status":"1"});
          }
        }
      });
    });
  };
  //Professor: Inserir nova senha
  this.inserirNovaSenhaProfessor = function (todo, res) {
    console.log(todo);
    connection.acquire(function (err, con) {
      con.query('update tb_usuarios set	tb_usu_senha= ? where 	tb_usu_rp = ?',[todo.senha,todo.rp], function (err, result) {
        con.release();
        if (err) {
          res.send({status: 0, message: 'TODO update failed'});
        } else {
          res.send({status: 1, message: 'TODO updated successfully'});
        }
      });
    });
  };
  //Aluno: Inserir nova senha
  this.inserirNovaSenhaAluno = function (todo, res) {
    console.log(todo);
    connection.acquire(function (err, con) {
      con.query('SELECT a.tb_alu_mac_address FROM tb_usuarios AS u JOIN tb_alunos AS a ON u.tb_usu_ra = a.tb_alu_ra WHERE u.tb_usu_ra = ? AND u.tb_usu_tipo = "Aluno"', todo.ra, function (err, result) {
        con.release();
        console.log(result);
        if (err || result == "") {
          res.send({"message": false, "status":"0"});
        } else {
          console.log(result[0].tb_alu_mac_address +" - "+ todo.mac_address);
          if(result[0].tb_alu_mac_address.toString() === todo.mac_address.toString()){
            console.log("Entrou");
            con.query('update tb_usuarios set	tb_usu_senha= ? where 	tb_usu_rp = ?',[todo.senha,todo.ra], function (err, result) {

              if (err) {
                res.send({status: 0, message: 'TODO update failed'});
              } else {
                res.send({status: 1, message: 'TODO updated successfully'});
              }
            });

          }else{
            console.log("Falha");
            res.send({"message": false, "status":"-1"});
          }
        }
      });
    });
  };
  //Função utilizadado para gerar um código, para a recuperação de senha
  function makeid(){ //http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  //Função que envia um email ao usuário que esqueceu a senha
  function enviarEmailRecuperacaoSenha(email, code) {
    var mailOptions = {
      from: "marcusbrunogm@gmail.com",
      to: email,
      subject: "IFMS - Recuperação de Senha",
      text: "Para recuperar sua senha digite este código de segurança: "+code,

    }
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {

        return false;
      } else {

        return true;
      }
    });
  }
  //Retorna data formatada e Timezone setado.
  function toTimeZone(time, zone) {
    var format = 'YYYY-MM-DD HH:mm:ss';
    return moment(time, format).tz(zone).format(format);
  }
}
module.exports = new Todo();
