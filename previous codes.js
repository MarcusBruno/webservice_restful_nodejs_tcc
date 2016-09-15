//Abrir Chamada
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
//==============
//Fechar chamada
//Enviar email a todos os alunos confirmando o fechamento da chamada e a sua presença
//Query que busca os emails dos alunos de uma disciplina.
/*con.query('select ta.email from tb_alunos_disciplinas as tad join tb_alunos ta on tad.codigo_ra = ta.ra  WHERE codigo_disciplina LIKE "' + todo.disciplina + '"', function (err, result2) {

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
});*/
//Enviar relatório da lista de chamada no email do professor.
//==============
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
//==============
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

    //===========================



            /*connection.acquire(function (err, con) {

                con.query('insert into tb_lista_frequencia (tb_lista_freq_codigo_ra, tb_lista_freq_codigo_rp, tb_lista_freq_codigo_disciplina, tb_lista_freq_id_diario, tb_lista_freq_data_hora, tb_lista_freq_latitude_aluno, tb_lista_freq_longitude_aluno, tb_lista_freq_presenca) VALUES ("' + todo.tb_lista_freq_codigo_ra + '","' + todo.tb_lista_freq_codigo_rp + '","' + todo.tb_lista_freq_codigo_disciplina + '","' + todo.tb_lista_freq_id_diario  + '","' + dateTime + '","' + todo.tb_lista_freq_latitude_aluno + '","' + todo.tb_lista_freq_longitude_aluno + '","'+ todo.tb_lista_freq_presenca+'")', todo, function (err, result) {
                con.release();
                if (err) {
                  res.send({status: 0, message: false});
                      } else {
                  res.send({"message": true, "status":"1"});
                }
              });
            });*/
}
