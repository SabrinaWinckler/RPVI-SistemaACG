package com.unipampa.sistemaacg.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Entity
@Data
public class Grupo {

	@Id
	@NotEmpty
	@GeneratedValue
	private long idGrupo;

	@NotEmpty
	private String nome;

}
