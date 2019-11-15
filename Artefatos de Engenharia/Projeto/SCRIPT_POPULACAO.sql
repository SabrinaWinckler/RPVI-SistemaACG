INSERT INTO curriculo (curriculo.id_curriculo, curriculo.ano, curriculo.status)
VALUES(1, 2018, 1), (2, 2010, 1);

INSERT INTO grupo(grupo.id_grupo, grupo.nome, grupo.curriculo_id_curriculo)
VALUES(1, "Pesquisa", 1), (2, "Extensão", 1), (3, "Ensino", 1), (4, "Culturais", 1), (5, "ADES", 2);

INSERT INTO atividade(atividade.id_atividade, atividade.ch, atividade.descricao, atividade.detalhamento, atividade.precisa_calcular, atividade.grupo_id_grupo)
VALUES(1, 1, "Evento_Pesquisa", "detalhamento_1", 0, 1), (2, 2, "Extensão_Amanda","detalhamento_2", 0, 1), (3, 2, "Aquela PESQUISAAAAA", "detalhamento_3", 1, 1), (4, 3, "Ensinar os amigos", "detalhamento_4", 1, 3), (5, 1, "ADES", "detalhamento_5", 0, 5);

INSERT INTO docs_necessarios(docs_necessarios.id_doc_necessario, docs_necessarios.nome)
VALUES(1, "Comprovante de Evento"), (2, "Comprovante de extensão"), (3, "Comprovante de participação em pesquisa"), (4, "Comprovante de ensino"), (5, "PROVA_ADES_DOCS_NECESSÁRIOS");

INSERT INTO atividade_has_doc(atividade_has_doc.id_atividade, atividade_has_doc.id_doc_necessario)
VALUES(1, 1), (1,2), (2,1), (3,2), (3,3), (3,4), (4,1), (4,3), (5,5);

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO solicitacao(solicitacao.id_solicitacao, solicitacao.carga_horaria_soli, solicitacao.data_atual, solicitacao.data_fim, solicitacao.data_inicio, solicitacao.descricao, solicitacao.local, solicitacao.matricula, solicitacao.nome_aluno, solicitacao.prof_res, solicitacao.status, solicitacao.atividade_id_atividade)
VALUES (1, 200, "2019-12-3", "2019-12-4", "2012-12-3", "SIEPE", "Santana do Livramento", 1701570595, "Matheus M", "Bernadino", "Pendente", 1), (2, 50, "2019-12-1", "2019-12-4", "2012-12-2", "ERAD", "Santa Maria", 1701570595, "Matheus M", "AFLorenzon", "Pendente", 1), (3, 10, "2019-10-3", "2019-9-4", "2012-12-3", "VLSI", "Cusco, Peru", 1701570595, "Matheus M", "Nulo :D", "Deferido", 2);

INSERT INTO avaliacao_solicitacao(avaliacao_solicitacao.id_avaliacao, avaliacao_solicitacao.carga_horaria_atribuida, avaliacao_solicitacao.data_avaliacao, avaliacao_solicitacao.justificativa, avaliacao_solicitacao.id_solicitacao)
VALUES(1, 20, "2020-1-06",  "Foi deferida por que sim!", 3);

INSERT INTO anexo (anexo.id_anexo, anexo.nome, anexo.doc_id_doc_necessario, anexo.solicitacao_id_solicitacao)
VALUES(1, "MatheusM_20437_05532504.pdf", 1, 3), (2, "MatheusM_21187_2019-09-09.png", 2, 3);
