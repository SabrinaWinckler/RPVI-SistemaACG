package com.unipampa.sistemaacg.controllers;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.unipampa.sistemaacg.dto.InfosSolicitacaoDTO;
import com.unipampa.sistemaacg.dto.SolicitacaoPostDTO;
import com.unipampa.sistemaacg.models.Anexo;
import com.unipampa.sistemaacg.models.Atividade;
import com.unipampa.sistemaacg.models.Solicitacao;
import com.unipampa.sistemaacg.models.Status;
import com.unipampa.sistemaacg.repository.AnexoRepository;
import com.unipampa.sistemaacg.repository.AtividadeRepository;
import com.unipampa.sistemaacg.repository.CurriculoRepository;
import com.unipampa.sistemaacg.repository.GrupoRepository;
import com.unipampa.sistemaacg.repository.SolicitacaoRepository;
import com.unipampa.sistemaacg.storageanexo.StorageService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * SolicitacaoController
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("solicitacao") // localhost:8080/solicitacao
public class SolicitacaoController {

    @Autowired
    AnexoRepository anexoRepository;
    @Autowired
    SolicitacaoRepository solicitacaoRepository;
    @Autowired
    AtividadeRepository atividadeRepository;
    @Autowired
    GrupoRepository grupoRepository;
    @Autowired
    CurriculoRepository curriculoRepository;
    private static final Logger logger = LoggerFactory.getLogger(SolicitacaoController.class);

    private final StorageService storageService;

    @Autowired
    public SolicitacaoController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping(value = "") // Lista de solicitações no formato JSON - localhost:8080/solicitacao/
    public @ResponseBody ResponseEntity<Iterable<Solicitacao>> getSolitacoes() {
        Iterable<Solicitacao> retornableSolicitacoes = solicitacaoRepository.findAll();
        return ResponseEntity.ok(retornableSolicitacoes);
    }

    @GetMapping(value = "/infos") // Lista de atividades, grupo e curriculo no formato JSON -  // localhost:8080/solicitacao/infos/
    public InfosSolicitacaoDTO getInfos() {

        InfosSolicitacaoDTO infos = new InfosSolicitacaoDTO();
        infos.setAtividades(atividadeRepository.findAll());
        
        //infos.setCurriculo(curriculoRepository.findAll());
        infos.setGrupos(grupoRepository.findAll());

        return infos;
    }

    @GetMapping(value = "/{id}") // get uma solicitação
    public @ResponseBody ResponseEntity<Optional<Solicitacao>> getSolicitacaobyId(@PathVariable long id) {
        // Busca no banco pelo id
        Optional<Solicitacao> retornableSolicitacao = solicitacaoRepository.findById(id);
        return ResponseEntity.ok(retornableSolicitacao);
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> httpGetDownloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = storageService.loadAsResource(fileName);
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }


    @JsonIgnore
    @PostMapping("/")
    public ResponseEntity postSolicitacao(@ModelAttribute SolicitacaoPostDTO solicitacao,  MultipartFile files[]) throws Exception {

        Optional<Atividade> atividade = atividadeRepository.findById(solicitacao.getIdAtividade());

        if(!atividade.isPresent()){
            return ResponseEntity.badRequest().body("A Atividade com o ID "+ solicitacao.getIdAtividade()+" não foi encontrada");
        }
        

        Solicitacao newsolicitacao = new Solicitacao();
        Anexo newAnexo = new Anexo();
        newsolicitacao.setAtividade(atividade.get());

        newsolicitacao.setAluno(solicitacao.getAluno());
        newsolicitacao.setCargaHorariaSoli(solicitacao.getCargaHorariaSoli());
        newsolicitacao.setDescricao(solicitacao.getDescricao());
        newsolicitacao.setLocal(solicitacao.getLocal());
        newsolicitacao.setProfRes(solicitacao.getProfRes());

        Date dataAtual = new Date();
        SimpleDateFormat formato = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
        Date dataTeste = formato.parse(solicitacao.getDataInicio());
		newsolicitacao.setDataAtual(dataAtual);
        newsolicitacao.setDataInicio(dataTeste);
		newsolicitacao.setDataFim(dataTeste);

		newsolicitacao.setStatus(Status.PENDENTE.toString());

        Solicitacao retornableSolicitacao = solicitacaoRepository.save(newsolicitacao);
        
        for (MultipartFile file : files) {
            newAnexo.setNome(storageService.store(file, solicitacao.getAluno()));
            anexoRepository.save(newAnexo);
        }

        return ResponseEntity.ok(retornableSolicitacao);

    }

    @DeleteMapping(value = "/{id}")
    public @ResponseBody ResponseEntity<Optional<Solicitacao>> deleteSolicitacaobyId(@PathVariable long id) {
        // Busca no banco pelo id
        Optional<Solicitacao> retornableSolicitacao = solicitacaoRepository.findById(id);
        solicitacaoRepository.deleteById(id);
        return ResponseEntity.ok(retornableSolicitacao);
    }


}

