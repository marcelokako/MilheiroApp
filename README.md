# Milheiro App

**Milheiro App** é uma aplicação desenvolvida para ajudar na organização e análise de milhas aéreas. Com ele, você pode cadastrar várias pessoas, gerenciar plataformas de milhas (como Smiles, LATAM Pass, etc.), adicionar pontos com seus custos, e utilizar calculadoras para determinar se é mais vantajoso usar milhas ou dinheiro na compra de passagens.  

A aplicação é uma PWA (Progressive Web App) que pode ser acessada via navegador ou instalada como um app no dispositivo.

## Funcionalidades

### Pessoas
- ✅ Cadastro de nova pessoa.  
- ✅ Alteração de pessoa selecionada.  
- ✅ Alteração de pessoa atualiza o título do app.  
- ✅ Troca rápida entre pessoas no menu lateral.  

### Dashboard
- ✅ Cadastro de nova plataforma de milhas.  
- ✅ Listagem de plataformas em cards exibindo total de pontos e custo médio.  
- ✅ Navegação para listagem detalhada ao clicar em um card.  

### Recorrência
- ✅ Sistema de pontos recorrentes mensais e anuais.  
- ✅ Adição automática de pontos em datas recorrentes configuradas.  

### Pontos
- ✅ Cadastro de pontos com informações de **Pontos**, **Valor Gasto**, e **Origem**.  
- ✅ Cálculo automático do custo médio por ponto.  
- ✅ Opção de adicionar pontos a partir da listagem detalhada ou diretamente pelo menu.  
- ✅ Calculadora para analisar a média de custo dos pontos.  
- ❌ **Usar pontos**: funcionalidade para descontar pontos de uma plataforma ainda não implementada.  
- ❌ **Transferir pontos**: funcionalidade para mover pontos de uma plataforma para outra ainda não implementada.  

## Tecnologias Utilizadas
- **Angular**: para a criação da interface e lógica de funcionamento.  
- **Tailwind CSS**: para estilização responsiva e moderna.  
- **IndexedDB**: banco de dados local para armazenamento das informações diretamente no dispositivo.  
- **PWA**: para permitir instalação e acesso offline.  

## Como Executar o Projeto

1. Clone o repositório:  
  ```bash
  git clone https://github.com/seu-usuario/milheiro-app.git
  cd milheiro-app
```
2. Instale as dependências:
  ```bash
  npm install
```
3. Inicie o servidor de desenvolvimento:
  ```bash
  ng serve
```
4. Acesse o app em http://localhost:4200.

## Futuras Funcionalidades
- Descontar pontos utilizados em passagens ou produtos.  
- Transferência de pontos entre plataformas.  

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.  

