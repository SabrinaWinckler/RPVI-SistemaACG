package com.unipampa.sistemaacg.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

/**
 * SolicitacaoPostDTO
 */
@Data
public class SolicitacaoPostDTO {

    private String local;
	private String aluno;
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date dataInicio;
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date dataFim;
	private long cargaHorariaSoli;
	private String profRes;
	private String descricao;
	private long idAtividade;
	//private Resource anexo;
	private MultipartFile anexo;
}