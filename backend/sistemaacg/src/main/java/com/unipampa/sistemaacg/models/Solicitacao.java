package com.unipampa.sistemaacg.models;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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

	@OneToMany(mappedBy = "solicitacao", cascade=CascadeType.ALL)
	@JsonManagedReference
	private List<Anexo> anexos;

	@OneToOne(mappedBy = "solicitacao")
	@JsonManagedReference
	private AvaliacaoSolicitacao avaliacao;

	public Solicitacao(){}

}
