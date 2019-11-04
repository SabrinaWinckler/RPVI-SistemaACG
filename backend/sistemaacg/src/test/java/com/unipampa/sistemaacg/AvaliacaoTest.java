package com.unipampa.sistemaacg;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;

import com.unipampa.sistemaacg.controllers.AvaliacaoController;
import com.unipampa.sistemaacg.controllers.SolicitacaoController;
import com.unipampa.sistemaacg.dto.InfosSolicitacaoDTO;
import com.unipampa.sistemaacg.dto.SolicitacaoPostDTO;
import com.unipampa.sistemaacg.models.AvaliacaoSolicitacao;
import com.unipampa.sistemaacg.models.Solicitacao;
import com.unipampa.sistemaacg.repository.AtividadeRepository;
import com.unipampa.sistemaacg.repository.CurriculoRepository;
import com.unipampa.sistemaacg.repository.GrupoRepository;
import com.unipampa.sistemaacg.repository.SolicitacaoRepository;
import com.unipampa.sistemaacg.storageanexo.StorageAnexo;
import com.unipampa.sistemaacg.storageanexo.StorageProperties;
import com.unipampa.sistemaacg.storageanexo.StorageService;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import net.bytebuddy.dynamic.DynamicType.Builder.FieldDefinition.Optional;

import junit.framework.Assert;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AvaliacaoTest {


    // @Autowired
    private MockMvc mvc;

    @MockBean
    private StorageService storageService;

    // @Autowired
    AvaliacaoController controller;

    // @Autowired
    Solicitacao solicitacao;

    // @Autowired
    SolicitacaoPostDTO dto;

    // @Autowired
    InfosSolicitacaoDTO infosDTO;

    // @Autowired
    StorageAnexo storage;

    @Autowired
    SolicitacaoRepository solicitacaoRepository;
    @Autowired
    AtividadeRepository atividadeRepository;
    @Autowired
    GrupoRepository grupoRepository;
    @Autowired
    CurriculoRepository curriculoRepository;

    public SolicitacaoPostDTO casoBase() throws IOException {
        this.dto = new SolicitacaoPostDTO();
        StorageProperties p = new StorageProperties();
        storage = new StorageAnexo(p);
        dto.setAluno("aluno");
        dto.setCargaHorariaSoli(10);
        dto.setDataFim(new Date());
        dto.setDataInicio(new Date());
        dto.setDescricao("descricao");
        dto.setIdAtividade(1);
        dto.setLocal("local");
        dto.setProfRes("profRes");
        java.io.File file = storage.loadAsResource("teste.pdf").getFile();
        FileInputStream input = new FileInputStream(file);
        MultipartFile multipartFile = new MockMultipartFile("file", file.getName(), "text/plain",
                "Spring Framework".getBytes());
        dto.setAnexo(multipartFile);
        return dto;
    }

    @Test
    public void shouldPostAvaliacao() throws Exception {
        this.casoBase();

        StorageService storageService = Mockito.mock(StorageService.class, Mockito.CALLS_REAL_METHODS);
        this.controller = new AvaliacaoController(storageService);

        ResponseEntity<Object> result = controller.postAvaliacao(this.dto);
        Assert.assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    public void shouldDeleteAvaliacao() throws Exception {
        this.casoBase();

        StorageService storageService = Mockito.mock(StorageService.class, Mockito.CALLS_REAL_METHODS);
        this.controller = new AvaliacaoController(storageService);

        ResponseEntity<Object> registra = controller.postAvaliacao(dto);

        ResponseEntity<Optional<AvaliacaoSolicitacao>> result = controller.deleteAvaliacaobyId(1);

        Assert.assertTrue(200 == result.getStatusCodeValue() || 204 == result.getStatusCodeValue()
                || 202 == result.getStatusCodeValue());// ou 204 ou 202
    }

}