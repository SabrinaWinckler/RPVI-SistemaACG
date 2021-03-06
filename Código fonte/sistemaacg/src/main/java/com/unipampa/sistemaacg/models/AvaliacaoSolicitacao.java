package com.unipampa.sistemaacg.models;

import java.util.Date;
import java.util.Optional;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Entity
@Data
public class AvaliacaoSolicitacao{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long idAvaliacao;

    private String parecer;

	//@NotEmpty
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date dataAvaliacao;//atual

    //@NotEmpty
	private long cargaHorariaAtribuida;

    @OneToOne
    private Solicitacao solicitacao;

	public AvaliacaoSolicitacao(){}


}
