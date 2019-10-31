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
public class Grupo {

	@Id
	@NotEmpty
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idGrupo;

	@NotEmpty
	private String nome;

	@ManyToOne
	private Curriculo curriculo;

}
