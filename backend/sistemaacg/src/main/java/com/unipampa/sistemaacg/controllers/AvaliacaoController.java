package com.unipampa.sistemaacg.controllers;

import java.util.Date;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.unipampa.sistemaacg.dto.AvaliacaoDTO;
import com.unipampa.sistemaacg.dto.SolicitacaoPostDTO;
import com.unipampa.sistemaacg.models.Atividade;
import com.unipampa.sistemaacg.models.AvaliacaoSolicitacao;
import com.unipampa.sistemaacg.models.Solicitacao;
import com.unipampa.sistemaacg.models.Status;
import com.unipampa.sistemaacg.repository.AnexoRepository;
import com.unipampa.sistemaacg.repository.AtividadeRepository;
import com.unipampa.sistemaacg.repository.AvaliacaoRepository;
import com.unipampa.sistemaacg.repository.CurriculoRepository;
import com.unipampa.sistemaacg.repository.GrupoRepository;
import com.unipampa.sistemaacg.repository.SolicitacaoRepository;
import com.unipampa.sistemaacg.storageanexo.StorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * AvaliacaoController
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("avaliacao")
public class AvaliacaoController {

    @Autowired
    SolicitacaoRepository solicitacaoRepository;
    @Autowired
    AtividadeRepository atividadeRepository;
    @Autowired
    GrupoRepository grupoRepository;
    @Autowired
    CurriculoRepository curriculoRepository;
    @Autowired
    AvaliacaoRepository avaliacaoRepository;
    @Autowired
    AnexoRepository anexoRepository;

    private final StorageService storageService;

    @Autowired
    public AvaliacaoController(StorageService storageService) {
        this.storageService = storageService;
    }

    @JsonIgnore
    @PostMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity postAvaliacao(@RequestBody AvaliacaoDTO avaliacao, @PathVariable long id) {

        AvaliacaoSolicitacao newAvaliacao = new AvaliacaoSolicitacao();
        Date dataAtual = new Date();
        Solicitacao avaliada = solicitacaoRepository.findById(id).get();
        String status = avaliada.getStatus();
        if (status.equals("Deferido") || status.equals("Indeferido")) {
            return ResponseEntity.badRequest().body("Essa avaliação da foi avaliada");
        }
        if (avaliacao.isDeferido()) {
            avaliada.setStatus(Status.DEFERIDO.toString());
        } else {
            avaliada.setStatus(Status.INDEFERIDO.toString());
        }
        avaliada.setIdSolicitacao(id);
        avaliada.setAtividade(atividadeRepository.findById(avaliacao.getIdAtividade()).get());
        solicitacaoRepository.save(avaliada);
        newAvaliacao.setCargaHorariaAtribuida(avaliacao.getCargaHorariaAtribuida());
        newAvaliacao.setDataAvaliacao(dataAtual);
        newAvaliacao.setSolicitacao(avaliada);

        newAvaliacao.setJustificativa(avaliacao.getParecer());
        try {
            newAvaliacao.verificaDeferimento();
        } catch (Exception e) {
            return ResponseEntity.ok("Não foi possível realizar a avaliação, pois: " + e.getMessage());

        }
        AvaliacaoSolicitacao retornableAvaliacao = avaliacaoRepository.save(newAvaliacao);

        return ResponseEntity.ok(retornableAvaliacao);
    }

    @DeleteMapping(value = "/{id}")
    public @ResponseBody
    ResponseEntity<Optional<AvaliacaoSolicitacao>> deleteAvaliacaobyId(@PathVariable long id) {
        // Busca no banco pelo id
        Optional<AvaliacaoSolicitacao> retornableAvaliacao = avaliacaoRepository.findById(id);
        avaliacaoRepository.deleteById(id);
        retornableAvaliacao.get().getSolicitacao().setStatus(Status.PENDENTE.toString());
        solicitacaoRepository.save(retornableAvaliacao.get().getSolicitacao());
        return ResponseEntity.ok(retornableAvaliacao);
    }

    @GetMapping(value = "/infos/{id}") // get infos para avaliacao
    public ResponseEntity<Optional<Solicitacao>> getInfos(@PathVariable long id) {
        // Busca no banco pelo id
        Optional<Solicitacao> retornableSolicitacao = solicitacaoRepository.findById(id);
        return ResponseEntity.ok(retornableSolicitacao);
    }

    // pega um anexo a partir do nome do anexo, só chamar isso para cada anexo na
    // view, ele mostra o pdf no navegador
    @GetMapping("/file/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {

        Resource file = storageService.loadAsResource(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    public String getAnexoByDoc(SolicitacaoPostDTO solicitacao) {
        Atividade atividade = atividadeRepository.findById(solicitacao.getIdAtividade()).get();

        return null;

    }

}