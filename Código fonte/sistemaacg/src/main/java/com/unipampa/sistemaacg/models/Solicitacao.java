package com.unipampa.sistemaacg.models;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
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

	@ManyToOne
	private Atividade atividade;
	public boolean verificaTamanho(int tamanho){
        return tamanho <= 20;
    }

    public void incluirSolicitacao(String dataAtual, String dataInicio, String dataFim, int ch, String descricao,
			String profRes, String nomeAnexo, int tamAnexo, int idAtividade, int idGrupo, int idCurriculo)
			throws Exception {
        if(!verificaTamanho(tamAnexo)){
            throw new Exception("Tamanho do anexo excede 20mb");
        }
        Anexo anexo = new Anexo(nomeAnexo);

        SimpleDateFormat formato = new SimpleDateFormat("yyyy-MM-dd");

        this.dataAtual = formato.parse(dataAtual);
        this.dataInicio = formato.parse(dataInicio);
        this.dataFim = formato.parse(dataFim);

        this.cargaHorariaSoli = ch;
        this.descricao = descricao;
        this.profRes = profRes;

        repository.save(this);
	}

	public Solicitacao excluirSolicitacao() {
		return null;
	}
}
