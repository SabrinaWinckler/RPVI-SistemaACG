package com.unipampa.sistemaacg.models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Entity
@Data
public class Solicitacao {


	@Id
	@NotEmpty
	@GeneratedValue
	private long idSolicitacao;

	@NotEmpty
	private String local;

	@NotEmpty
	private Date dataAtual;

	@NotEmpty
	private Date dataInicio;

	@NotEmpty
	private Date dataFim;

	@NotEmpty
	private int cargaHorariaSoli;

	@NotEmpty
	private boolean status;

	
	private String profRes;


	private String descricao;

	public void incluir() {

	}

	public Solicitacao excluir() {
		return null;
	}

}
