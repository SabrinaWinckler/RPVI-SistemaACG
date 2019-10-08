package com.unipampa.sistemaacg.repository;

import java.util.HashMap;

import com.unipampa.sistemaacg.models.Atividade;
import com.unipampa.sistemaacg.models.Curriculo;
import com.unipampa.sistemaacg.models.Grupo;
import com.unipampa.sistemaacg.models.Solicitacao;

import org.springframework.data.repository.CrudRepository;

/**
 * SolicitacaoRepository
 */
public interface SolicitacaoRepository extends CrudRepository<Solicitacao,Long>{

    //Iterable<Solicitacao> getAll();
    //Solicitacao findByAluno(String aluno);
}