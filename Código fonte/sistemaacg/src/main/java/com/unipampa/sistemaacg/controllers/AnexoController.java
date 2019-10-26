package com.unipampa.sistemaacg.controllers;

import java.io.File;
import java.io.IOException;

import com.unipampa.sistemaacg.models.Anexo;
import com.unipampa.sistemaacg.repository.AnexoRepository;
import com.unipampa.sistemaacg.repository.SolicitacaoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * AnexoController
 */

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("anexo") // localhost:8080/solicitacao
public class AnexoController {
    @Autowired
    AnexoRepository anexoRepository;
    @Autowired
    SolicitacaoRepository solicitacaoRepository;

    @PostMapping("/upload")
    public String postAnexo(@RequestParam("file") File file, String nome) throws IOException {
        Anexo newanexo = new Anexo();
        //FileInputStream inputStream = new FileInputStream(file);
        //newanexo.setFile(file.get);
        newanexo.setNome(nome);
        //newanexo.setSolicitacao(solicitacaoRepository.findById(id).get());
        anexoRepository.save(newanexo);
        return newanexo.getNome();
    }
    
    
}