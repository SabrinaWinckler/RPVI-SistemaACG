package com.unipampa.sistemaacg.models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.validation.constraints.NotEmpty;

import lombok.Data;

/**
 * Observacao
 */
@Entity
@Data
public class Observacao {
    @Id
	@NotEmpty
	@GeneratedValue
    private long idObservacao;

	private String observacao;

	@NotEmpty
    private int ch;

}