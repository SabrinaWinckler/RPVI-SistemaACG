INSERT INTO curriculo (curriculo.id_curriculo, curriculo.ano, curriculo.status)
VALUES(1, 2019, 1), (2, 2010, 2);

INSERT INTO grupo(grupo.id_grupo, grupo.nome, grupo.curriculo_id_curriculo)
VALUES(1, "Pesquisa", 1), (2, "Extensão", 1), (3, "Ensino", 1), (4, "Culturais", 1), (5, "ADES", 2);

INSERT INTO atividade(atividade.id_atividade, atividade.descricao, atividade.detalhamento, atividade.grupo_id_grupo)
VALUES(1, "Evento_Pesquisa", "detalhamento_1", 1), (2, "Extensão_Amanda","detalhamento_2", 2), (3, "Aquela PESQUISAAAAA", "detalhamento_3", 1), (4, "Ensinar os amigos", "detalhamento_4", 3), (5, "ADES", "detalhamento_5", 5);

INSERT INTO docs_necessarios(docs_necessarios.id_doc_necessario, docs_necessarios.nome)
VALUES(1, "Comprovante de Evento"), (2, "Comprovante de extensão"), (3, "Comprovante de participação em pesquisa"), (4, "Comprovante de ensino"), (5, "PROVA_ADES_DOCS_NECESSÁRIOS");


INSERT INTO atividade_has_doc(atividade_has_doc.id_atividade, atividade_has_doc.id_doc_necessario)
VALUES(1, 1), (2,2), (3,3), (4,4), (5,5);
