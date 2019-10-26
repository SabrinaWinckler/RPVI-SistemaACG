package com.unipampa.sistemaacg.dto;

import lombok.Data;

/**
 * AvaliacaoDTO
 */
@Data
public class AvaliacaoDTO {

	private long cargaHorariaAtribuida;
    private long solicitacao;
    private String parecer;
    private boolean deferido;

}