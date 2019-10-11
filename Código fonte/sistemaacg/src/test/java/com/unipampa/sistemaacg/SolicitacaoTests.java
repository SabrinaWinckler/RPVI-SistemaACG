package com.unipampa.sistemaacg;

import java.nio.file.Paths;
import java.util.Date;
import java.util.stream.Stream;

import com.unipampa.sistemaacg.controllers.SolicitacaoController;
import com.unipampa.sistemaacg.dto.InfosSolicitacaoDTO;
import com.unipampa.sistemaacg.dto.SolicitacaoPostDTO;
import com.unipampa.sistemaacg.models.Solicitacao;
import com.unipampa.sistemaacg.storageanexo.StorageAnexo;
import com.unipampa.sistemaacg.storageanexo.StorageException;
import com.unipampa.sistemaacg.storageanexo.StorageService;

import org.apache.tomcat.jni.File;
import org.hamcrest.Matchers;
import org.hamcrest.core.IsInstanceOf;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

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

        @Autowired
        private MockMvc mvc;

        @MockBean
        private StorageService storageService;

        @Autowired
        SolicitacaoController controller;

        @Autowired
        Solicitacao solicitacao;

        @Autowired
        SolicitacaoPostDTO dto;

        @Autowired
        InfosSolicitacaoDTO infosDTO;

        @Autowired
        StorageAnexo storage;

    //Criação caso base
    public void casoBase(){
            dto.setAluno("aluno");
            dto.setCargaHorariaSoli(10);
            dto.setDataFim(new Date());
            dto.setDataInicio(new Date());
            dto.setDescricao("descricao");
            dto.setIdAtividade(1);
            dto.setLocal("local");
            dto.setProfRes("profRes");
            dto.setAnexo((MultipartFile) storage.loadAsResource("teste.pdf"));
    }

    @Test
    public void shouldBeMultipartFile(){
        this.casoBase();
        Assert.assertTrue(dto.getAnexo() instanceof MultipartFile);
    }
    //Upload and Read Anexos
    @Test
    public void shouldListAllFiles() throws Exception {
        given(this.storageService.loadAll())
                .willReturn(Stream.of(Paths.get("test.pdf")));

        this.mvc.perform(get("/")).andExpect(status().isOk())
                .andExpect(model().attribute("files",
                        Matchers.contains("http://localhost:8081/solicitacao/anexos/test.pdf")));
    }

    @Test
    public void shouldSaveUploadedFile() throws Exception {
        MockMultipartFile multipartFile = new MockMultipartFile("file", "test.pdf",
                "text/plain", "Spring Framework".getBytes());
        this.mvc.perform(fileUpload("/").file(multipartFile))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "/"));
        String nome = "jorel";
        then(this.storageService).should().store(multipartFile, nome);
    }
    //Solicitação


    @Test
    public void shouldPostSolicitacao() throws Exception {

        ResponseEntity<Object> result = controller.postSolicitacao(dto);

        Assert.assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    public void shouldGetSolicitacoes() throws Exception {

    }

    public void shouldGetSolicitacao() throws Exception {

    }

    @Test
    public void shouldGetInfos() throws Exception {
        InfosSolicitacaoDTO infos = new InfosSolicitacaoDTO();

    }

}