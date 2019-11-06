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
import javax.persistence.ManyToMany;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
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


    @ManyToMany
    @JoinTable(name="atividade_has_doc", joinColumns=
    {@JoinColumn(name = "id_atividade") }, inverseJoinColumns =
      {@JoinColumn(name="id_doc_necessario")})
    List<DocsNecessarios> docs;


    // @OneToMany
    // List<Observacao> observacao;

}
