# Grupo3
#### Descrição
##### A aplicação  Programa integrado de gerenciamento de ACG (P.IN.G.A) é um sistema cujo o principal objetivo é o gerenciamento de ACGs. Ele foi desenvolvido pelos alunos de Engenharia de Software na disciplina de Resolução de Problemas VI. As principais funcionalidades são descritas nas seguintes histórias de usuário:

**História de Usuário**
HU4: Como discente eu quero solicitar (incluir e excluir) o aproveitamento de ACG's, anexando as comprovações necessárias.
HU2: Como coordenador eu quero avaliar (incluir e excluir) as solicitações de ACG's feitas pelos discentes dos cursos.
HU6: Como coordenador ou discente eu quero consultar as solicitações de ACG's incluindo suas respectivas avaliações


---
#### Tecnologias
Este sistema foi desenvolvido utilizando as tecnologias Java Spring Boot (backend), Hibernate (Banco de dados relacional) e React (Frontend). Este projeto é de cunho prático, ou seja, é um sistema cujo foi possivel mostrar um pouco das habilidades dos desenvolvedores


---
#### Execução do Projeto
**O que será necessário:**
1. Chocolatey (gerenciador de pacotes)
2. Java
3. Maven (gerenciador de pacotes do Java/Spring)
4. Xampp
5. VSCode ou Netbeans
6. Yarn

Importante: Estar conectado a internet!

Preparação do ambiente passo a passo:
A) Instalar Chocolatey:
1. Abra o cmd como Administrador
2. Cole o seguinte comando no prompt:
Set-ExecutionPolicy Bypass -Scope Process -Force; iex
((New-Object
System.Net.WebClient).DownloadString('https://chocolatey
.org/install.ps1'))
3. Execute o comando choco --version para saber se a instalação ocorreu
com sucesso

B) Instalar Java:
1. Abra o cmd como Administrador
2. Digite o comando choco install -y jdk8 e tecle enter
3. Caso tenha ocorrido um erro na instalação (como a queda de luz/falta de
bateria do notebook/update do windows) execute o comando choco
install -y --force jdk8 e tecle enter

C) Instalar o Maven:
1. Abra o cmd como Administrador
2. Digite o comando choco install -y maven e tecle enter
3. Caso tenha ocorrido um erro na instalação (como a queda de luz/falta
de bateria do notebook/update do windows) execute o comando choco
install -y --force maven tecle enter

D) Instalar Xampp:
1. Digite o comando choco install -y bitnami-xampp e tecle
enter
2. Caso tenha ocorrido um erro na instalação (como a queda de
luz/falta de bateria do notebook/update do windows) execute o
comando choco install -y --force bitnami-xampp tecle
enter

E) Instalar VSCode:
1. Digite o comando choco install -y vscodee tecle enter
2. Caso tenha ocorrido um erro na instalação (como a queda de
luz/falta de bateria do notebook/update do windows) execute o
comando choco install -y --force vscode tecle enter
3. Instale as seguintes extensões (para conseguir
executar projetos SpringBoot):
- Spring Boot Extension Pack
- Java Extension Pack
- Lombok Annotations Support for VS Code

OU

Instalar NetBeans:
1. Digite o comando choco install netbeans e tecle enter
Não é necessário fazer mais configurações.

F) Instalar Yarn
1. Digite o comando choco install yarn --version=1.7.0 e tecle enter

------------------------------------------------------------------------------------

Para executar o sistema:
1. Abra o Xampp:
a) Start apache;
b) Start MySQl;

2. Intale as dependencias do projeto com o comando: mvn spring-boot:run

3. Executar backend:
a) Caso utilize o netbeans limpe/construa e execute o sistema pela interface do sistema;
b) Caso utilize VSCode execute o sistema pela opção "Run" que aparece em cima do método main da classe principal.

4. Instale as dependecias do frontend com o comando: yarn install

5. Executar frontend: yarn run start
