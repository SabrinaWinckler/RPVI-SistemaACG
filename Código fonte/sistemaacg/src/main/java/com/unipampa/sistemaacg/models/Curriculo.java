package com.unipampa.sistemaacg.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;

import lombok.Data;

@Entity
@Data
public class Curriculo {


	@Id
	@NotEmpty
	@GeneratedValue
	private long idCurriculo;
	
	@NotEmpty
	private int ano;

	@NotEmpty
	private boolean status;

	//@OneToMany
	//private List<Grupo> grupo;

}
