package com.unipampa.sistemaacg.dto;

import com.unipampa.sistemaacg.models.Solicitacao;

import lombok.Data;

/**
 * AvaliacaoDTO
 */
@Data
public class AvaliacaoDTO {

	private long cargaHorariaAtribuida;
    private long idSolicitacao;
    private long idAtividade;
    private String parecer;
    private boolean deferido;

}