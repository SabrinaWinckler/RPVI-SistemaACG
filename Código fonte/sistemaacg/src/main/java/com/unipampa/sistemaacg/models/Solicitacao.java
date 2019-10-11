package com.unipampa.sistemaacg.models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Entity
@Data
public class Solicitacao{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long idSolicitacao;

	@NotEmpty
	private String local;

	@NotEmpty
	private String aluno;

	//@NotEmpty
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date dataAtual;

	//@NotEmpty
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date dataInicio;

	//@NotEmpty
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date dataFim;

	private long cargaHorariaSoli;

	private String status;

	private String profRes;

	private String descricao;

	@ManyToOne
	private Atividade atividade;

	@NotEmpty
	private String nomeAnexo;

	public boolean verificaTamanho(long tamanho) {
		return tamanho <= 20;
	}

	public Solicitacao(){}

}
