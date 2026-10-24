window.SIM = window.SIM || {};
SIM.perguntas = [
  {
    id: 'm1a',
    missao: 1,
    pergunta: 'Nos imports do `_layout.tsx` do modelo aparece o caminho `@/components/app-tabs`. O que o `@/` quer dizer?',
    dica: 'Procure, na raiz do projeto, o arquivo de configurações do TypeScript. É lá que ficam os atalhos de caminho.',
    alternativas: ['É o endereço de um site da internet de onde o Expo baixa o arquivo app-tabs.', 'Marca um arquivo que só funciona no navegador, como acontece com o .web.tsx.', 'É um atalho para a pasta src, definido no arquivo tsconfig.json do projeto.', 'Indica um arquivo protegido, que ninguém pode abrir nem mudar pelo editor.'],
    correta: 2,
    explicacao: 'O `@/` é um apelido de caminho definido no tsconfig.json, e ele aponta para a pasta `src`. Assim, `@/components/app-tabs` quer dizer src/components/app-tabs, não importa em qual pasta está o arquivo que faz o import. No nosso app vamos usar caminhos relativos, como `../screens/HomeScreen`, que fazem o mesmo trabalho.',
    feedback: ['Nada é baixado da internet nesse import: o caminho aponta para um arquivo do próprio projeto.', 'Quem marca um arquivo só para o navegador é o final .web.tsx, e não o começo do caminho.', '', 'O atalho não protege nada: todos os arquivos do projeto podem ser abertos e editados.'],
    cartao: { titulo: 'O atalho @/ nos imports', texto: 'O `@/` é um atalho para a pasta `src`, definido no tsconfig.json. Com ele, o mesmo import funciona em qualquer pasta do projeto, sem precisar contar quantos `../` usar.', trecho: 'import AppTabs from \'@/components/app-tabs\';', arquivo: 'src/app/_layout.tsx' }
  },
  {
    id: 'm1b',
    missao: 1,
    pergunta: 'Qual é o papel do _layout.tsx que veio no modelo, e por que vamos trocá-lo?',
    dica: 'Pense no que aparece em todas as telas do app do modelo e procure, no _layout.tsx, quem desenha isso.',
    alternativas: ['Ele envolve todas as telas com abas, e vamos trocá-lo por uma navegação sem abas.', 'Ele guarda o nome e o ícone do app, e vamos trocá-lo para colocar o nosso ícone.', 'Ele inicia o servidor do Metro, e vamos trocá-lo para o app abrir mais rápido.', 'Ele lista as bibliotecas do projeto, e vamos trocá-lo para instalar o Expo Router.'],
    correta: 0,
    explicacao: 'O _layout.tsx da pasta app é o molde que envolve todas as telas. No modelo, ele usa o AppTabs para desenhar as abas Home e Explore, por isso elas aparecem em qualquer tela. Como o nosso app de tarefas não usa essas abas, vamos trocá-lo por uma navegação em pilha, o Stack.',
    feedback: ['', 'O nome e o ícone do app ficam no app.json, e não no _layout.tsx.', 'Quem inicia o Metro é o comando digitado no terminal, não um arquivo da pasta app.', 'Quem lista as bibliotecas é o package.json, e o Expo Router já vem instalado no modelo.'],
    cartao: { titulo: 'O layout raiz', texto: 'O _layout.tsx da pasta app envolve todas as telas do app. No modelo, ele desenha as abas Home e Explore com o AppTabs; no nosso app, ele vai montar uma navegação em pilha, o Stack.', trecho: '<AppTabs />', arquivo: 'src/app/_layout.tsx' }
  },
  {
    id: 'm2a',
    missao: 2,
    pergunta: 'Por que os arquivos da pasta app, como o _layout.tsx, usam export default?',
    dica: 'Pense em quem abre os arquivos da pasta app para descobrir o que desenhar. Ele precisa achar o componente principal sem saber o nome da função.',
    alternativas: ['Porque o export default deixa o componente mais rápido do que um export comum.', 'Porque o TypeScript precisa do export default para conseguir entender o JSX.', 'Porque o export default impede que outros arquivos importem esse mesmo componente.', 'Porque o Expo Router procura o componente exportado por padrão em cada arquivo.'],
    correta: 3,
    explicacao: 'O Expo Router abre cada arquivo da pasta app e usa o componente exportado por padrão como tela ou layout. Por isso o nome da função tanto faz: no modelo ela se chama TabLayout, e no nosso app, Layout. Sem o export default, o Expo Router avisa que ele está faltando e não tem o que mostrar.',
    feedback: ['O tipo de export não muda a velocidade do app. A diferença está em quem procura o componente.', 'O TypeScript entende o JSX com qualquer tipo de export; o export default não muda isso.', 'O export default não bloqueia nada: outros arquivos podem importar o componente normalmente.', ''],
    cartao: { titulo: 'O export default das rotas', texto: 'Cada tela ou layout da pasta app precisa de um export default. É por ele que o Expo Router encontra o componente que vira tela ou layout, sem precisar saber o nome da função.', trecho: 'export default function Layout() {', arquivo: 'src/app/_layout.tsx' }
  },
  {
    id: 'm2b',
    missao: 2,
    pergunta: 'O que faz a linha `<Stack.Screen name="index" options={{ title: "Home" }} />` no _layout.tsx?',
    dica: 'Compare o topo da tela com e sem essa linha. O valor de name combina com o nome de um arquivo da pasta app.',
    alternativas: ['Cria um botão Home que leva o usuário de volta para a primeira tela do app.', 'Aponta para a tela do index.tsx e define Home como o texto do cabeçalho.', 'Cria o arquivo index.tsx e escreve a palavra Home no meio da tela inicial.', 'Coloca a tela do index.tsx dentro de uma aba chamada Home, como no modelo.'],
    correta: 1,
    explicacao: 'O `name="index"` aponta para o arquivo index.tsx da pasta app, e o `options={{ title: "Home" }}` define o texto do cabeçalho dessa tela. Sem essa linha, o Stack usa o nome do arquivo como título, e o cabeçalho mostraria "index".',
    feedback: ['Essa linha não cria nenhum botão: ela configura uma tela que já existe.', '', 'Essa linha não cria arquivos nem escreve nada no meio da tela; o index.tsx é criado por você.', 'O Stack não usa abas como as do modelo: ele empilha as telas e mostra uma por vez.'],
    cartao: { titulo: 'Stack.Screen e o cabeçalho', texto: 'Cada Stack.Screen configura uma tela da pasta app. O name diz qual arquivo é a tela, e o title troca o texto do cabeçalho; sem ele, aparece o nome do arquivo.', trecho: '<Stack>\n  <Stack.Screen name="index" options={{ title: "Home" }} />\n</Stack>', arquivo: 'src/app/_layout.tsx' }
  },
  {
    id: 'm3a',
    missao: 3,
    pergunta: 'Por que guardar cores, tamanhos de fonte e espaçamentos em um só arquivo, o styles.ts?',
    dica: 'Imagine que pediram para trocar o azul do app inteiro por verde. Em quantos lugares você teria de mexer?',
    alternativas: ['Porque assim um valor muda em um só lugar e o app todo segue o mesmo padrão.', 'Porque o React Native só aceita cores guardadas em um arquivo chamado styles.ts.', 'Porque assim o celular gasta menos bateria para desenhar as cores na tela.', 'Porque o TypeScript proíbe escrever cores e tamanhos dentro dos componentes.'],
    correta: 0,
    explicacao: 'Com cores, tamanhos e espaçamentos no styles.ts, os componentes passam a usar os mesmos valores. Se um valor mudar, basta trocar em um lugar e o app inteiro acompanha. Esse conjunto de regras visuais compartilhadas é o design system do app.',
    feedback: ['', 'O React Native aceita estilos em qualquer arquivo; o nome styles.ts foi uma escolha nossa para organizar.', 'Guardar as cores em outro arquivo não muda o gasto de bateria do celular.', 'O TypeScript não proíbe isso: dá para escrever um valor direto dentro de um componente.'],
    cartao: { titulo: 'Design system', texto: 'O styles.ts guarda cores, tamanhos de fonte e espaçamentos com nomes, como colors.text e fontSize.base. Os estilos usam esses nomes em vez de valores soltos, então mudar um valor ali atualiza o app inteiro.', trecho: 'text: {\n  fontSize: fontSize.base,\n  color: colors.text,', arquivo: 'src/styles/styles.ts' }
  },
  {
    id: 'm3b',
    missao: 3,
    pergunta: 'O que o StyleSheet.create realmente oferece ao nosso styles.ts?',
    dica: 'Pense em quem ajuda você enquanto escreve o código, antes mesmo de o app rodar no celular.',
    alternativas: ['Deixa o app muito mais rápido, porque compila os estilos antes de abrir cada tela.', 'Permite usar classes e seletores de CSS, do mesmo jeito que em uma página web.', 'Organiza os estilos por nome, e o TypeScript e o editor conferem as propriedades.', 'Troca as cores sozinho quando o celular entra no modo escuro, sem código extra.'],
    correta: 2,
    explicacao: 'O StyleSheet.create organiza os estilos em um objeto com nomes, como container e sectionTitle. Com ele, o TypeScript e o editor conferem cada propriedade e avisam quando algo está escrito errado. Nas versões atuais, ele devolve basicamente o mesmo objeto que recebeu: o ganho está na organização e na conferência, não na velocidade.',
    feedback: ['O comentário do styles.ts fala em desempenho, mas essa ideia é antiga: hoje o StyleSheet.create devolve basicamente o mesmo objeto que recebeu.', 'O StyleSheet.create não usa classes nem seletores de CSS: ele recebe objetos JavaScript com propriedades.', '', 'O StyleSheet.create não troca cores sozinho; reagir ao modo escuro exige código próprio.'],
    cartao: { titulo: 'StyleSheet.create', texto: 'O StyleSheet.create reúne os estilos com nomes e deixa o TypeScript e o editor conferirem cada propriedade. Nas versões atuais, ele devolve basicamente o mesmo objeto: o ganho é organização, não velocidade.', trecho: 'export const styles = StyleSheet.create({', arquivo: 'src/styles/styles.ts' }
  },
  {
    id: 'm4a',
    missao: 4,
    pergunta: 'A HomeScreen só apareceu no celular depois que o index.tsx passou a importá-la. Por quê?',
    dica: 'Veja em qual pasta o Expo Router procura as telas do app. A pasta screens fica dentro dela?',
    alternativas: ['Porque o Metro só lê a pasta screens depois que o app é reiniciado no celular.', 'Porque o Expo Router só usa as telas da pasta app, e o index.tsx faz a ponte.', 'Porque a tela nova precisava ser cadastrada no package.json antes de aparecer.', 'Porque a HomeScreen tinha um erro, e o index.tsx corrigiu esse erro sozinho.'],
    correta: 1,
    explicacao: 'O Expo Router só transforma em tela o que está na pasta app. O index.tsx é a rota "/", a primeira tela do app, e funciona como ponte: ele importa a HomeScreen da pasta screens e a devolve para ser desenhada. Sem essa ponte, a HomeScreen existe no projeto, mas nenhuma rota a mostra.',
    feedback: ['O Metro percebe as mudanças sem reiniciar o app, e reiniciar não faria a HomeScreen aparecer.', '', 'O package.json lista bibliotecas e comandos, não telas; nenhuma tela é cadastrada nele.', 'A HomeScreen não tinha erro, e o index.tsx não corrige código de outros arquivos.'],
    cartao: { titulo: 'O index.tsx como ponte', texto: 'O Expo Router só mostra o que está na pasta app. O index.tsx é a rota "/" e entrega a HomeScreen, que mora na pasta screens, para ser desenhada.', trecho: 'export default function Index() {\n  return <HomeScreen />;\n}', arquivo: 'src/app/index.tsx' }
  },
  {
    id: 'm4b',
    missao: 4,
    pergunta: 'Por que o index.tsx importa a tela com chaves: `import { HomeScreen } from "../screens/HomeScreen";`?',
    dica: 'Abra o HomeScreen.tsx e veja como a HomeScreen foi exportada. Depois compare com o jeito como o _layout.tsx exporta a função Layout.',
    alternativas: ['Porque as chaves fazem a tela carregar só quando o usuário tocar nela.', 'Porque as telas da pasta screens precisam de chaves para aparecer no celular.', 'Porque as chaves avisam ao TypeScript que o arquivo importado termina em .tsx.', 'Porque a HomeScreen foi exportada com export const, uma exportação nomeada.'],
    correta: 3,
    explicacao: 'A HomeScreen foi criada com export const, uma exportação nomeada, e por isso é importada pelo nome, entre chaves. Sem as chaves, o import procuraria um export default no HomeScreen.tsx, e ele não existe. As chaves dizem: pegue deste arquivo a peça com este nome.',
    feedback: ['As chaves não mudam o momento em que a tela carrega: a HomeScreen aparece assim que o app abre.', 'A pasta onde o arquivo está não decide se o import usa chaves ou não.', 'O TypeScript descobre a extensão do arquivo sozinho, e as chaves não têm relação com o .tsx.', ''],
    cartao: { titulo: 'Exportação nomeada', texto: 'Quem usa export const faz uma exportação nomeada, e quem importa escreve o mesmo nome entre chaves. Já um export default é importado sem chaves.', trecho: 'export const HomeScreen = () => {', arquivo: 'src/screens/HomeScreen.tsx' }
  },
  {
    id: 'm5a',
    missao: 5,
    pergunta: 'Por que o TextInput do TaskInput precisa de value e onChangeText juntos?',
    dica: 'Descubra de onde o campo tira o texto que mostra e quem atualiza esse texto quando você digita.',
    alternativas: ['O value define o tamanho do campo, e o onChangeText define a cor do texto digitado.', 'O value salva a tarefa no celular, e o onChangeText a recupera quando o app abre.', 'O value prende o campo ao taskName, e o onChangeText muda o taskName a cada letra.', 'O value mostra a dica cinza do campo, e o onChangeText envia a tarefa para a lista.'],
    correta: 2,
    explicacao: 'Esse é um campo controlado: o value faz o campo mostrar sempre o que está na memória taskName. A cada letra digitada, o TextInput chama o onChangeText, que aqui é o setTaskName, e a memória muda. Sem o onChangeText, a memória nunca mudaria e o campo ficaria travado.',
    feedback: ['O tamanho e a cor do campo vêm do style, e não dessas duas propriedades.', 'Nada aqui guarda dados no celular: o taskName fica na memória e some quando o app fecha.', '', 'A dica cinza vem do placeholder, e o onChangeText não mexe na lista: quem age ao tocar no botão é o handleAddTask.'],
    cartao: { titulo: 'Campo controlado', texto: 'No campo controlado, o value mostra o que está na memória e o onChangeText atualiza essa memória a cada letra. Os dois trabalham juntos: sem o onChangeText, o campo fica travado.', trecho: 'value={taskName}\nonChangeText={setTaskName}', arquivo: 'src/components/TaskInput.tsx' }
  },
  {
    id: 'm5b',
    missao: 5,
    pergunta: 'No handleAddTask, por que o código usa `trim()` e o `if (!trimmedName)` antes de mostrar a tarefa digitada?',
    dica: 'Descubra o que o `trim()` tira de um texto e o que o `if (!trimmedName)` confere logo depois.',
    alternativas: ['Para barrar uma tarefa vazia ou feita só de espaços antes de seguir em frente.', 'Para deixar a primeira letra maiúscula e corrigir os erros de digitação do nome.', 'Para cortar o nome da tarefa quando ele passar de um certo número de letras.', 'Para apagar o campo de texto antes que o usuário comece a digitar a tarefa.'],
    correta: 0,
    explicacao: 'O `trim()` tira os espaços do começo e do fim do texto. Se não sobrar nada, o trimmedName fica vazio, o if mostra o alerta de erro e o return encerra a função ali. Assim, nenhuma tarefa vazia ou feita só de espaços passa adiante.',
    feedback: ['', 'O `trim()` não mexe em letras maiúsculas nem corrige palavras escritas errado.', 'O `trim()` não olha o tamanho do texto: um nome bem longo continua inteiro.', 'Quem limpa o campo é o `setTaskName("")`, e isso só acontece depois que o nome passa pela checagem.'],
    cartao: { titulo: 'Validar antes de aceitar', texto: 'O `trim()` remove os espaços das pontas do texto. Se o resultado ficar vazio, o if mostra um alerta de erro e o return interrompe a função, impedindo tarefas vazias.', trecho: 'const trimmedName = taskName.trim();\n\nif (!trimmedName) {', arquivo: 'src/components/TaskInput.tsx' }
  },
  {
    id: 'm6a',
    missao: 6,
    pergunta: 'Por que o TaskList lança o erro "TaskList deve estar dentro de TaskProvider"?',
    dica: 'Procure, no TaskContext.tsx, o valor inicial que o contexto recebe no createContext.',
    alternativas: ['Porque a FlatList dá erro quando a lista de tarefas ainda está vazia no começo.', 'Porque o TaskList foi importado antes do TaskProvider no arquivo da tela.', 'Porque o TypeScript achou um erro de tipo na lista de tarefas do TaskList.', 'Porque, sem TaskProvider acima, o useContext devolve undefined e o if avisa.'],
    correta: 3,
    explicacao: 'O useContext procura o TaskProvider mais próximo acima do componente. Se não houver nenhum, ele devolve o valor inicial do contexto, que é undefined. O if percebe isso e lança uma mensagem clara, em vez de deixar o app quebrar mais adiante com um erro confuso.',
    feedback: ['A FlatList funciona com a lista vazia: nesse caso, ela mostra o ListEmptyComponent.', 'A ordem dos imports não causa esse erro; ele depende de onde o TaskList é desenhado.', 'Essa mensagem está escrita no próprio TaskList; o TypeScript confere tipos e não lança erros com o app rodando.', ''],
    cartao: { titulo: 'Contexto sem Provider', texto: 'O useContext só recebe os dados se houver um Provider acima do componente. Sem ele, vem o valor inicial, undefined, e o if lança um erro com uma mensagem clara.', trecho: 'if (!context) {\n  throw new Error("TaskList deve estar dentro de TaskProvider");\n}', arquivo: 'src/components/TaskList.tsx' }
  },
  {
    id: 'm6b',
    missao: 6,
    pergunta: 'Por que o addTask usa `setTasks([...tasks, newTask])` em vez de mudar a lista antiga?',
    dica: 'Pense em como o React descobre que alguma coisa mudou e que a tela precisa ser desenhada de novo.',
    alternativas: ['Porque o JavaScript bloqueia as listas antigas e não deixa mudar nada dentro delas.', 'Porque o React compara a lista nova com a antiga para saber se redesenha a tela.', 'Porque os três pontos apagam as tarefas repetidas antes de montar a lista nova.', 'Porque assim a lista continua salva no celular mesmo depois que o app é fechado.'],
    correta: 1,
    explicacao: 'O React percebe uma mudança comparando a lista nova com a antiga. O `...tasks` copia as tarefas atuais para uma lista nova, e o newTask entra no final; como é outra lista, o React nota a diferença e redesenha a tela. Se a lista antiga fosse alterada, ela continuaria sendo a mesma lista, e o React não perceberia a mudança.',
    feedback: ['O JavaScript deixa, sim, mudar uma lista antiga; o motivo de criar uma lista nova é outro.', '', 'Os três pontos só copiam as tarefas atuais para a lista nova; eles não removem repetidas.', 'Nada aqui salva dados no celular: as tarefas ficam na memória e somem quando o app fecha.'],
    cartao: { titulo: 'Lista nova no estado', texto: 'Para mudar uma lista guardada no estado, crie uma lista nova com a mudança e entregue ao setTasks. O React compara a lista nova com a antiga e, como são listas diferentes, redesenha a tela.', trecho: 'setTasks([...tasks, newTask]);', arquivo: 'src/context/TaskContext.tsx' }
  }
];
