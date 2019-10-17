package com.unipampa.sistemaacg.controllers;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

import com.unipampa.sistemaacg.dto.InfosSolicitacaoDTO;
import com.unipampa.sistemaacg.dto.SolicitacaoPostDTO;
import com.unipampa.sistemaacg.models.Atividade;
import com.unipampa.sistemaacg.models.Solicitacao;
import com.unipampa.sistemaacg.models.Status;
import com.unipampa.sistemaacg.repository.AtividadeRepository;
import com.unipampa.sistemaacg.repository.CurriculoRepository;
import com.unipampa.sistemaacg.repository.GrupoRepository;
import com.unipampa.sistemaacg.repository.SolicitacaoRepository;
import com.unipampa.sistemaacg.storageanexo.StorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

/**
 * SolicitacaoController
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("solicitacao") // localhost:8080/solicitacao
public class SolicitacaoController {

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

    // @PostMapping("/teste")
    // public String postTeste(String nome) throws Exception {
    //     return nome;
    // }

    @PostMapping("/")
    public ResponseEntity postSolicitacao(@RequestBody SolicitacaoPostDTO solicitacao) throws Exception {

        Optional<Atividade> atividade = atividadeRepository.findById(solicitacao.getIdAtividade());

        if(!atividade.isPresent()){
            return ResponseEntity.badRequest().body("A Atividade com o ID "+ solicitacao.getIdAtividade()+" não foi encontrada");
        }

        Solicitacao newsolicitacao = new Solicitacao();
        newsolicitacao.setAtividade(atividade.get());

        java.io.File file = solicitacao.getAnexo().getFile();
        FileInputStream input = new FileInputStream(file);
        MultipartFile multipartFile = new MockMultipartFile("file", file.getName(), "text/plain","Spring Framework".getBytes());

        newsolicitacao.setNomeAnexo(this.postAnexo(multipartFile, solicitacao.getAluno()));

        //newsolicitacao.setNomeAnexo(this.postTeste("teste"));

         if (!newsolicitacao.verificaTamanho(solicitacao.getAnexo().getSize())) {
		 	return ResponseEntity.badRequest().body("O arquivo com "+ solicitacao.getAnexo().getFilename()+"mb excede o tamanho permitido! Por favor selecione um arquivo com no máximo 20mb");
         }

        newsolicitacao.setAluno(solicitacao.getAluno());
        newsolicitacao.setCargaHorariaSoli(solicitacao.getCargaHorariaSoli());
        newsolicitacao.setDescricao(solicitacao.getDescricao());
        newsolicitacao.setLocal(solicitacao.getLocal());
        newsolicitacao.setProfRes(solicitacao.getProfRes());

        Date dataAtual = new Date();
        // SimpleDateFormat formato = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
        // Date dataTeste = formato.parse(solicitacao.getDataInicio());
		newsolicitacao.setDataAtual(dataAtual);
        newsolicitacao.setDataInicio(solicitacao.getDataInicio());
		newsolicitacao.setDataFim(solicitacao.getDataFim());

		newsolicitacao.setStatus(Status.PENDENTE.toString());

        Solicitacao retornableSolicitacao = solicitacaoRepository.save(newsolicitacao);
        return ResponseEntity.ok(retornableSolicitacao);

    }

    @DeleteMapping(value = "/{id}")
    public @ResponseBody ResponseEntity<Optional<Solicitacao>> deleteSolicitacaobyId(@PathVariable long id) {
        // Busca no banco pelo id
        Optional<Solicitacao> retornableSolicitacao = solicitacaoRepository.findById(id);
        solicitacaoRepository.deleteById(id);
        return ResponseEntity.ok(retornableSolicitacao);
    }
    //Código da documentação para usar como base

    @GetMapping("/anexos")
    public String listUploadedFiles(Model model) throws IOException {

        model.addAttribute("files", storageService.loadAll().map(
                path -> MvcUriComponentsBuilder.fromMethodName(SolicitacaoController.class,
                        "serveFile", path.getFileName().toString()).build().toString())
                .collect(Collectors.toList()));

        return "uploadForm";
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {

        Resource file = storageService.loadAsResource(filename);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

}

