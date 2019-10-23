package com.unipampa.sistemaacg.models;

import javax.persistence.ManyToOne;

import lombok.Data;

/**
 * Anexo
 */
@Data
public class Anexo {

    @ManyToOne
    private Solicitacao solicitacao;

}