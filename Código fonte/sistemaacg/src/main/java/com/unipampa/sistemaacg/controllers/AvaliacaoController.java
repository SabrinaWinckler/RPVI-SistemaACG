package com.unipampa.sistemaacg.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.unipampa.sistemaacg.dto.AvaliacaoDTO;
import com.unipampa.sistemaacg.models.Anexo;
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
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

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
    @PostMapping("/")
    public ResponseEntity postAvaliacao(@ModelAttribute AvaliacaoDTO avaliacao){

        AvaliacaoSolicitacao newavaliacao = new AvaliacaoSolicitacao();
        Date dataAtual = new Date();
        Solicitacao avaliada = solicitacaoRepository.findById(avaliacao.getSolicitacao()).get();

        if(avaliacao.getParecer() == null){
            avaliada.setStatus(Status.DEFERIDO.toString());
        }else{
            avaliada.setStatus(Status.INDEFERIDO.toString());
        }
        solicitacaoRepository.save(avaliada);

        newavaliacao.setCargaHorariaAtribuida(avaliacao.getCargaHorariaAtribuida());
        newavaliacao.setDataAvaliacao(dataAtual);
        newavaliacao.setSolicitacao(avaliada);
        newavaliacao.setParecer(avaliacao.getParecer());

        AvaliacaoSolicitacao retornableAvaliacao = avaliacaoRepository.save(newavaliacao);

        return ResponseEntity.ok(retornableAvaliacao);
    }

    @DeleteMapping(value = "/{id}")
    public @ResponseBody ResponseEntity<Optional<AvaliacaoSolicitacao>> deleteAvaliacaobyId(@PathVariable long id) {
        // Busca no banco pelo id
        Optional<AvaliacaoSolicitacao> retornableAvaliacao = avaliacaoRepository.findById(id);
        avaliacaoRepository.deleteById(id);
        retornableAvaliacao.get().getSolicitacao().setStatus(Status.PENDENTE.toString());
        solicitacaoRepository.save(retornableAvaliacao.get().getSolicitacao());
        return ResponseEntity.ok(retornableAvaliacao);
    }

    @GetMapping(value = "/infos/{id}") // get infos para avaliacao
    public HashMap<Solicitacao,List<Resource>> getInfos(@PathVariable long id) {
        // Busca no banco pelo id
        Solicitacao retornableSolicitacao = solicitacaoRepository.findById(id).get();

        Iterable<Anexo> anexos = anexoRepository.findAll();
        List<Anexo> anexosDaSolicitacao = new ArrayList<>();
        List<Resource> arquivos = new ArrayList<>();
        HashMap<Solicitacao,List<Resource>> retorno = new HashMap<>();

        for(Anexo anexo: anexos){
            if(anexo.getSolicitacao().equals(retornableSolicitacao)){
                anexosDaSolicitacao.add(anexo);
                arquivos.add(storageService.loadAsResource(anexo.getNome()));
            }
        }

        retorno.put(retornableSolicitacao, arquivos);

        return retorno;
    }

    //pega um anexo
    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {

        Resource file = storageService.loadAsResource(filename);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    //lista todos anexos
    @GetMapping("/anexos")
    public String listUploadedFiles(Model model) throws IOException {

        model.addAttribute("files", storageService.loadAll().map(
                path -> MvcUriComponentsBuilder.fromMethodName(SolicitacaoController.class,
                        "serveFile", path.getFileName().toString()).build().toString())
                .collect(Collectors.toList()));

        return "uploadForm";
    }

}