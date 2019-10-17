package com.unipampa.sistemaacg;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Stream;

import com.unipampa.sistemaacg.controllers.SolicitacaoController;
import com.unipampa.sistemaacg.dto.InfosSolicitacaoDTO;
import com.unipampa.sistemaacg.dto.SolicitacaoPostDTO;
import com.unipampa.sistemaacg.models.Solicitacao;
import com.unipampa.sistemaacg.storageanexo.StorageAnexo;
import com.unipampa.sistemaacg.storageanexo.StorageException;
import com.unipampa.sistemaacg.storageanexo.StorageProperties;
import com.unipampa.sistemaacg.storageanexo.StorageService;

import org.apache.tomcat.jni.File;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.hamcrest.Matchers;
import org.hamcrest.core.IsInstanceOf;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.fileUpload;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
public class SolicitacaoTests {

    // @Autowired
    private MockMvc mvc;

    @MockBean
    private StorageService storageService;

    // @Autowired
    SolicitacaoController controller;

    // @Autowired
    Solicitacao solicitacao;

    // @Autowired
    SolicitacaoPostDTO dto;

    // @Autowired
    InfosSolicitacaoDTO infosDTO;

    // @Autowired
    StorageAnexo storage;

    // Criação caso base
    // @Autowired
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
    public void shouldBeMultipartFile() throws IOException {
        this.casoBase();
        Assert.assertTrue(this.dto.getAnexo() instanceof MultipartFile);
    }

    @Test
    public void shouldBeSolicitacaoDTO() throws IOException {
        this.casoBase();
        Assert.assertTrue(this.dto instanceof SolicitacaoPostDTO);
    }

    // Upload and Read Anexos
    @Test
    public void shouldListAllFiles() throws Exception {
        this.casoBase();
        given(this.storageService.loadAll()).willReturn(Stream.of(Paths.get("teste.pdf")));

        this.mvc.perform(get("/")).andExpect(status().isOk()).andExpect(
                model().attribute("files", Matchers.contains("http://localhost:8081/solicitacao/anexos/teste.pdf")));
    }

    @Test
    public void shouldSaveUploadedFile() throws Exception {
        MockMultipartFile multipartFile = new MockMultipartFile("file", "teste.pdf", "text/plain",
                "Spring Framework".getBytes());
        this.mvc.perform(fileUpload("/").file(multipartFile)).andExpect(status().isFound())
                .andExpect(header().string("Location", "/"));
        String nome = "jorel";
        then(this.storageService).should().store(multipartFile, nome);
    }
    // Solicitação

    @Test
    public void shouldPostSolicitacao() throws Exception {
        this.casoBase();

        StorageService storageService = Mockito.mock(StorageService.class, Mockito.CALLS_REAL_METHODS);
        this.controller = new SolicitacaoController(storageService);
        
        ResponseEntity<Object> result = controller.postSolicitacao(this.dto);
        Assert.assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    public void shouldDeleteSolicitacao() throws Exception {
        this.casoBase();

        StorageService storageService = Mockito.mock(StorageService.class, Mockito.CALLS_REAL_METHODS);
        this.controller = new SolicitacaoController(storageService);

        ResponseEntity<Object> registra = controller.postSolicitacao(dto);

        ResponseEntity<Optional<Solicitacao>> result = controller.deleteSolicitacaobyId(1);

        Assert.assertTrue(200 == result.getStatusCodeValue() || 204 == result.getStatusCodeValue()
                || 202 == result.getStatusCodeValue());// ou 204 ou 202
    }

    @Test
    public void shouldGetSolicitacoes() throws Exception {

    }

    public void shouldGetSolicitacao() throws Exception {

    }

    @Test
    public void shouldImplController() throws Exception {
        StorageService storageService = Mockito.mock(StorageService.class, Mockito.CALLS_REAL_METHODS);
        this.controller = new SolicitacaoController(storageService);

        Assert.assertTrue(!this.controller.equals(null));
    }

    @Test
    public void shouldGetInfos() throws Exception {
        StorageService storageService = Mockito.mock(StorageService.class, Mockito.CALLS_REAL_METHODS);
        this.controller = new SolicitacaoController(storageService);
        InfosSolicitacaoDTO result = controller.getInfos();

        Assert.assertTrue(controller.getInfos() instanceof InfosSolicitacaoDTO);
    }

}