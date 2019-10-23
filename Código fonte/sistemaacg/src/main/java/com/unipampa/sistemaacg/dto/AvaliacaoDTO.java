package com.unipampa.sistemaacg.dto;

import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.unipampa.sistemaacg.models.Solicitacao;

import lombok.Data;

/**
 * AvaliacaoDTO
 */
@Data
public class AvaliacaoDTO {

	private long cargaHorariaAtribuida;
    private long solicitacao;
    private String parecer;

}