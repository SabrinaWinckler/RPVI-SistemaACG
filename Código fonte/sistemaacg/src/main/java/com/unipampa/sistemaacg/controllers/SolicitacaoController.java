package com.unipampa.sistemaacg.controllers;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import java.util.Optional;

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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @PostMapping("/upload")
    public String postAnexo(@RequestParam("file") MultipartFile file, String nome) throws Exception {

        return storageService.store(file, nome);

    }


    @PostMapping("uploadfiles")
    public ArrayList postAnexos(@RequestParam("file") MultipartFile files[], String nome) throws Exception {
        ArrayList filesName = new ArrayList<String>();
        String nomeCaminho;
        for (MultipartFile string : files) {
            nomeCaminho = storageService.store(string, nome);
            filesName.add(nomeCaminho);
        }
        return filesName;
    }

    @JsonIgnore
    @PostMapping("/")

    public ResponseEntity postSolicitacao(@ModelAttribute SolicitacaoPostDTO solicitacao,  MultipartFile file) throws Exception {
      Optional<Atividade> atividade = atividadeRepository.findById(solicitacao.getIdAtividade());


        if(!atividade.isPresent()){
            return ResponseEntity.badRequest().body("A Atividade com o ID "+ solicitacao.getIdAtividade()+" não foi encontrada");
        }

        Solicitacao newsolicitacao = new Solicitacao();
        Anexo newAnexo = new Anexo();
        newsolicitacao.setAtividade(atividade.get());

 
        for (MultipartFile file : files) {
         if (!newsolicitacao.verificaTamanho(file.getSize())) {
		 	return ResponseEntity.badRequest().body("O arquivo com "+ file.getSize()+"mb excede o tamanho permitido! Por favor selecione um arquivo com no máximo 20mb");
        }
    }
        

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
            caminhoNome = storageService.store(file, solicitacao.getAluno());
            String[] arrayString = caminhoNome.split("-", 2);
            newAnexo.setNome(arrayString[1]);
            newAnexo.setCaminho(arrayString[0]);
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

