/* Explicações linha por linha e resumos de bloco dos arquivos do app Lista de Tarefas.
   Linhas sem entrada (linhas em branco, fechamentos, propriedades de estilo e comentários simples)
   recebem explicação automática no simulador. */
window.SIM = window.SIM || {};
SIM.explicacoes = SIM.explicacoes || {};

SIM.explicacoes['final:src/app/_layout.tsx'] = {
  papel: 'Arquivo de layout do Expo Router. Ele é lido antes de todas as telas e monta a navegação em pilha (Stack) que envolve o app.',
  unidades: [
    { de: 1, ate: 1, o: 'Traz o componente `Stack` da biblioteca `expo-router`.', p: 'O `Stack` é o navegador em pilha: as telas ficam uma por cima da outra, como cartas, e cada tela ganha um cabeçalho. Sem importar, este arquivo não saberia o que é `Stack`.' },
    { de: 3, ate: 3, o: 'Cria a função `Layout` e entrega ela com `export default`.', p: 'O Expo Router lê primeiro o `_layout.tsx` e usa o componente exportado por padrão para envolver todas as telas. Sem o `default`, ele não acharia esse componente.' },
    { de: 4, ate: 4, o: 'Começa o `return`: o que a função devolve é o que aparece na tela.', p: 'O parêntese deixa escrever o JSX em várias linhas sem o JavaScript se confundir.' },
    { de: 5, ate: 5, o: 'Abre o `<Stack>`, a pilha de telas.', p: 'Tudo que fica dentro do `Stack` vira tela empilhável. É ele que desenha o cabeçalho no topo do app.' },
    { de: 6, ate: 6, o: 'Configura a tela `index` da pilha e dá a ela o título `Home`.', p: '`name="index"` aponta para o arquivo `src/app/index.tsx`. `options={{ title: "Home" }}` troca o texto do cabeçalho: sem esta linha, ele mostraria o nome do arquivo, index. As chaves de fora dizem "aqui vem JavaScript"; as de dentro são o objeto com as opções.' },
  ],
  blocos: {
    pilha: {
      linhas: [3, 9],
      titulo: 'A função Layout: a moldura da navegação',
      oque: 'Cria o componente que o Expo Router usa para envolver todas as telas do app. Ele devolve um `Stack`, que organiza as telas em pilha e desenha o cabeçalho. A pilha ainda está vazia por dentro: o Expo Router coloca nela, sozinho, as telas que encontra na pasta app.',
      funcoes: [
        { nome: 'export default', texto: 'Entrega o componente principal do arquivo. O Expo Router procura exatamente este export.' },
        { nome: 'function Layout()', texto: 'Cria um componente: uma função que devolve o que deve aparecer na tela.' },
        { nome: 'return ( ... )', texto: 'Devolve o JSX. O que está no `return` é o que o React desenha.' },
        { nome: '<Stack>', texto: 'Navegador em pilha do Expo Router: empilha telas e mostra o cabeçalho com título.' },
      ],
    },
    screen: {
      linhas: [5, 7],
      titulo: 'Stack.Screen: configurando uma tela da pilha',
      oque: 'Diz ao `Stack` como mostrar a tela do arquivo `index.tsx`. A única configuração aqui é o título do cabeçalho, que passou de "index" para "Home".',
      funcoes: [
        { nome: 'Stack.Screen', texto: 'Configura uma tela da pilha. Ela não cria a tela: a tela é o arquivo index.tsx.' },
        { nome: 'name="index"', texto: 'Liga a configuração ao arquivo `src/app/index.tsx`. É o nome do arquivo, sem a extensão.' },
        { nome: 'options={{ title: "Home" }}', texto: 'Opções da tela. `title` é o texto que aparece no cabeçalho.' },
        { nome: '/>', texto: 'Fecha a tag na mesma linha, porque o `Stack.Screen` não tem nada dentro.' },
      ],
    },
  },
};

SIM.explicacoes['final:src/app/index.tsx'] = {
  papel: 'Rota inicial do app (o endereço "/"). Funciona como uma ponte: só chama a HomeScreen, que mora na pasta screens.',
  unidades: [
    { de: 1, ate: 1, o: 'Traz a `HomeScreen` do arquivo `../screens/HomeScreen`.', p: 'As chaves estão aí porque a HomeScreen foi exportada com nome (`export const`). O `../` sobe da pasta app para a pasta src, e de lá entra em screens.' },
    { de: 3, ate: 3, o: 'Cria a função `Index` e entrega ela com `export default`.', p: 'Cada arquivo da pasta app é uma rota, e o Expo Router mostra o componente exportado por padrão. Este é o arquivo da rota inicial: a primeira tela que abre.' },
    { de: 4, ate: 4, o: 'Devolve a `<HomeScreen />`.', p: 'O index.tsx não desenha nada sozinho: ele só chama a tela que mora em screens. Assim a rota fica separada da tela, e trocar a tela inicial no futuro é mudar uma linha.' },
  ],
  blocos: {
    ponte: {
      linhas: [1, 5],
      titulo: 'A ponte entre a rota e a tela',
      oque: 'Este arquivo existe só para ligar o endereço inicial do app à HomeScreen. O Expo Router enxerga apenas a pasta app, e a HomeScreen está em screens. O index.tsx faz a ponte: importa a tela e devolve ela.',
      funcoes: [
        { nome: 'import { HomeScreen }', texto: 'Pega a tela de outro arquivo. Com chaves, porque ela foi exportada com nome.' },
        { nome: 'export default function Index()', texto: 'Transforma este arquivo numa tela que o Expo Router reconhece.' },
        { nome: '<HomeScreen />', texto: 'Usa o componente da tela principal. A barra no fim fecha a tag na mesma linha.' },
      ],
    },
  },
};

SIM.explicacoes['final:src/screens/HomeScreen.tsx'] = {
  papel: 'A tela principal do app: a moldura segura (SafeAreaView) com três áreas, o campo de nova tarefa, o filtro e a lista.',
  unidades: [
    { de: 1, ate: 1, o: 'Traz `SafeAreaView`, `Text` e `View` do React Native.', p: 'São as peças básicas da tela: a moldura segura, os textos e as caixas. O VS Code escreveu esta linha pela correção rápida e foi completando conforme os nomes apareciam no código.' },
    { de: 2, ate: 2, o: 'Traz o componente `TaskInput`.', p: 'Sem este import, a linha do `<TaskInput />` não saberia de onde vem o componente, e o app quebraria.' },
    { de: 3, ate: 3, o: 'Traz `spacing` e `styles` do design system.', p: 'A tela usa os estilos prontos e os espaçamentos padronizados do styles.ts, em vez de cores e medidas soltas.' },
    { de: 5, ate: 5, o: 'Cria o componente `HomeScreen` e exporta com nome.', p: 'É uma arrow function guardada numa constante. O `export` deixa outros arquivos usarem a tela, e o nome com maiúscula avisa que é um componente.' },
    { de: 6, ate: 6, o: 'Começa o `return` com o JSX da tela.', p: 'Tudo dentro dos parênteses é o que vai aparecer no celular.' },
    { de: 7, ate: 7, o: 'Abre a `SafeAreaView` com o estilo `styles.safeArea`.', p: 'É a moldura segura: evita que o conteúdo fique embaixo do entalhe da câmera ou da barra de status no iPhone. Nas versões novas do React Native ela aparece como obsoleta (é o aviso amarelo no terminal), e a recomendada é a da biblioteca react-native-safe-area-context.' },
    { de: 8, ate: 8, o: 'Abre a `View` principal com `styles.container`.', p: 'É a caixa que segura as três áreas. O `flex: 1` do estilo faz ela ocupar a tela inteira, com o fundo cinza claro.' },
    { de: 9, ate: 9, o: 'Comentário que marca o lugar do campo de nova tarefa.', p: 'No JSX, comentário fica entre `{/*` e `*/}`. Ele reserva este espaço para o `<TaskInput />`.' },
    { de: 10, ate: 10, o: 'Coloca o componente `<TaskInput />` na tela.', p: 'O campo de nova tarefa mora em outro arquivo. Aqui ele só é encaixado no lugar reservado, como uma peça de montar.' },
    { de: 12, ate: 12, o: 'Comentário que marca a área do filtro.', p: 'Lembra onde vai entrar o filtro por categoria, que ainda será construído.' },
    { de: 13, ate: 13, o: 'Abre a área do filtro com `styles.filterContainer`.', p: 'O estilo deixa esta faixa branca, com borda embaixo e espaço interno. Por enquanto ela só guarda um texto de aviso.' },
    { de: 14, ate: 14, o: 'Escreve o texto Aqui vai o Filtro com o estilo de título de seção.', p: 'No React Native, todo texto precisa estar dentro de um `<Text>`. Este texto é um lembrete visual de que a área ainda será construída.' },
    { de: 17, ate: 17, o: 'Comentário que marca a área da lista.', p: 'Lembra onde vai entrar a lista de tarefas.' },
    { de: 18, ate: 18, o: 'Abre a área da lista com um estilo escrito na própria linha: `flex: 1` e `padding: spacing.lg`.', p: '`flex: 1` faz esta área ocupar todo o espaço que sobrou embaixo. As chaves duplas: as de fora abrem o JavaScript, as de dentro são o objeto de estilo.' },
    { de: 19, ate: 19, o: 'Escreve o texto Aqui vai a Lista.', p: 'Outro lembrete visual: aqui vai entrar o `TaskList` mais adiante.' },
  ],
  blocos: {
    moldura: {
      linhas: [1, 8],
      titulo: 'A moldura da tela',
      oque: 'Cria a tela principal e monta as duas camadas de fora: a `SafeAreaView`, que protege das bordas do celular, e a `View` principal, que ocupa a tela inteira. Os imports no topo dizem de onde vem cada peça usada.',
      funcoes: [
        { nome: 'export const HomeScreen = () =>', texto: 'Cria o componente da tela e deixa outros arquivos usarem.' },
        { nome: 'SafeAreaView', texto: 'Moldura que mantém o conteúdo longe do entalhe e da barra de status.' },
        { nome: 'View', texto: 'Caixa que agrupa e organiza outros elementos, como uma div no HTML.' },
        { nome: 'style={styles.container}', texto: 'Aplica um estilo pronto do design system.' },
        { nome: 'import { ... } from', texto: 'Traz nomes de outros arquivos ou bibliotecas para usar aqui.' },
      ],
    },
    areas: {
      linhas: [9, 20],
      titulo: 'As três áreas da tela',
      oque: 'Divide a tela em três partes: o lugar reservado para o campo de nova tarefa (por enquanto só um comentário), a faixa do filtro e a área da lista. Filtro e lista mostram textos de aviso: são o esqueleto que vai sendo preenchido nas próximas etapas.',
      funcoes: [
        { nome: '{/* ... */}', texto: 'Comentário dentro do JSX. Serve só para quem lê o código.' },
        { nome: 'Text', texto: 'Mostra texto na tela. No React Native, texto solto fora de um Text dá erro.' },
        { nome: 'style={{ flex: 1, padding: spacing.lg }}', texto: 'Estilo escrito na hora: ocupa o espaço que sobra e ganha espaço interno padronizado.' },
        { nome: 'styles.sectionTitle', texto: 'Estilo de título de seção do design system: letra 16, seminegrito, cinza escuro.' },
      ],
    },
    encaixe: {
      linhas: [9, 10],
      titulo: 'O campo no lugar reservado',
      oque: 'Troca o espaço reservado pelo componente de verdade. A HomeScreen não precisa saber como o campo funciona por dentro: ela só encaixa o `<TaskInput />` no lugar certo. Montar telas com peças assim se chama composição.',
      funcoes: [
        { nome: '<TaskInput />', texto: 'Usa o componente criado no outro arquivo. A barra fecha a tag na mesma linha porque ele não tem nada dentro.' },
        { nome: 'import { TaskInput }', texto: 'Diz de onde vem o componente. O caminho `../components/TaskInput` sobe para src e entra em components.' },
      ],
    },
  },
};

SIM.explicacoes['final:src/components/TaskInput.tsx'] = {
  papel: 'O campo de nova tarefa: guarda o que foi digitado na memória (estado), confere se o texto não está vazio e mostra um alerta.',
  unidades: [
    { de: 1, ate: 1, o: 'Traz o `React` e o hook `useState` da biblioteca react.', p: '`useState` é o que dá memória ao componente. O `React` aparece no tipo `React.FC`, na declaração do componente.' },
    { de: 2, ate: 2, o: 'Traz as peças do React Native usadas aqui: `Alert`, `Text`, `TextInput`, `TouchableOpacity` e `View`.', p: 'O VS Code foi completando esta linha a cada correção rápida, em ordem alfabética, sempre que um nome novo apareceu no código.' },
    { de: 3, ate: 3, o: 'Traz `colors`, `spacing` e `styles` do design system.', p: 'Assim o campo usa as mesmas cores e medidas do resto do app.' },
    { de: 5, ate: 5, o: 'Cria o componente `TaskInput` e exporta com nome.', p: '`React.FC` é um tipo do TypeScript que quer dizer "componente de função". Ele ajuda o editor a avisar quando algo é usado do jeito errado.' },
    { de: 6, ate: 6, o: 'Cria a memória `taskName`, que começa vazia (`""`), e a função `setTaskName`, a única que pode mudar essa memória.', p: 'Sem memória, o componente não tem onde guardar o texto digitado. É o `taskName` que segura o texto até o botão ser tocado. Os colchetes separam as duas coisas que o `useState` devolve.' },
    { de: 8, ate: 8, o: 'Cria a função `handleAddTask`, que vai rodar quando o botão for tocado.', p: 'Guardar a ação numa função com nome deixa o JSX limpo: o botão só aponta para ela. Começar com handle é um costume para funções que respondem a um evento.' },
    { de: 9, ate: 9, o: 'Cria `trimmedName`: o texto digitado sem os espaços do começo e do fim.', p: 'O `.trim()` impede uma tarefa feita só de espaços, que pareceria vazia na tela.' },
    { de: 11, ate: 11, o: 'Começa um teste: se `trimmedName` estiver vazio...', p: 'O `!` inverte o valor. Um texto vazio conta como falso, então `!trimmedName` é verdadeiro quando não há nada escrito.' },
    { de: 12, ate: 12, o: 'Mostra um alerta com o título Erro e a mensagem pedindo um nome.', p: 'É assim que o app avisa o usuário do problema, em vez de criar uma tarefa sem nome.' },
    { de: 13, ate: 13, o: 'Para a função aqui com `return`.', p: 'Sem este `return`, o código continuaria e mostraria o alerta de tarefa digitada mesmo com o campo vazio.' },
    { de: 16, ate: 16, o: 'Comentário dizendo que, por enquanto, o app só mostra um alerta.', p: 'Recado para quem lê: este trecho é provisório.' },
    { de: 17, ate: 17, o: 'Comentário dizendo que mais adiante isso vai virar a lista de verdade.', p: 'Mostra o plano: ligar o campo à memória compartilhada da lista (o Context).' },
    { de: 18, ate: 18, o: 'Mostra um alerta com o título Tarefa digitada e o nome da tarefa.', p: 'Por enquanto é a prova de que o botão funciona e leu o texto certo da memória.' },
    { de: 19, ate: 19, o: 'Limpa a memória com `setTaskName("")`.', p: 'Como o campo está ligado à memória pelo `value`, limpar a memória também limpa o campo, pronto para a próxima tarefa.' },
    { de: 22, ate: 22, o: 'Começa o `return` com o JSX do campo.', p: 'Tudo dentro dos parênteses é o que aparece no lugar do `<TaskInput />` na tela.' },
    { de: 23, ate: 23, o: 'Abre a caixa de fora com fundo branco (`colors.white`).', p: 'Garante o fundo branco do bloco, mesmo com a tela cinza atrás.' },
    { de: 24, ate: 24, o: 'Abre a seção com o estilo `styles.section`.', p: 'O estilo dá espaço interno e uma borda embaixo, separando o campo do resto da tela.' },
    { de: 25, ate: 25, o: 'Escreve o título Nova Tarefa.', p: 'Mostra para o usuário para que serve este bloco.' },
    { de: 27, ate: 27, o: 'Abre o `<TextInput>`, o campo onde se digita.', p: 'É o campo de texto do React Native. As linhas de baixo são as props, as configurações do campo. Como ele não tem nada dentro, termina com `/>`.' },
    { de: 28, ate: 28, o: 'Dá ao campo o estilo `styles.input` e uma margem embaixo de `spacing.md`.', p: 'A lista entre colchetes junta dois estilos: o do design system e um ajuste só daqui. Quando os dois mexem na mesma coisa, vale o último.' },
    { de: 29, ate: 29, o: 'Define o texto de exemplo que aparece no campo vazio.', p: 'O placeholder mostra o que digitar e some quando a pessoa começa a escrever.' },
    { de: 30, ate: 30, o: 'Define a cor do texto de exemplo: `colors.lightText`, um cinza claro.', p: 'Deixa claro que é só um exemplo, e não algo já digitado.' },
    { de: 31, ate: 31, o: 'Liga o campo à memória: o campo mostra sempre o valor de `taskName`.', p: 'Isso transforma o campo num campo controlado. Sozinha, porém, esta linha trava o campo, porque nada muda a memória.' },
    { de: 32, ate: 32, o: 'A cada letra digitada, entrega o texto novo para `setTaskName` guardar.', p: 'É a outra metade do campo controlado: sem esta linha, a memória nunca muda e o campo fica travado.' },
    { de: 35, ate: 35, o: 'Abre o `<TouchableOpacity>`, o botão que pode ser tocado.', p: 'Quando tocado, ele fica transparente por um instante, mostrando que recebeu o toque.' },
    { de: 36, ate: 36, o: 'Dá ao botão os estilos `styles.button` e `styles.buttonPrimary`.', p: 'O primeiro dá o formato (espaço interno, cantos arredondados, centralização) e o segundo dá a cor azul de ação principal.' },
    { de: 37, ate: 37, o: 'Diz qual função chamar quando o botão for tocado: `handleAddTask`.', p: 'Sem o `onPress`, o botão pisca mas não faz nada. Repare que vai só o nome da função, sem parênteses: ela é chamada no toque, e não na hora de desenhar.' },
    { de: 39, ate: 39, o: 'Escreve o texto do botão com o estilo `styles.buttonPrimaryText`.', p: 'Texto branco e seminegrito, para ler bem em cima do azul.' },
  ],
  blocos: {
    caixa: {
      linhas: [22, 25],
      titulo: 'A caixa do campo',
      oque: 'Cria o componente e desenha a parte de fora: um bloco branco com o título Nova Tarefa. Ainda não existe campo nem botão. Primeiro o desenho, depois o comportamento.',
      funcoes: [
        { nome: 'export const TaskInput: React.FC', texto: 'Cria o componente e diz ao TypeScript que ele é um componente de função.' },
        { nome: 'style={{ backgroundColor: colors.white }}', texto: 'Estilo escrito na própria linha, com a cor branca do design system.' },
        { nome: 'styles.section', texto: 'Estilo pronto de seção: espaço interno e borda embaixo.' },
        { nome: '<Text>', texto: 'Mostra o título Nova Tarefa.' },
      ],
    },
    memoria: {
      linhas: [6, 6],
      titulo: 'A memória do componente',
      oque: 'Dá ao TaskInput uma memória chamada `taskName`. Até aqui o texto digitado ficava só dentro do campo; agora existe um lugar no componente para guardar esse texto e usá-lo quando o botão for tocado.',
      funcoes: [
        { nome: 'useState("")', texto: 'Cria uma memória (estado) que começa com texto vazio. Quando ela muda, o React redesenha o componente.' },
        { nome: 'taskName', texto: 'O valor guardado: o nome da tarefa que está sendo digitada.' },
        { nome: 'setTaskName', texto: 'A função que troca o valor guardado. Só ela pode mudar o `taskName`.' },
        { nome: 'const [ , ] =', texto: 'Desestruturação: pega as duas coisas que o `useState` devolve e dá um nome a cada uma.' },
      ],
    },
    controlado: {
      linhas: [27, 33],
      titulo: 'O campo controlado',
      oque: 'Liga o campo de texto à memória nos dois sentidos: o campo mostra o que está em `taskName` (`value`) e cada letra digitada atualiza `taskName` (`onChangeText`). Assim a memória e a tela nunca se desencontram.',
      funcoes: [
        { nome: 'TextInput', texto: 'O campo de digitação do React Native.' },
        { nome: 'placeholder', texto: 'Texto de exemplo que aparece quando o campo está vazio.' },
        { nome: 'value={taskName}', texto: 'O campo mostra o que está guardado na memória.' },
        { nome: 'onChangeText={setTaskName}', texto: 'A cada letra, manda o texto novo para a memória.' },
        { nome: 'style={[ ... ]}', texto: 'Junta vários estilos numa lista; o último ganha quando há conflito.' },
      ],
    },
    botao: {
      linhas: [35, 40],
      titulo: 'O botão',
      oque: 'Desenha um botão azul com o texto + Adicionar Tarefa. O `TouchableOpacity` é uma área tocável que fica transparente no toque. Por enquanto ele só tem aparência: ainda não sabe o que fazer quando é tocado.',
      funcoes: [
        { nome: 'TouchableOpacity', texto: 'Área que pode ser tocada e dá um retorno visual (fica transparente) no toque.' },
        { nome: 'style={[styles.button, styles.buttonPrimary]}', texto: 'Junta o formato de botão com a cor de ação principal.' },
        { nome: 'styles.buttonPrimaryText', texto: 'Texto branco e seminegrito para o botão azul.' },
      ],
    },
    funcaoBotao: {
      linhas: [8, 20],
      titulo: 'A função do botão',
      oque: 'Quando o botão é tocado, esta função pega o texto da memória, tira os espaços das pontas e confere se sobrou alguma coisa. Se estiver vazio, mostra um erro e para. Se não, mostra a tarefa num alerta e limpa o campo.',
      funcoes: [
        { nome: '() => { }', texto: 'Arrow function: um jeito curto de criar uma função.' },
        { nome: '.trim()', texto: 'Tira os espaços do começo e do fim de um texto.' },
        { nome: 'if (!trimmedName)', texto: 'Testa se o texto está vazio. O `!` quer dizer "não".' },
        { nome: 'Alert.alert(título, mensagem)', texto: 'Abre uma janela de aviso no celular. No navegador ela não aparece.' },
        { nome: 'return;', texto: 'Para a função ali mesmo, sem rodar o resto.' },
        { nome: 'setTaskName("")', texto: 'Limpa a memória e, por consequência, o campo.' },
      ],
    },
  },
};

SIM.explicacoes['final:src/styles/styles.ts'] = {
  papel: 'O design system do app: cores, tamanhos de fonte, espaçamentos e estilos prontos, guardados num só lugar.',
  unidades: [
    { de: 1, ate: 1, o: 'Traz o `StyleSheet` do React Native.', p: 'É a ferramenta que organiza os estilos com nomes. Vamos usá-la mais abaixo, no `StyleSheet.create`.' },
    { de: 3, ate: 3, o: 'Comentário que abre a seção de cores.', p: 'Organiza o arquivo em partes. Comentários não mudam nada no app.' },
    { de: 4, ate: 4, o: 'Cria e exporta o objeto `colors`, a paleta de cores do app.', p: 'Com `export`, qualquer tela pode importar as cores. Guardar todas aqui garante que o azul do botão seja o mesmo azul em todo lugar.' },
    { de: 5, ate: 5, o: 'Guarda a cor `primary` com o código `#007AFF`, o azul de ação principal.', p: 'Cada cor ganha um nome que diz para que serve. As telas usam `colors.primary` em vez de repetir `#007AFF` por todo lado. O texto depois das duas barras é um comentário.' },
    { de: 19, ate: 19, o: 'Cria e exporta o objeto `fontSize`, os tamanhos de letra do app.', p: 'Cinco tamanhos com nomes (large, medium, base, small e tiny) evitam um app com vinte tamanhos diferentes de letra.' },
    { de: 28, ate: 28, o: 'Cria e exporta o objeto `spacing`, os espaçamentos padronizados.', p: 'Espaços internos e margens sempre saem desta lista (4, 8, 12, 16, 20 e 24). Isso deixa a tela alinhada e com ritmo.' },
    { de: 37, ate: 42, o: 'Comentário de documentação sobre o `StyleSheet.create`.', p: 'O comentário diz que ele compila os estilos e melhora o desempenho, mas nas versões atuais do React Native o `StyleSheet.create` devolve praticamente o mesmo objeto que recebe. O ganho real é organizar os estilos com nomes e deixar o TypeScript e o editor conferirem as propriedades.' },
    { de: 43, ate: 43, o: 'Cria e exporta `styles`, a coleção de estilos prontos, usando `StyleSheet.create`.', p: 'Cada estilo ganha um nome (container, button, input...) e as telas só escrevem `styles.nome`. Se um estilo muda aqui, muda em todas as telas que o usam.' },
    { de: 47, ate: 47, o: 'Começa o estilo `container`.', p: 'É o estilo da caixa principal das telas.' },
    { de: 48, ate: 48, o: '`flex: 1` faz o elemento ocupar todo o espaço disponível.', p: 'Sem isso, a caixa principal teria só a altura do conteúdo, e sobraria um buraco embaixo da tela.' },
    { de: 49, ate: 49, o: 'Pinta o fundo com `colors.background`, o cinza claro da paleta.', p: 'Usar o nome da cor, e não o código, liga este estilo à paleta: se o cinza mudar lá em cima, muda aqui também.' },
  ],
  blocos: {
    cores: {
      linhas: [3, 16],
      titulo: 'A paleta de cores',
      oque: 'Guarda todas as cores do app num objeto com nomes. Cada nome conta para que a cor serve: primary é a ação principal, danger é apagar, success é tarefa concluída. As telas usam esses nomes e nunca repetem os códigos.',
      funcoes: [
        { nome: 'export const colors = { }', texto: 'Cria o objeto e deixa outros arquivos importarem.' },
        { nome: '"#007AFF"', texto: 'Código hexadecimal de uma cor: quanto de vermelho, verde e azul ela tem.' },
        { nome: '// comentário', texto: 'Recado para quem lê o código. Não muda nada no app.' },
        { nome: 'colors.primary', texto: 'É assim que uma tela usa uma cor da paleta.' },
      ],
    },
    fontes: {
      linhas: [18, 25],
      titulo: 'Os tamanhos de letra',
      oque: 'Define cinco tamanhos de fonte com nomes, do maior (large, 24) ao menor (tiny, 12). Os estilos de texto escolhem um deles em vez de inventar um número novo a cada tela.',
      funcoes: [
        { nome: 'export const fontSize = { }', texto: 'Cria e exporta o objeto com os tamanhos.' },
        { nome: 'base: 16', texto: 'O tamanho padrão de leitura no app.' },
        { nome: 'fontSize.base', texto: 'É assim que um estilo usa um desses tamanhos.' },
      ],
    },
    espacos: {
      linhas: [27, 35],
      titulo: 'Os espaçamentos',
      oque: 'Define a régua de espaços do app: de 4 em 4 pontos, do xs (4) ao xxl (24). Margens e espaços internos sempre saem daqui, por isso os elementos ficam alinhados entre si.',
      funcoes: [
        { nome: 'export const spacing = { }', texto: 'Cria e exporta a régua de espaços.' },
        { nome: 'spacing.md', texto: 'É assim que um estilo usa o espaço médio (12).' },
        { nome: 'padding e margin', texto: 'Padding é o espaço de dentro do elemento; margin é o espaço de fora, entre um elemento e outro.' },
      ],
    },
    primeiroEstilo: {
      linhas: [43, 50],
      titulo: 'O primeiro estilo pronto',
      oque: 'Abre a coleção de estilos do app com `StyleSheet.create` e cria o primeiro: `container`, que ocupa a tela inteira com o fundo cinza claro. Repare que ele usa `colors.background`: os estilos se apoiam na paleta.',
      funcoes: [
        { nome: 'StyleSheet.create({ })', texto: 'Organiza os estilos com nomes e ajuda o editor a conferir as propriedades.' },
        { nome: 'container: { }', texto: 'Um estilo com nome. As telas usam com `styles.container`.' },
        { nome: 'flex: 1', texto: 'Ocupa todo o espaço disponível.' },
        { nome: 'backgroundColor', texto: 'Cor de fundo do elemento.' },
      ],
    },
    containers: {
      linhas: [44, 65],
      titulo: 'Moldura e seção',
      oque: 'Completa os estilos de estrutura: `safeArea`, a moldura branca da tela inteira, e `section`, um bloco branco com espaço interno e uma linha embaixo, usado para separar partes da tela.',
      funcoes: [
        { nome: 'safeArea', texto: 'Estilo da SafeAreaView: ocupa tudo e pinta de branco.' },
        { nome: 'section', texto: 'Estilo de seção: fundo branco, borda embaixo e espaço interno.' },
        { nome: 'borderBottomWidth e borderBottomColor', texto: 'Desenham só a linha de baixo, com a espessura e a cor escolhidas.' },
        { nome: 'paddingHorizontal e paddingVertical', texto: 'Espaço interno nas laterais e em cima e embaixo.' },
      ],
    },
    tipografia: {
      linhas: [67, 85],
      titulo: 'Os estilos de texto',
      oque: 'Cria três estilos de texto: `sectionTitle` (título de seção, seminegrito), `text` (texto comum) e `textMuted` (texto secundário, menor e mais claro). Todos usam os tamanhos e as cores já definidos lá em cima.',
      funcoes: [
        { nome: 'fontWeight: "600"', texto: 'Peso da letra. 600 é seminegrito; o valor vai entre aspas no React Native.' },
        { nome: 'color', texto: 'Cor do texto.' },
        { nome: 'marginBottom', texto: 'Espaço de fora, embaixo do texto, separando do próximo elemento.' },
      ],
    },
    botoes: {
      linhas: [87, 128],
      titulo: 'Os botões',
      oque: 'Cria uma base (`button`) e variações que se combinam com ela: a cor principal (`buttonPrimary`), a secundária (`buttonSecondary`) e o tamanho pequeno (`buttonSmall`), cada uma com seu estilo de texto. Num componente, a base e a variação vão juntas, numa lista de estilos.',
      funcoes: [
        { nome: 'button', texto: 'Formato comum a todos os botões: espaço interno, cantos arredondados e conteúdo centralizado.' },
        { nome: 'buttonPrimary', texto: 'A variação azul, para a ação principal da tela.' },
        { nome: 'alignItems e justifyContent', texto: 'Centralizam o conteúdo nos dois sentidos.' },
        { nome: 'borderRadius', texto: 'Arredonda os cantos.' },
      ],
    },
    input: {
      linhas: [130, 141],
      titulo: 'O campo de texto',
      oque: 'Cria o estilo `input` para os campos de digitação: borda fina cinza, cantos arredondados, espaço interno e a letra no tamanho base.',
      funcoes: [
        { nome: 'borderWidth e borderColor', texto: 'Desenham a borda em volta do campo.' },
        { nome: 'fontSize: fontSize.base', texto: 'O texto digitado fica no tamanho padrão de leitura.' },
      ],
    },
    card: {
      linhas: [143, 152],
      titulo: 'O cartão',
      oque: 'Cria o estilo `card`, um bloco branco com borda e cantos arredondados. É ele que vai desenhar cada tarefa da lista.',
      funcoes: [
        { nome: 'card', texto: 'Fundo branco, borda, cantos arredondados e espaço interno.' },
        { nome: 'marginVertical', texto: 'Espaço de fora em cima e embaixo, separando um cartão do outro.' },
      ],
    },
    vazia: {
      linhas: [154, 167],
      titulo: 'A lista vazia',
      oque: 'Cria os estilos da mensagem que aparece quando não há tarefas: uma caixa centralizada e um texto cinza claro, também centralizado.',
      funcoes: [
        { nome: 'emptyContainer', texto: 'Caixa que centraliza a mensagem.' },
        { nome: 'textAlign: "center"', texto: 'Centraliza o texto na linha.' },
      ],
    },
    layouts: {
      linhas: [169, 182],
      titulo: 'Linha flexível e ícone',
      oque: 'Cria `row`, que coloca elementos lado a lado com espaço entre eles, e `icon`, um tamanho grande para ícones e emojis.',
      funcoes: [
        { nome: 'flexDirection: "row"', texto: 'Muda a direção: os filhos ficam lado a lado, e não um embaixo do outro.' },
        { nome: 'justifyContent: "space-between"', texto: 'Empurra os filhos para as pontas, com o espaço sobrando no meio.' },
      ],
    },
    checkbox: {
      linhas: [184, 204],
      titulo: 'O círculo de marcar',
      oque: 'Cria o círculo de marcar tarefas: `checkbox` é o formato (24 por 24, redondo) e as variações mudam a aparência: desmarcado (borda cinza, fundo branco) e marcado (verde).',
      funcoes: [
        { nome: 'borderRadius: 12', texto: 'Metade da largura: transforma o quadrado num círculo.' },
        { nome: 'checkboxChecked', texto: 'A aparência de tarefa concluída, na cor `colors.success`.' },
      ],
    },
    modal: {
      linhas: [206, 228],
      titulo: 'A janela por cima (modal)',
      oque: 'Cria os estilos de um modal: o fundo escuro e transparente que cobre a tela, a caixa branca do meio e o título. Ainda não há modal no app; o estilo já fica pronto para quando houver.',
      funcoes: [
        { nome: '"rgba(0, 0, 0, 0.5)"', texto: 'Preto com 50% de transparência: escurece a tela atrás.' },
        { nome: 'width: "85%" e maxWidth: 400', texto: 'A caixa ocupa 85% da largura, mas nunca passa de 400 pontos.' },
      ],
    },
    filtros: {
      linhas: [230, 264],
      titulo: 'Os filtros',
      oque: 'Cria os estilos da faixa de filtros e dos botões de filtro em forma de pílula, com a versão ativa (azul, texto branco) e a normal. A tela principal já usa o `filterContainer` na área do filtro.',
      funcoes: [
        { nome: 'filterContainer', texto: 'A faixa onde os filtros ficam, lado a lado.' },
        { nome: 'filterButtonActive', texto: 'A aparência do filtro escolhido.' },
        { nome: 'borderRadius: 20', texto: 'Cantos bem arredondados, formato de pílula.' },
      ],
    },
  },
};

SIM.explicacoes['final:src/context/TaskContext.tsx'] = {
  papel: 'A memória compartilhada das tarefas: o molde de uma tarefa, a caixa (Context) e o dono da memória (Provider).',
  unidades: [
    { de: 1, ate: 1, o: 'Traz o `React`, a função `createContext` e o hook `useState`.', p: '`createContext` cria a caixa compartilhada, `useState` guarda a lista dentro do Provider e `React` aparece nos tipos `React.FC` e `React.ReactNode`.' },
    { de: 3, ate: 3, o: 'Cria e exporta a `interface Task`: o molde de uma tarefa.', p: 'Interface é um recurso do TypeScript que descreve o formato de um objeto. Toda tarefa do app vai ter exatamente estes campos, e o editor avisa se faltar algum.' },
    { de: 4, ate: 4, o: 'Toda tarefa tem um `id` do tipo texto (`string`).', p: 'O id é a identidade única da tarefa. A lista usa ele para não confundir uma tarefa com outra.' },
    { de: 5, ate: 5, o: '`name`: o nome da tarefa, em texto.', p: 'É o que aparece escrito no cartão.' },
    { de: 6, ate: 6, o: '`category`: a categoria da tarefa, em texto.', p: 'Vai servir para o filtro por categoria, que ainda será construído.' },
    { de: 7, ate: 7, o: '`completed`: se a tarefa já foi feita, verdadeiro ou falso (`boolean`).', p: 'Marcar uma tarefa como concluída vai mudar este valor.' },
    { de: 8, ate: 8, o: '`createdAt`: a data de criação, guardada como texto.', p: 'Guardar a data permite ordenar ou mostrar quando a tarefa foi criada.' },
    { de: 11, ate: 11, o: 'Cria a interface `TaskContextType`: o que a caixa vai oferecer.', p: 'É o contrato do Context. Quem abrir a caixa sabe que vai encontrar a lista e a função de adicionar.' },
    { de: 12, ate: 12, o: '`tasks`: uma lista de tarefas (`Task[]`).', p: 'Os colchetes depois de Task querem dizer "uma lista de Task".' },
    { de: 13, ate: 13, o: '`addTask`: uma função que recebe um nome e uma categoria e não devolve nada (`void`).', p: 'Descreve o formato da função antes de ela existir, para o TypeScript conferir quem for usá-la.' },
    { de: 16, ate: 16, o: 'Cria e exporta a caixa `TaskContext` com `createContext`.', p: 'O tipo entre `< >` diz o que pode estar dentro: o conteúdo do contrato ou `undefined`, que quer dizer vazio.' },
    { de: 17, ate: 17, o: 'O valor inicial da caixa é `undefined`.', p: 'Enquanto nenhum Provider encher a caixa, quem procurar por ela recebe `undefined`. É isso que o TaskList vai conferir.' },
    { de: 20, ate: 20, o: 'Cria a interface `TaskProviderProps`: as props que o Provider recebe.', p: 'Diz que o Provider recebe `children`.' },
    { de: 21, ate: 21, o: '`children`: tudo o que for colocado dentro do Provider.', p: '`React.ReactNode` quer dizer "qualquer coisa que o React consegue desenhar". O Provider vai envolver essas partes do app.' },
    { de: 24, ate: 24, o: 'Cria e exporta o componente `TaskProvider`.', p: 'Ele é o dono da memória compartilhada: guarda a lista e entrega a caixa cheia para quem estiver dentro dele.' },
    { de: 25, ate: 25, o: 'Cria a memória `tasks`, que começa como uma lista vazia (`[]`), e a função `setTasks`.', p: 'O `<Task[]>` avisa ao TypeScript que esta memória é uma lista de tarefas.' },
    { de: 27, ate: 27, o: 'Cria a função `addTask`, que recebe o nome e a categoria.', p: 'É a porta de entrada da lista. Quem estiver dentro do Provider vai chamar esta função para adicionar uma tarefa.' },
    { de: 28, ate: 28, o: 'Monta uma tarefa nova seguindo o molde `Task`.', p: 'O `: Task` faz o TypeScript conferir que nenhum campo ficou faltando.' },
    { de: 29, ate: 29, o: 'Cria o `id` a partir da hora atual em milissegundos (`Date.now()`), transformada em texto.', p: 'Como o número de milissegundos muda o tempo todo, cada tarefa ganha um id diferente.' },
    { de: 30, ate: 30, o: '`name`: usa o nome recebido.', p: 'Escrever só `name` é um atalho para `name: name`, porque o campo e a variável têm o mesmo nome.' },
    { de: 31, ate: 31, o: '`category`: usa a categoria recebida.', p: 'O mesmo atalho da linha de cima.' },
    { de: 32, ate: 32, o: 'Toda tarefa nova começa como não concluída (`false`).', p: 'Quem acabou de criar uma tarefa ainda não a fez.' },
    { de: 33, ate: 33, o: 'Guarda a data e a hora de agora em texto, no formato padrão ISO.', p: 'Esse formato pode ser lido de volta como data em qualquer lugar.' },
    { de: 35, ate: 35, o: 'Atualiza a memória com uma lista nova: tudo o que já existia mais a tarefa nova.', p: 'Os três pontos (`...`) copiam as tarefas antigas para a lista nova. Criar uma lista nova, em vez de mexer na antiga, é o que faz o React perceber a mudança e redesenhar a tela.' },
    { de: 38, ate: 38, o: 'Junta `tasks` e `addTask` num objeto chamado `value`.', p: 'É o conteúdo que vai dentro da caixa. O `: TaskContextType` confere que ele segue o contrato.' },
    { de: 40, ate: 40, o: 'Devolve o `TaskContext.Provider` com o `value`, envolvendo os `children`.', p: 'Tudo o que estiver dentro do Provider consegue abrir a caixa e pegar a lista e a função. Fora dele, a caixa continua vazia.' },
  ],
  blocos: {
    molde: {
      linhas: [3, 9],
      titulo: 'O molde de uma tarefa',
      oque: 'Descreve o formato de toda tarefa do app: um id, um nome, uma categoria, se está concluída e a data de criação. Não guarda nenhuma tarefa: é só o molde que o TypeScript usa para conferir o código.',
      funcoes: [
        { nome: 'interface', texto: 'Descreve o formato de um objeto no TypeScript.' },
        { nome: 'string', texto: 'Tipo texto.' },
        { nome: 'boolean', texto: 'Tipo verdadeiro ou falso.' },
        { nome: 'export', texto: 'Deixa outros arquivos, como o TaskItem, usarem o molde.' },
      ],
    },
    contrato: {
      linhas: [11, 14],
      titulo: 'O contrato da caixa',
      oque: 'Diz o que a caixa compartilhada vai entregar: a lista de tarefas e a função para adicionar uma tarefa nova.',
      funcoes: [
        { nome: 'Task[]', texto: 'Uma lista de tarefas no formato do molde.' },
        { nome: '(name: string, category: string) => void', texto: 'O formato de uma função: o que ela recebe e o que devolve. `void` quer dizer que não devolve nada.' },
      ],
    },
    caixa: {
      linhas: [16, 25],
      titulo: 'A caixa e o dono da memória',
      oque: 'Cria a caixa compartilhada, que começa vazia (`undefined`), e o componente `TaskProvider`, que guarda a lista de tarefas com `useState`. A ideia é: quem estiver dentro do Provider enxerga a mesma lista.',
      funcoes: [
        { nome: 'createContext', texto: 'Cria uma caixa de dados que vários componentes podem abrir.' },
        { nome: 'undefined', texto: 'Valor que quer dizer "não tem nada aqui". É o conteúdo da caixa sem Provider.' },
        { nome: 'children', texto: 'Tudo o que for colocado dentro do Provider.' },
        { nome: 'useState<Task[]>([])', texto: 'Memória que começa como lista vazia e só aceita tarefas.' },
      ],
    },
    adicionar: {
      linhas: [27, 36],
      titulo: 'A função que adiciona',
      oque: 'Recebe um nome e uma categoria, monta uma tarefa completa (id, nome, categoria, não concluída, data de agora) e guarda numa lista nova com as tarefas antigas mais a nova.',
      funcoes: [
        { nome: 'Date.now().toString()', texto: 'O momento atual em milissegundos, em texto. Serve de id único.' },
        { nome: 'new Date().toISOString()', texto: 'A data e a hora de agora, no formato padrão.' },
        { nome: '[...tasks, newTask]', texto: 'Uma lista nova com tudo o que havia mais a tarefa nova.' },
        { nome: 'setTasks', texto: 'Troca a lista guardada. O React percebe e redesenha quem usa a lista.' },
      ],
    },
    entrega: {
      linhas: [38, 41],
      titulo: 'Entregando a caixa',
      oque: 'Coloca a lista e a função dentro do `value` e devolve o `Provider` envolvendo os `children`. A partir daí, qualquer componente dentro dele consegue abrir a caixa com `useContext`.',
      funcoes: [
        { nome: 'value', texto: 'O conteúdo que vai dentro da caixa.' },
        { nome: 'TaskContext.Provider', texto: 'O componente que enche a caixa para quem está dentro dele.' },
        { nome: '{children}', texto: 'Desenha, dentro do Provider, tudo o que ele recebeu.' },
      ],
    },
  },
};

SIM.explicacoes['final:src/components/TaskItem.tsx'] = {
  papel: 'O cartão de uma tarefa: recebe a tarefa pela prop task e desenha o círculo de marcar e o nome.',
  unidades: [
    { de: 1, ate: 1, o: 'Traz o `React` para usar o tipo `React.FC`.', p: 'O tipo ajuda o editor a conferir as props do componente.' },
    { de: 2, ate: 2, o: 'Traz `Text` e `View` do React Native.', p: 'São as peças do cartão: as caixas e o texto do nome.' },
    { de: 3, ate: 3, o: 'Traz o molde `Task` do arquivo do contexto.', p: 'Assim o cartão sabe exatamente o formato da tarefa que vai receber.' },
    { de: 4, ate: 4, o: 'Traz `spacing` e `styles` do design system.', p: 'O cartão usa estilos prontos: card, row, checkbox e text.' },
    { de: 6, ate: 6, o: 'Cria a interface `TaskItemProps`: as props que o cartão recebe.', p: 'Props são as informações que o componente pai entrega ao filho, como os argumentos de uma função.' },
    { de: 7, ate: 7, o: '`task` é uma tarefa no formato `Task`.', p: 'Se alguém tentar entregar outra coisa, o TypeScript avisa no editor.' },
    { de: 10, ate: 10, o: 'Cria o componente `TaskItem`, que recebe a prop `task`.', p: 'O `{ task }` entre parênteses já tira a tarefa de dentro das props, pronta para usar.' },
    { de: 11, ate: 11, o: 'Começa o `return` com o desenho do cartão.', p: 'O que está nos parênteses é o que aparece para cada tarefa da lista.' },
    { de: 12, ate: 12, o: 'Abre o cartão com o estilo `styles.card` e uma margem lateral de `spacing.md`.', p: 'O card dá fundo branco, borda e cantos arredondados. A margem lateral é um ajuste só deste uso.' },
    { de: 13, ate: 13, o: 'Abre uma linha (`styles.row`) para colocar os itens lado a lado.', p: 'O estilo row usa `flexDirection: "row"`: o círculo e o texto ficam um ao lado do outro.' },
    { de: 14, ate: 14, o: 'Desenha o círculo de marcar, ainda desmarcado.', p: 'Junta o formato (`styles.checkbox`) com a aparência de desmarcado (`styles.checkboxUnchecked`). Por enquanto ele só aparece; tocar nele ainda não faz nada.' },
    { de: 15, ate: 15, o: 'Abre uma caixa com `flex: 1` para o texto.', p: 'Ela ocupa todo o espaço que sobra depois do círculo, e um nome comprido quebra de linha em vez de sair do cartão.' },
    { de: 16, ate: 16, o: 'Escreve o nome da tarefa (`task.name`) com o estilo `styles.text`.', p: 'As chaves mostram um valor do JavaScript dentro do JSX: aqui, o nome que veio na prop.' },
  ],
  blocos: {
    props: {
      linhas: [6, 8],
      titulo: 'As props do cartão',
      oque: 'Descreve o que o cartão recebe de quem o usa: uma tarefa, no formato do molde `Task`. O import do molde veio pela correção rápida.',
      funcoes: [
        { nome: 'interface TaskItemProps', texto: 'O formato das props deste componente.' },
        { nome: 'task: Task', texto: 'A prop task tem que ser uma tarefa completa.' },
      ],
    },
    cartao: {
      linhas: [10, 21],
      titulo: 'O desenho do cartão',
      oque: 'Desenha uma tarefa: um cartão branco com uma linha dentro, onde ficam o círculo de marcar e o nome. Cada tarefa da lista vai usar este mesmo componente com um `task` diferente.',
      funcoes: [
        { nome: '({ task })', texto: 'Pega a prop task direto na entrada do componente.' },
        { nome: 'style={[styles.card, { ... }]}', texto: 'Estilo pronto mais um ajuste local, juntos numa lista.' },
        { nome: '{task.name}', texto: 'Mostra no JSX o nome guardado na tarefa.' },
        { nome: '/>', texto: 'Fecha na mesma linha a View do círculo, que não tem nada dentro.' },
      ],
    },
  },
};

SIM.explicacoes['final:src/components/TaskList.tsx'] = {
  papel: 'A lista de tarefas: abre a caixa do contexto, confere se ela existe e mostra as tarefas com uma FlatList ou a mensagem de lista vazia.',
  unidades: [
    { de: 1, ate: 1, o: 'Traz o `React` e o hook `useContext`.', p: '`useContext` é a mão que abre a caixa compartilhada.' },
    { de: 2, ate: 2, o: 'Traz `FlatList`, `Text` e `View` do React Native.', p: 'A `FlatList` é a lista que desenha as tarefas de um jeito eficiente.' },
    { de: 3, ate: 3, o: 'Traz a caixa `TaskContext`.', p: 'O `useContext` precisa saber qual caixa abrir.' },
    { de: 4, ate: 4, o: 'Traz `colors`, `spacing` e `styles` do design system.', p: 'Para o fundo, os espaços e os estilos da lista vazia.' },
    { de: 5, ate: 5, o: 'Traz o cartão `TaskItem`.', p: 'Cada tarefa da lista vai ser desenhada com ele.' },
    { de: 7, ate: 7, o: 'Cria e exporta o componente `TaskList`.', p: 'Ele não recebe props: pega tudo o que precisa direto do contexto.' },
    { de: 8, ate: 8, o: 'Abre a caixa `TaskContext` e guarda o que veio em `context`.', p: 'O `useContext` procura o Provider mais próximo acima deste componente. Se não houver nenhum, recebe o valor inicial da caixa: `undefined`.' },
    { de: 10, ate: 10, o: 'Testa se a caixa veio vazia.', p: 'Se o TaskList for usado fora de um TaskProvider, `context` será `undefined`.' },
    { de: 11, ate: 11, o: 'Lança um erro com uma mensagem clara.', p: '`throw new Error` para o app e mostra a mensagem na tela de erro. É melhor avisar o motivo exato do que quebrar depois com um erro confuso.' },
    { de: 14, ate: 14, o: 'Tira a lista `tasks` de dentro do `context`.', p: 'Desestruturação: um jeito curto de pegar um campo de um objeto. O comentário avisa que, mais adiante, aqui entra a lista já filtrada.' },
    { de: 16, ate: 16, o: 'Cria a função `renderEmptyList`, que devolve o desenho da lista vazia.', p: 'O parêntese depois da seta devolve o JSX direto, sem precisar escrever `return`.' },
    { de: 17, ate: 17, o: 'Abre a caixa da mensagem com `styles.emptyContainer`.', p: 'O estilo centraliza o conteúdo e dá espaço nas laterais.' },
    { de: 18, ate: 18, o: 'Mostra um emoji de caixa de correio vazia.', p: 'Um desenho ajuda a entender, de longe, que não há nada na lista.' },
    { de: 19, ate: 21, o: 'Mostra a frase Nenhuma tarefa por aqui!, com uma margem em cima.', p: 'O estilo em lista junta o texto padrão da lista vazia com um ajuste de margem.' },
    { de: 22, ate: 24, o: 'Mostra a dica Adicione uma nova tarefa acima, em letra menor.', p: 'Uma lista vazia que diz o que fazer é mais útil do que uma tela em branco.' },
    { de: 28, ate: 28, o: 'Começa o `return` com o desenho da lista.', p: 'É o que aparece no lugar do `<TaskList />` quando ele for usado numa tela.' },
    { de: 29, ate: 29, o: 'Abre a caixa da lista: ocupa o espaço que sobra, com o fundo cinza claro.', p: '`flex: 1` faz a lista crescer até o fim da tela.' },
    { de: 30, ate: 30, o: 'Abre a `FlatList`.', p: 'Ela desenha só os itens que aparecem na tela, então continua rápida mesmo com muitas tarefas.' },
    { de: 31, ate: 31, o: '`data`: a lista de dados que a FlatList vai mostrar, aqui as `tasks`.', p: 'Sem `data`, a FlatList não teria o que desenhar.' },
    { de: 32, ate: 32, o: '`renderItem`: diz como desenhar cada item. Para cada `item`, devolve um `<TaskItem>` com a tarefa.', p: 'A FlatList chama esta função uma vez para cada tarefa da lista.' },
    { de: 33, ate: 33, o: '`keyExtractor`: diz qual campo é a chave única de cada item, aqui o `id`.', p: 'Com a chave, o React sabe qual tarefa é qual quando a lista muda, e não mistura os itens.' },
    { de: 34, ate: 34, o: 'Dá um espaço em cima e embaixo do conteúdo da lista.', p: 'Usa `spacing.md`, o espaçamento médio do design system.' },
    { de: 35, ate: 35, o: '`ListEmptyComponent`: o que mostrar quando a lista estiver vazia.', p: 'Aponta para a função `renderEmptyList`. Assim, em vez de uma tela em branco, aparece a mensagem.' },
  ],
  blocos: {
    seguranca: {
      linhas: [7, 12],
      titulo: 'Abrindo a caixa com segurança',
      oque: 'O TaskList abre a caixa compartilhada com `useContext` e logo confere se ela veio vazia. Se vier, é sinal de que ele foi colocado fora de um TaskProvider, e o código para com uma mensagem que explica exatamente o problema.',
      funcoes: [
        { nome: 'useContext(TaskContext)', texto: 'Lê o conteúdo da caixa no Provider mais próximo acima.' },
        { nome: 'if (!context)', texto: 'Testa se a caixa veio vazia (undefined).' },
        { nome: 'throw new Error("...")', texto: 'Interrompe o app com uma mensagem de erro escrita por você.' },
      ],
    },
    lista: {
      linhas: [28, 38],
      titulo: 'A FlatList',
      oque: 'Desenha a lista de tarefas. A FlatList recebe os dados (`data`), sabe desenhar cada item (`renderItem`, com o TaskItem) e sabe identificar cada item pela chave (`keyExtractor`).',
      funcoes: [
        { nome: 'FlatList', texto: 'Lista otimizada do React Native: desenha só o que aparece na tela.' },
        { nome: 'data', texto: 'A lista de dados que será mostrada.' },
        { nome: 'renderItem', texto: 'Função que desenha um item. Recebe `{ item }` e devolve o JSX.' },
        { nome: 'keyExtractor', texto: 'Função que devolve a chave única de cada item.' },
        { nome: 'contentContainerStyle', texto: 'Estilo da área de dentro da lista, onde ficam os itens.' },
      ],
    },
    vazia: {
      linhas: [14, 26],
      titulo: 'A mensagem de lista vazia',
      oque: 'Pega a lista do contexto e prepara o que mostrar quando ela estiver vazia: um emoji, uma frase e uma dica. A FlatList usa essa função pelo `ListEmptyComponent`.',
      funcoes: [
        { nome: 'const { tasks } = context', texto: 'Desestruturação: pega o campo tasks de dentro do objeto.' },
        { nome: '() => ( ... )', texto: 'Arrow function que devolve o JSX direto, sem a palavra return.' },
        { nome: 'ListEmptyComponent', texto: 'Prop da FlatList com o que mostrar quando não há itens.' },
        { nome: 'style={[styles.emptyText, { ... }]}', texto: 'Estilo padrão mais um ajuste, juntos numa lista.' },
      ],
    },
  },
};
