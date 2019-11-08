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
    private String parecer;
    private boolean deferido;

}