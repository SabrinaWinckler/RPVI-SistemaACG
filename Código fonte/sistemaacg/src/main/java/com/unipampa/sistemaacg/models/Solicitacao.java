package com.unipampa.sistemaacg.models;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
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
	private String status;

	private String profRes;

	private String descricao;

	@ManyToOne
	private Atividade atividade;

	@OneToOne
	private Anexo anexo;
	 


	//Construtor
	public Solicitacao(){

	}

	public boolean verificaTamanho(int tamanho) {
		return tamanho <= 20;
	}

	public Solicitacao incluirSolicitacao(String dataAtual, String dataInicio, String dataFim, int ch, String descricao,
			String profRes, String nomeAnexo, int tamAnexo, int idAtividade, int idGrupo, int idCurriculo)
			throws Exception {
		if (!verificaTamanho(tamAnexo)) {
			throw new Exception("Tamanho do anexo excede 20mb");
		}
		anexo = new Anexo(nomeAnexo);
		SimpleDateFormat formato = new SimpleDateFormat("yyyy-MM-dd");
		this.dataAtual = formato.parse(dataAtual);
		this.dataInicio = formato.parse(dataInicio);
		this.dataFim = formato.parse(dataFim);
		this.cargaHorariaSoli = ch;
		this.descricao = descricao;
		this.profRes = profRes;
		this.status = Status.PENDENTE.toString();

		return this;
	}

	public Solicitacao excluirSolicitacao() {
		return null;
	}
}
