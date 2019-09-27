package com.unipampa.sistemaacg.controllers;

import java.util.List;

import com.unipampa.sistemaacg.models.Solicitacao;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


/**
 * SolicitacaoController
 */
@RestController
@RequestMapping("solicitacao") //localhost:8080/solicitacao
public class SolicitacaoController {


    @GetMapping(value="")//Lista de solicitações no formato JSON - localhost:8080/solicitacao/
    public @ResponseBody ResponseEntity<List<Solicitacao>> getSolitacoes(){

        return null;
    }

    @GetMapping(value="infos")//Lista de atividades, grupo e curriculo no formato JSON - localhost:8080/solicitacao/infos/
    public List<Object> getInfos(){

        return null;
    }

    @GetMapping(value="/get/{id}")//get uma solicitação
    public @ResponseBody ResponseEntity<Solicitacao> getSolicitacaobyId(@PathVariable int id){
        //Busca no banco pelo id
        Solicitacao solicitacao = new Solicitacao();
        return new ResponseEntity<Solicitacao>(solicitacao, HttpStatus.OK);
    }

    @PostMapping("/post/")
    public @ResponseBody ResponseEntity<Solicitacao> postSolicitacao(@RequestBody Solicitacao solicitacao) {
         return null;


    }



}

