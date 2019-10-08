package com.unipampa.sistemaacg.storageanexo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Properties;
import java.util.stream.Stream;

@Service
public class StorageAnexo implements StorageService {

    private Path rootLocation;
    StorageProperties properties;

    @Autowired
    public StorageAnexo(StorageProperties properties) {
        this.rootLocation = Paths.get(properties.getLocation());
        this.properties = properties;
    }

    @Override
    public String store(MultipartFile file, String nome) throws IOException, NoSuchAlgorithmException {

        try {
            if (file.isEmpty()) {
                throw new StorageException("Falha ao salvar arquivo vazio" + file.getOriginalFilename());
            }
            
            MessageDigest m = MessageDigest.getInstance("MD5");
            m.update(nome.getBytes(), 0, new Date().toString().length());

            Files.copy(file.getInputStream(), this.rootLocation.resolve(nome+"_"+m+file.getOriginalFilename()));
        } catch (IOException e) {
            throw new StorageException("Falha ao armazenar " + file.getOriginalFilename(), e);
        }

        return file.getOriginalFilename();
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(path -> this.rootLocation.relativize(path));
        } catch (IOException e) {
            throw new StorageException("Falha ao ler arquivos salvos", e);
        }

    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if(resource.exists() || resource.isReadable()) {
                return resource;
            }
            else {
                throw new StorageException("Não foi possível ler este arquivo: " + filename);

            }
        } catch (MalformedURLException e) {
            throw new StorageException("Não foi possível ler este arquivo: " + filename, e);
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    @Override
    public void init() {
        try {
            Files.createDirectory(rootLocation);
        } catch (IOException e) {
            throw new StorageException("Não foi possível inicializar", e);
        }
    }
}