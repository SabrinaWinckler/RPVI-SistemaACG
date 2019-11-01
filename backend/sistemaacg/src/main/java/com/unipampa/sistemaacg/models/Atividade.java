package com.unipampa.sistemaacg.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Entity
@Data
public class Atividade {

	@Id
	@NotEmpty
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long idAtividade;

	@NotEmpty
	private String detalhamento;

	@NotEmpty
	private String descricao;

	@ManyToOne
	private Grupo grupo;

}
