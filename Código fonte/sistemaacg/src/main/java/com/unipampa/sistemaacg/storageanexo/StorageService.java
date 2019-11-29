package com.unipampa.sistemaacg.storageanexo;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {

    void init();


    String store(MultipartFile file, String nome) throws Exception;

    Stream<Path> loadAll();

    Path load(String filename);
    
    Resource loadAsResource(String filename);

    void deleteAll();
}
