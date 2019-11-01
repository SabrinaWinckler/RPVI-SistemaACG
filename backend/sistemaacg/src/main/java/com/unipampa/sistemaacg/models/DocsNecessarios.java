package com.unipampa.sistemaacg.models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * DocsNecessarios
 */
@Entity
@Data
public class DocsNecessarios {

    @Id
	@NotEmpty
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long idDocNecessario;

    @NotNull
    String nome;

    @ManyToOne
    Atividade atividade;

    @ManyToMany
    @JoinTable(name="doc_has_observacao", joinColumns=
    {@JoinColumn(name = "id_doc_necessario") }, inverseJoinColumns =
      {@JoinColumn(name="id_observacao")})
    List<Observacao> observacao;
}