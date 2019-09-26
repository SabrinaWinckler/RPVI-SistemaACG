package com.unipampa.sistemaacg.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;

import lombok.Data;

@Entity
@Data
public class Anexo {

	@Id
	@NotEmpty
	@GeneratedValue
	private long idAnexo;

	@NotEmpty
	private int limite;

	@NotEmpty
	private String nome;

	

}
