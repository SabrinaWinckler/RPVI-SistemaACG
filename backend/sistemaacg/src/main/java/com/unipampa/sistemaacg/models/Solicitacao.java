package com.unipampa.sistemaacg.models;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.Digits;
import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

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
	@Size(min = 3)
	private String nomeAluno;

	@Size(min = 10, max = 10, message = "A matrícula é inválida.")
	@NotBlank(message = "A matrícula é obrigatória")
	@Pattern(regexp = "[0-9]?[0-9]?0?[0-9]*$")//Padrão da matrícula não validado com a coordenaçao
	private long matricula;

	@JsonFormat(pattern="yyyy-MM-dd")
	@FutureOrPresent
	private Date dataAtual;

	@JsonFormat(pattern="yyyy-MM-dd")
	@PastOrPresent
	@NotBlank(message = "A data de inicio é obrigatória")
	private Date dataInicio;

	@JsonFormat(pattern="yyyy-MM-dd")
	@NotBlank(message = "A data de fim é obrigatória")
	private Date dataFim;

	@NotBlank(message = "A matrícula é obrigatória")
	@Positive
	private long cargaHorariaSoli;

	@ManyToOne
	@NotBlank(message = "É obrigatório selecionar uma atividade")
	private Atividade atividade;

	@OneToMany(mappedBy = "solicitacao", cascade=CascadeType.ALL)
	@JsonManagedReference
	@NotBlank(message = "É obrigatório anexar os arquivos comprobatórios")
	private List<Anexo> anexos;

	@OneToOne(mappedBy = "solicitacao")
	@JsonManagedReference
	private AvaliacaoSolicitacao avaliacao;

	private String status;//Status
	private String descricao;
	private String profRes;
	private String local;

	public Solicitacao(){}

}
