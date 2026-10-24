window.SIM = window.SIM || {};
SIM.explicacoes = SIM.explicacoes || {};
SIM.explicacoes['modelo:.gitignore'] = {
  resumo: {
    titulo: 'O que o Git deve ignorar',
    oque: 'O `.gitignore` lista os arquivos e pastas que o Git não deve guardar nem enviar para o GitHub. Entram aqui coisas que podem ser recriadas, como `node_modules/`, e coisas que não devem ser compartilhadas, como chaves e configurações locais.',
    funcoes: []
  },
  unidades: [
    { de: 1, ate: 10, o: 'Cada linha é um padrão de arquivo ou pasta que o Git deve ignorar, e as linhas com `#` são comentários. Aqui entram a pasta `node_modules/` (as bibliotecas baixadas) e pastas e arquivos gerados pelo Expo, como `.expo/` e `dist/`.', p: 'Esses arquivos podem ser recriados a qualquer momento (por exemplo, com `npm install`), então não precisam ir para o GitHub.' },
    { de: 11, ate: 35, o: 'Ignora arquivos de chaves e certificados (como `*.jks`, `*.p8` e `*.key`), arquivos temporários, registros de erro (`npm-debug.*`), o `.DS_Store` do macOS e os arquivos `.env*.local`, com configurações locais.', p: 'Chaves e configurações locais podem ter senhas e segredos. Mandar isso para a internet seria perigoso.' },
    { de: 36, ate: 43, o: 'Ignora arquivos de cache do TypeScript (`*.tsbuildinfo`), a pasta `example` (criada pelo `npm run reset-project`) e as pastas nativas `/ios` e `/android`.', p: 'As pastas nativas são geradas automaticamente pelo Expo a partir das configurações do projeto, por isso o modelo não as guarda.' }
  ]
};
SIM.explicacoes['modelo:.vscode/extensions.json'] = {
  resumo: {
    titulo: 'Extensões recomendadas',
    oque: 'Este arquivo diz ao VS Code quais extensões recomendar para quem abrir o projeto. Aqui ele recomenda a extensão oficial do Expo.',
    funcoes: []
  },
  unidades: [
    { de: 1, ate: 1, o: 'Recomenda ao VS Code a extensão `expo.vscode-expo-tools`, as ferramentas oficiais do Expo para o editor.', p: 'Quando alguém abre o projeto, o VS Code sugere instalar essa extensão, que ajuda, por exemplo, a escrever o `app.json`.' }
  ]
};
SIM.explicacoes['modelo:.vscode/settings.json'] = {
  resumo: {
    titulo: 'Configurações do editor',
    oque: 'Este arquivo guarda configurações do VS Code só para este projeto. Ele liga ações automáticas que arrumam o código quando você salva um arquivo.',
    funcoes: []
  },
  unidades: [
    { de: 1, ate: 7, o: 'Liga três ações ao salvar: corrigir problemas que têm correção automática (`source.fixAll`), organizar os imports (`source.organizeImports`) e ordenar os membros (`source.sortMembers`). O valor `"explicit"` faz essas ações rodarem quando você salva de propósito, por exemplo com Ctrl+S.', p: 'Assim o código fica mais arrumado sem esforço, toda vez que você salva.' }
  ]
};
SIM.explicacoes['modelo:README.md'] = {
  resumo: {
    titulo: 'O manual de boas-vindas',
    oque: 'O `README.md` é o manual de boas-vindas do projeto, escrito em Markdown. Ele explica como instalar e iniciar o app, como limpar o código de exemplo e onde aprender mais sobre o Expo.',
    funcoes: [
      { nome: 'npx expo start', texto: 'Inicia o servidor de desenvolvimento do Expo, que entrega o app para o celular, o emulador ou o navegador.' }
    ]
  },
  unidades: [
    { de: 1, ate: 18, o: 'O título dá boas-vindas e diz que o projeto foi criado com o `create-expo-app`. A seção Get started ensina os dois primeiros passos: instalar as dependências com `npm install` e iniciar o app com `npx expo start`.', p: 'O README é o manual de instruções do projeto, a primeira coisa que alguém lê ao abrir o repositório.' },
    { de: 19, ate: 27, o: 'Lista os lugares onde o app pode ser aberto: development build, emulador Android, simulador iOS e Expo Go. Também avisa que o projeto usa rotas baseadas em arquivos.', p: 'O texto fala da pasta app. Neste modelo, ela fica em `src/app`.' },
    { de: 28, ate: 43, o: 'Explica o comando `npm run reset-project`, que separa o código de exemplo e cria uma pasta de app limpa. Depois, indica guias para configurar ESLint, testes com Jest e TypeScript.', p: 'O texto fala em pasta `app-example`, mas o script deste modelo move o código para a pasta `example`.' },
    { de: 44, ate: 56, o: 'Traz links para aprender mais (documentação e tutorial do Expo) e para participar da comunidade (GitHub e Discord).', p: 'São bons lugares para tirar dúvidas e continuar estudando.' }
  ]
};
SIM.explicacoes['modelo:app.json'] = {
  resumo: {
    titulo: 'As configurações do app',
    oque: 'O `app.json` guarda as configurações do app: nome, ícone, orientação, tela de abertura, plugins e recursos experimentais. O Expo lê este arquivo para montar o app em cada plataforma.',
    funcoes: [
      { nome: 'plugins', texto: 'Ajustes aplicados ao projeto nativo, como a configuração da tela de abertura.' },
      { nome: 'userInterfaceStyle', texto: 'Diz se o app segue o tema do aparelho (`automatic`) ou fica sempre claro ou sempre escuro.' }
    ]
  },
  unidades: [
    { de: 1, ate: 9, o: 'Configurações gerais: nome, `slug` (nome curto usado pelos serviços do Expo), versão, orientação em pé (`portrait`), ícone, `scheme` (nome usado nos links que abrem o app direto) e `"userInterfaceStyle": "automatic"`, que segue o tema claro ou escuro do aparelho.', p: 'É daqui que o Expo tira as informações básicas para montar o app.' },
    { de: 10, ate: 25, o: 'Configurações de cada plataforma: o ícone do iOS, o ícone adaptável do Android (com cor de fundo e imagens em camadas) e, na web, o modo de saída `static` e o ícone da aba do navegador (`favicon`).', p: 'Cada sistema tem suas exigências de ícone. O `"output": "static"` faz a versão web ser gerada como páginas HTML prontas.' },
    { de: 26, ate: 36, o: 'Os `plugins` ajustam o projeto nativo. O `expo-router` aplica as configurações que o Expo Router precisa, e o `expo-splash-screen` configura a tela de abertura: fundo azul `#208AEF`, a imagem `splash-icon.png` e a largura da imagem (76).', p: 'Esse azul e essa largura são os mesmos da camada `AnimatedSplashOverlay`. Por isso, a troca da tela nativa pela camada do app fica difícil de perceber.' },
    { de: 37, ate: 42, o: 'Os `experiments` ligam recursos experimentais: `typedRoutes`, que gera tipos para as rotas, e `reactCompiler`, o React Compiler, uma ferramenta do React que aplica otimizações automáticas no código dos componentes.', p: 'Com o `typedRoutes`, o editor avisa se você escrever o endereço de uma tela que não existe.' }
  ]
};
SIM.explicacoes['modelo:package.json'] = {
  resumo: {
    titulo: 'A ficha do projeto',
    oque: 'O `package.json` é a ficha do projeto para o npm. Ele lista as bibliotecas (dependências) com suas versões e os scripts, que são atalhos de comandos. Também diz, no campo `main`, que quem inicia o app é o Expo Router.',
    funcoes: [
      { nome: 'main', texto: 'Diz o que inicia o app. Aqui é o `expo-router/entry`, do Expo Router.' },
      { nome: 'dependencies', texto: 'As bibliotecas que o app precisa para funcionar.' },
      { nome: 'scripts', texto: 'Atalhos para os comandos usados no dia a dia.' }
    ]
  },
  unidades: [
    { de: 1, ate: 4, o: 'O `name` é o nome do projeto e o `version` é a versão dele. O `"main": "expo-router/entry"` diz que quem inicia o app é o Expo Router.', p: 'Ao iniciar, o Expo Router lê a pasta `src/app` e monta a navegação a partir dos arquivos de lá.' },
    { de: 5, ate: 29, o: 'As `dependencies` são as bibliotecas que o app usa para funcionar, cada uma com sua versão. Aparecem o `expo`, o `react`, o `react-native` e várias bibliotecas usadas no modelo, como `expo-router`, `expo-image`, `react-native-reanimated` e `react-native-safe-area-context`.', p: 'O `~` antes da versão aceita atualizações pequenas, de correção. Quando você roda `npm install`, o npm baixa tudo isso para a pasta `node_modules`.' },
    { de: 30, ate: 33, o: 'As `devDependencies` são ferramentas usadas só durante o desenvolvimento: o `typescript` e os tipos do React (`@types/react`).', p: 'Elas ajudam a escrever e conferir o código, mas não fazem parte do app que roda no celular.' },
    { de: 34, ate: 42, o: 'Os `scripts` são atalhos de comandos. Por exemplo, `npm start` roda `expo start`, `npm run web` abre a versão web e `npm run reset-project` roda o `scripts/reset-project.js`.', p: 'Com eles, você não precisa decorar os comandos completos.' }
  ]
};
SIM.explicacoes['modelo:scripts/reset-project.js'] = {
  resumo: {
    titulo: 'O script de projeto limpo',
    oque: 'Este é o script do comando `npm run reset-project`. Ele move o código de exemplo para a pasta `example` (ou apaga, se você preferir) e cria uma pasta `src/app` limpa, com uma tela simples. Use quando quiser começar o seu próprio app do zero.',
    funcoes: [
      { nome: 'moveDirectories', texto: 'Move ou apaga as pastas antigas e cria os arquivos do projeto limpo.' },
      { nome: 'rl.question', texto: 'Faz a pergunta no terminal e espera a sua resposta.' }
    ]
  },
  unidades: [
    { de: 1, ate: 17, o: 'A primeira linha permite rodar o arquivo com o Node. O comentário explica o script: apagar ou mover as pastas `src` e `scripts` para `example` e criar uma pasta `src/app` nova. Depois, carrega módulos do Node (`fs` para arquivos, `path` para caminhos e `readline` para ler o teclado) e define os nomes das pastas.', p: 'Guardar os nomes das pastas em constantes no começo deixa o resto do script mais fácil de ler.' },
    { de: 18, ate: 49, o: 'Guarda, como texto, o conteúdo dos dois arquivos do projeto limpo: um `index.tsx` simples, com a frase "Edit src/app/index.tsx to edit this screen", e um `_layout.tsx` que usa `Stack`, a navegação em pilha. Também prepara a leitura do teclado (`rl`).', p: 'Esses textos viram arquivos de verdade quando o script roda. Na navegação em pilha, uma tela abre por cima da outra.' },
    { de: 50, ate: 101, o: 'A função `moveDirectories` faz o trabalho. Com a resposta `y`, cria a pasta `example` e move para lá as pastas `src` e `scripts`; com `n`, apaga essas pastas. Depois, cria `src/app` com os novos `index.tsx` e `_layout.tsx` e mostra no terminal os próximos passos.', p: 'O `try` e o `catch` mostram uma mensagem de erro se algo der errado, em vez de o script parar sem explicação.' },
    { de: 102, ate: 114, o: 'Pergunta no terminal se você quer mover os arquivos para `/example` em vez de apagar (só apertar Enter vale como `y`). Com `y` ou `n`, roda a função; com outra resposta, mostra um aviso. No fim, fecha a leitura do teclado.', p: 'Perguntar antes evita apagar o código de exemplo sem querer.' }
  ]
};
SIM.explicacoes['modelo:src/app/_layout.tsx'] = {
  resumo: {
    titulo: 'O layout principal do app',
    oque: 'Este é o primeiro arquivo que o Expo Router lê dentro de `src/app`. Ele define o que envolve todas as telas: o tema claro ou escuro, a camada animada de abertura e a navegação por abas. Pense nele como a moldura do app: as telas são os quadros que trocam lá dentro.',
    funcoes: [
      { nome: 'TabLayout', texto: 'O componente de layout. O Expo Router usa o que ele devolve como a estrutura em volta de todas as telas.' },
      { nome: 'SplashScreen.preventAutoHideAsync', texto: 'Segura a tela de abertura nativa até o app mandar escondê-la com `SplashScreen.hideAsync()`.' },
      { nome: 'useColorScheme', texto: 'Hook que informa se o aparelho está no modo claro ou no modo escuro.' },
      { nome: 'ThemeProvider', texto: 'Repassa o tema escolhido (`DarkTheme` ou `DefaultTheme`) para a navegação que fica dentro dele.' },
      { nome: 'AnimatedSplashOverlay', texto: 'A camada azul de abertura que faz a animação de saída e depois some.' },
      { nome: 'AppTabs', texto: 'Monta a barra de abas com as telas Home e Explore.' }
    ]
  },
  unidades: [
    { de: 1, ate: 1, o: 'Traz do Expo Router três peças: `DarkTheme` (cores do tema escuro), `DefaultTheme` (cores do tema claro) e `ThemeProvider`, que repassa o tema escolhido para a navegação.', p: 'A navegação precisa saber quais cores usar. Com essas peças, ela acompanha o modo claro ou escuro do aparelho.' },
    { de: 2, ate: 2, o: 'Importa tudo o que a biblioteca `expo-splash-screen` oferece e junta com o nome `SplashScreen`.', p: 'Essa biblioteca controla a tela de abertura nativa (splash), aquela que aparece enquanto o app carrega.', alvo: 'm-splash' },
    { de: 3, ate: 4, o: 'Traz o `useColorScheme`, um hook que informa se o aparelho está no tema claro ou escuro. Hook é uma função especial do React, e o nome sempre começa com `use`.', p: 'É com essa resposta que o layout escolhe o tema que vai entregar ao `ThemeProvider`.' },
    { de: 5, ate: 5, o: 'Importa o componente `AnimatedSplashOverlay` do arquivo `animated-icon`. O `@/` é um atalho para a pasta `src`, configurado no `tsconfig.json`.', p: 'Esse componente é a camada azul com o logo que anima na abertura do app. No celular, o Metro usa o `animated-icon.tsx`. No navegador, usa o `animated-icon.web.tsx`.', alvo: 'm-splash' },
    { de: 6, ate: 7, o: 'Importa o componente `AppTabs`, que monta as abas do app. Não há chaves no import porque `AppTabs` é a exportação padrão (`export default`) daquele arquivo.', p: 'Separar as abas em outro arquivo deixa o layout curto. O mesmo nome serve para as duas versões: `app-tabs.tsx` no celular e `app-tabs.web.tsx` no navegador.', alvo: 'm-abas' },
    { de: 8, ate: 9, o: 'Pede para a tela de abertura nativa continuar visível e não sumir sozinha. Essa linha fica fora da função, então roda uma vez, assim que o arquivo é carregado.', p: 'A tela de abertura só some quando alguém chamar `SplashScreen.hideAsync()`. No modelo, quem faz isso é o `AnimatedSplashOverlay`, para que a troca para a animação aconteça na hora certa.', alvo: 'm-splash' },
    { de: 10, ate: 10, o: 'Cria o componente `TabLayout`. O `export default` entrega esse componente para quem usar o arquivo, e aqui quem usa é o Expo Router.', p: 'O Expo Router lê o `_layout.tsx` antes das telas. O que esse componente devolve fica em volta de todas as telas da pasta `src/app`.', alvo: 'm-tela' },
    { de: 11, ate: 11, o: 'Pergunta ao sistema qual é o tema atual e guarda a resposta em `colorScheme`, por exemplo `\'light\'` (claro) ou `\'dark\'` (escuro).', p: 'Esse valor é usado logo abaixo para escolher entre o tema claro e o tema escuro.' },
    { de: 12, ate: 13, o: 'Começa a devolver o que vai aparecer na tela. O `ThemeProvider` recebe `DarkTheme` se `colorScheme` for `\'dark\'`, e `DefaultTheme` em qualquer outro caso.', p: 'O `? :` é um "se, senão" escrito em uma linha só. O `ThemeProvider` repassa o tema escolhido para a navegação que fica dentro dele.', alvo: 'm-tela' },
    { de: 14, ate: 14, o: 'Coloca a camada azul de abertura com o logo, que anima e depois desaparece.', p: 'Ela fica por cima de tudo e faz a passagem suave da tela de abertura nativa para o app.', alvo: 'm-splash' },
    { de: 15, ate: 18, o: 'Coloca as abas do app (Home e Explore) e depois fecha o `ThemeProvider`, o `return` e a função.', p: 'O `AppTabs` monta a navegação por abas, e cada aba mostra uma tela da pasta `src/app`.', alvo: 'm-abas' }
  ]
};
SIM.explicacoes['modelo:src/app/explore.tsx'] = {
  resumo: {
    titulo: 'A tela Explore',
    oque: 'Esta é a segunda tela do app, aberta pela aba Explore. Como o arquivo se chama `explore.tsx` e fica em `src/app`, o Expo Router cria a rota `/explore`. Ela funciona como um pequeno guia do modelo, com seções que abrem e fecham explicando rotas por arquivo, plataformas, imagens, temas e animações.',
    funcoes: [
      { nome: 'TabTwoScreen', texto: 'A tela da aba Explore, com o título, o link para a documentação e as seções que abrem e fecham.' },
      { nome: 'Platform.select', texto: 'Escolhe um valor diferente para cada plataforma. Aqui, o espaçamento do conteúdo no Android e na web.' },
      { nome: 'Collapsible', texto: 'Cada seção que abre e fecha ao ser tocada.' }
    ]
  },
  unidades: [
    { de: 1, ate: 13, o: 'Importa as peças da tela: a imagem (`Image`), os ícones (`SymbolView`), componentes do React Native, a função que mede a área segura (`useSafeAreaInsets`) e os componentes e valores do próprio projeto.', p: 'O `Collapsible` cria as seções que abrem e fecham, e o `useTheme` entrega as cores do tema atual.' },
    { de: 14, ate: 34, o: 'Cria a tela `TabTwoScreen`. Ela mede as margens seguras da tela com `useSafeAreaInsets` e soma, embaixo, o espaço da barra de abas. Depois, com `Platform.select`, monta espaçamentos diferentes para o Android e para a web.', p: 'Assim o conteúdo fica longe das barras do sistema e da barra de abas.' },
    { de: 35, ate: 126, o: 'Desenha a tela dentro de um `ScrollView`, uma área que rola, e aplica as margens calculadas antes com o `contentInset` (usado no iOS) e o `contentPlatformStyle` (Android e web). No topo ficam o título Explore, uma frase e um botão para a documentação do Expo. Depois vêm cinco seções `Collapsible` e, no fim, o `WebBadge`, que aparece só no navegador.', p: 'Cada seção explica um recurso do modelo, e três delas trazem um link "Learn more". É um bom lugar para ver exemplos de texto, imagem, link e animação juntos.' },
    { de: 127, ate: 180, o: 'Os estilos da tela: o `ScrollView` ocupa todo o espaço, o conteúdo fica centralizado com largura máxima de 800, e há estilos para o título, o botão de link, o espaço entre as seções e as duas imagens.', p: 'Repare no `aspectRatio: 296 / 171` da imagem do tutorial: ele mantém a proporção da imagem em qualquer largura de tela.' }
  ]
};
SIM.explicacoes['modelo:src/app/index.tsx'] = {
  resumo: {
    titulo: 'A tela inicial de exemplo',
    oque: 'Esta é a tela inicial do app de exemplo. Como o arquivo se chama `index.tsx` e fica em `src/app`, o Expo Router o mostra na rota `/`, a primeira tela. Ele desenha o ícone animado, o título "Welcome to Expo", o texto GET STARTED e uma caixa com três dicas para você começar.',
    funcoes: [
      { nome: 'HomeScreen', texto: 'A tela inicial. Junta o ícone, o título, o GET STARTED e a caixa com as três dicas.' },
      { nome: 'getDevMenuHint', texto: 'Escolhe o texto da dica Dev tools conforme o lugar onde o app roda: navegador, aparelho de verdade ou emulador.' },
      { nome: 'SafeAreaView', texto: 'Mantém o conteúdo longe da câmera, do entalhe e das barras do sistema.' },
      { nome: 'HintRow', texto: 'Cada linha da caixa de dicas, com o título à esquerda e a dica à direita.' },
      { nome: 'Platform.OS', texto: 'Informa em qual plataforma o app está: Android, iOS ou web. Aqui decide a dica Dev tools e se o selo da web aparece.' },
      { nome: 'Device.isDevice', texto: 'Diz se o app está num aparelho de verdade (verdadeiro) ou num emulador (falso).' }
    ]
  },
  unidades: [
    { de: 1, ate: 1, o: 'Importa tudo da biblioteca `expo-device` com o nome `Device`. Ela dá informações sobre o aparelho.', p: 'Aqui ela serve para saber se o app está num celular de verdade ou num emulador.' },
    { de: 2, ate: 2, o: 'Traz do React Native o `Platform`, que diz em qual plataforma o app está rodando, e o `StyleSheet`.', p: 'A tela muda um pouco conforme a plataforma: a dica Dev tools e o selo da web dependem disso.' },
    { de: 3, ate: 4, o: 'Importa o `SafeAreaView` da biblioteca `react-native-safe-area-context`. Ele cria uma área segura, que deixa espaço para a câmera, o entalhe e as barras do sistema.', p: 'Esta é a forma recomendada hoje. O `SafeAreaView` que vem dentro do próprio `react-native` está marcado como obsoleto.', alvo: 'm-tela' },
    { de: 5, ate: 10, o: 'Importa os componentes do projeto usados nesta tela: o ícone animado, a linha de dica, o texto e a caixa com tema e o selo da web. Também traz três valores do tema: `BottomTabInset`, `MaxContentWidth` e `Spacing`.', p: 'Cada parte da tela fica no seu próprio arquivo. Esta tela só junta as peças, como um quebra-cabeça.' },
    { de: 11, ate: 15, o: 'Cria a função `getDevMenuHint`, que escolhe a dica certa para abrir as ferramentas de desenvolvimento. Se o app está no navegador, devolve o texto "use browser devtools".', p: 'Cada lugar abre essas ferramentas de um jeito. No navegador, são as ferramentas do próprio navegador.' },
    { de: 16, ate: 22, o: 'Se o app está num aparelho de verdade (`Device.isDevice`), a dica diz para chacoalhar o aparelho ou apertar `m` no terminal. O `m` aparece no estilo de código.', p: 'No celular de verdade, chacoalhar abre o menu de desenvolvimento. No terminal onde o Expo está rodando, a tecla `m` faz o mesmo.', alvo: 'm-dica-2' },
    { de: 23, ate: 29, o: 'Se não é web nem aparelho de verdade, o app está num emulador. A constante `shortcut` guarda o atalho: `\'cmd+m (or ctrl+m)\'` no Android e `\'cmd+d\'` nos outros casos. A dica mostra "press" seguido do atalho.', p: 'Num emulador não dá para chacoalhar, então a dica ensina o atalho de teclado que abre o mesmo menu.', alvo: 'm-dica-2' },
    { de: 30, ate: 32, o: 'Cria a tela inicial, `HomeScreen`. O `export default` entrega o componente ao Expo Router.', p: 'Na pasta `src/app`, o arquivo `index.tsx` é a tela inicial, a rota `/`. O Expo Router mostra o que este componente devolver.', alvo: 'm-tela' },
    { de: 33, ate: 34, o: 'Cria o fundo da tela, que acompanha o tema, e dentro dele a área segura com o estilo `safeArea`.', p: 'Assim nada fica escondido atrás da câmera, do relógio ou das barras do celular.', alvo: 'm-tela' },
    { de: 35, ate: 36, o: 'Abre a seção principal (`heroSection`) e coloca o ícone animado (`AnimatedIcon`).', p: 'A seção principal ocupa a parte de cima da tela e deixa o ícone e o título no centro dela.', alvo: 'm-icone' },
    { de: 37, ate: 41, o: 'Escreve o título "Welcome to Expo" com o tipo `title` (texto grande), centralizado. O `&nbsp;` é um espaço que mantém duas palavras juntas na mesma linha. Depois, fecha a seção principal.', p: 'Se o título não couber numa linha, "to" e "Expo" descem juntos, em vez de o "Expo" ficar sozinho.', alvo: 'm-titulo' },
    { de: 42, ate: 45, o: 'Escreve "get started" no estilo de código. O estilo `code` da tela deixa tudo em letras maiúsculas, por isso aparece GET STARTED.', p: 'O texto foi escrito em minúsculas, mas o estilo cuida da aparência. É uma forma de separar o conteúdo do visual.', alvo: 'm-get-started' },
    { de: 46, ate: 46, o: 'Cria a caixa cinza das dicas, com a cor de fundo `backgroundElement` e o estilo `stepContainer`.', p: 'A caixa agrupa as três dicas e as separa do resto da tela.', alvo: 'm-dicas' },
    { de: 47, ate: 50, o: 'Primeira dica: título "Try editing" e, na caixinha da direita, o caminho `src/app/index.tsx` em estilo de código.', p: 'Ela convida você a editar este arquivo e ver a tela mudar na hora.', alvo: 'm-dica-1' },
    { de: 51, ate: 51, o: 'Segunda dica: título "Dev tools", com a dica que a função `getDevMenuHint` escolheu para a plataforma.', p: 'Aqui o `hint` recebe o resultado de uma função, e não um texto fixo. Isso é possível porque `hint` aceita qualquer coisa que o React desenha.', alvo: 'm-dica-2' },
    { de: 52, ate: 56, o: 'Terceira dica: título "Fresh start", com o comando `npm run reset-project`. Depois, fecha a caixa das dicas.', p: 'Esse comando roda o `scripts/reset-project.js`, que move ou apaga o código de exemplo e deixa o projeto limpo.', alvo: 'm-dica-3' },
    { de: 57, ate: 58, o: 'Só desenha o selo do Expo (`WebBadge`) se o app estiver no navegador. O `&&` funciona como "se a condição for verdadeira, mostre isto".', p: 'No celular, a condição é falsa e nada aparece no lugar do selo.', alvo: 'w-selo' },
    { de: 59, ate: 63, o: 'Fecha a área segura, o fundo da tela, o `return` e a função `HomeScreen`.', p: 'Aqui termina a parte visual da tela. Os estilos vêm a seguir.' },
    { de: 64, ate: 69, o: 'Começa os estilos. O `container` ocupa todo o espaço (`flex: 1`), coloca o conteúdo em linha (`flexDirection: \'row\'`) e centraliza.', p: 'Numa tela larga, como a do navegador, isso deixa a coluna de conteúdo no meio da tela.', alvo: 'm-tela' },
    { de: 70, ate: 77, o: 'O estilo `safeArea` ocupa o espaço disponível, tem espaço nas laterais, centraliza os itens e deixa 16 entre eles (`gap: Spacing.three`). Embaixo, reserva a altura da barra de abas (`BottomTabInset`) mais 16. A largura máxima é `MaxContentWidth` (800).', p: 'O espaço de baixo reserva a área da barra de abas, assim a caixa de dicas fica sempre acima dela.', alvo: 'm-tela' },
    { de: 78, ate: 84, o: 'O estilo `heroSection` ocupa todo o espaço que sobra (`flex: 1`) e centraliza o ícone e o título, com 24 de distância entre eles (`gap: Spacing.four`).', p: 'Por isso o ícone e o título ficam no meio da parte de cima, e as dicas ficam lá embaixo.', alvo: 'm-icone' },
    { de: 85, ate: 87, o: 'O estilo `title` centraliza o texto do título.', p: 'Quando o título ocupa duas linhas, as duas ficam centralizadas.', alvo: 'm-titulo' },
    { de: 88, ate: 90, o: 'O estilo `code` usa `textTransform: \'uppercase\'`, que mostra o texto em letras maiúsculas.', p: 'É ele que transforma "get started" em GET STARTED na tela.', alvo: 'm-get-started' },
    { de: 91, ate: 98, o: 'O estilo `stepContainer` deixa 16 de distância entre as linhas de dica, estica a caixa na largura toda (`alignSelf: \'stretch\'`), dá espaço interno e arredonda os cantos. Depois, fecha o objeto de estilos.', p: 'Sem o `alignSelf: \'stretch\'`, a caixa ficaria só do tamanho do conteúdo, porque a área segura centraliza os itens.', alvo: 'm-dicas' }
  ]
};
SIM.explicacoes['modelo:src/components/animated-icon.module.css'] = {
  resumo: {
    titulo: 'O degradê do ícone na web',
    oque: 'Este é um módulo CSS com uma única classe, que desenha o quadrado azul com degradê atrás do logo. Ele só funciona na versão web: o `animated-icon.web.tsx` importa este arquivo e aplica a classe numa `<div>`. No celular, o mesmo visual vem da propriedade `experimental_backgroundImage`.',
    funcoes: [
      { nome: '.expoLogoBackground', texto: 'A única classe do arquivo. Desenha o quadrado azul do ícone no navegador.' },
      { nome: 'linear-gradient', texto: 'Função do CSS que cria um degradê entre duas ou mais cores.' },
      { nome: 'border-radius', texto: 'Propriedade do CSS que arredonda os cantos de um elemento.' }
    ]
  },
  unidades: [
    { de: 1, ate: 1, o: 'Cria a classe CSS `expoLogoBackground`. O ponto no começo indica que é uma classe.', p: 'Por ser um módulo CSS (o `.module.css` no nome), essa classe é usada no código como `classes.expoLogoBackground`.' },
    { de: 2, ate: 2, o: 'Pinta o fundo com um degradê de cima para baixo (`180deg`), indo do azul claro `#3c9ffe` até o azul escuro `#0274df`.', p: 'São as mesmas cores do degradê que a versão do celular faz com `experimental_backgroundImage`.' },
    { de: 3, ate: 3, o: 'Arredonda os cantos com um raio de 40 pixels.', p: 'Deixa o quadrado com cantos bem arredondados, no formato de ícone de app.' },
    { de: 4, ate: 6, o: 'Define o tamanho de 128 por 128 pixels e fecha a classe.', p: 'É o mesmo tamanho da caixa do ícone, então o fundo preenche a caixa toda.' }
  ]
};
SIM.explicacoes['modelo:src/components/animated-icon.tsx'] = {
  resumo: {
    titulo: 'O ícone animado e a abertura (celular)',
    oque: 'Este arquivo cuida das animações do logo do Expo no celular. Ele tem duas partes: a camada azul de abertura, que entra no lugar da tela de abertura nativa e some com uma animação, e o ícone animado da tela inicial. No navegador, o Metro usa o `animated-icon.web.tsx` no lugar deste arquivo.',
    funcoes: [
      { nome: 'AnimatedSplashOverlay', texto: 'A camada azul de abertura. Esconde a tela de abertura nativa, faz a animação de saída e depois some.' },
      { nome: 'AnimatedIcon', texto: 'O ícone da tela inicial, com três camadas animadas: o brilho que gira, o fundo azul que encolhe e o logo que aparece.' },
      { nome: 'Keyframe', texto: 'Descreve as etapas de uma animação em porcentagens do tempo total, de 0 a 100.' },
      { nome: 'useState', texto: 'Guarda `animate` e `visible`, que decidem qual versão da camada aparece e quando ela some.' },
      { nome: 'scheduleOnRN', texto: 'Deixa o worklet da animação pedir que `setVisible(false)` rode no lado normal do JavaScript do app.' },
      { nome: 'SplashScreen.hideAsync', texto: 'Esconde a tela de abertura nativa no momento em que a camada azul já cobre a tela.' }
    ]
  },
  unidades: [
    { de: 1, ate: 1, o: 'Importa o componente `Image` da biblioteca `expo-image`, usado para mostrar imagens.', p: 'O logo do Expo e o brilho atrás dele são imagens, e este componente é quem as desenha.' },
    { de: 2, ate: 2, o: 'Importa tudo da biblioteca `expo-splash-screen` com o nome `SplashScreen`.', p: 'É com ela que este arquivo esconde a tela de abertura nativa, na hora certa.', alvo: 'm-splash' },
    { de: 3, ate: 3, o: 'Traz o `useState`, o hook que dá memória a um componente: um valor e uma função para mudá-lo.', p: 'Quando o valor muda, o componente é desenhado de novo. A camada de abertura usa isso para trocar de versão e para sumir.' },
    { de: 4, ate: 4, o: 'Traz do React Native o `Dimensions` (medidas da tela), o `StyleSheet` (estilos) e a `View` (caixa).', p: 'O `Dimensions` é usado logo abaixo para descobrir a altura da tela do aparelho.' },
    { de: 5, ate: 5, o: 'Importa da biblioteca `react-native-reanimated` o `Animated`, o `Easing` e o `Keyframe`.', p: '`Animated` cria componentes que podem ser animados, `Keyframe` descreve as etapas de uma animação e `Easing` muda o ritmo do movimento.' },
    { de: 6, ate: 7, o: 'Importa a função `scheduleOnRN` da biblioteca `react-native-worklets`. O RN no nome quer dizer React Native.', p: 'Ela deixa o código que roda junto com a animação pedir para executar uma função no lado normal do JavaScript do app.' },
    { de: 8, ate: 8, o: 'Calcula `INITIAL_SCALE_FACTOR`: a altura da tela dividida por 90. É quantas vezes o fundo do ícone vai começar maior que o normal.', p: 'Com esse tamanho, o quadrado azul começa gigante, cobrindo a tela, e depois encolhe. A ideia é parecer que a tela azul encolhe até virar o ícone.', alvo: 'm-icone-fundo' },
    { de: 9, ate: 10, o: 'Define `DURATION` como 600, ou seja, 600 milissegundos (pouco mais de meio segundo).', p: 'É a duração da saída da camada de abertura e das animações do fundo e do logo. Guardar numa constante evita repetir o número.' },
    { de: 11, ate: 11, o: 'Cria o componente `AnimatedSplashOverlay`, a camada azul que aparece na abertura do app.', p: 'O `_layout.tsx` coloca esse componente por cima de tudo, para fazer a passagem da tela de abertura nativa para o app.', alvo: 'm-splash' },
    { de: 12, ate: 12, o: 'Cria o estado `animate`, que começa como `false`. Ele diz se a animação de saída já pode começar.', p: 'Enquanto `animate` é falso, o componente mostra a versão parada da camada. Quando vira verdadeiro, mostra a versão animada.' },
    { de: 13, ate: 14, o: 'Cria o estado `visible`, que começa como `true`. Ele diz se a camada ainda deve existir.', p: 'No fim da animação, `visible` vira falso e a camada é removida.' },
    { de: 15, ate: 16, o: 'Se `visible` for falso, o componente devolve `null`, ou seja, não desenha nada.', p: 'Depois da animação de saída, a camada some de vez e para de cobrir o app.', alvo: 'm-splash' },
    { de: 17, ate: 21, o: 'Começa a criar `splashKeyframe`, a animação de saída da camada. Na etapa 0 (o início), ela está no tamanho normal (`scale: 1`) e totalmente visível (`opacity: 1`).', p: 'Num `Keyframe`, cada número é uma porcentagem do tempo total: 0 é o começo e 100 é o fim.', alvo: 'm-splash' },
    { de: 22, ate: 24, o: 'Na etapa 20, a camada continua totalmente visível.', p: 'Isso segura a camada parada nos primeiros 20% do tempo, antes de ela começar a sumir.', alvo: 'm-splash' },
    { de: 25, ate: 28, o: 'Na etapa 70, a camada já está transparente (`opacity: 0`). O `Easing.elastic(0.7)` muda o ritmo desse trecho com um efeito de mola.', p: 'O `easing` escrito numa etapa vale para o trecho que chega até ela. Aqui, o sumiço acontece entre 20% e 70% do tempo.', alvo: 'm-splash' },
    { de: 29, ate: 34, o: 'Na etapa 100, o fim, a camada segue invisível e no tamanho normal. Depois, fecha o objeto e o `Keyframe`.', p: 'O fim confirma o estado final da animação: a camada invisível, pronta para ser removida.', alvo: 'm-splash' },
    { de: 35, ate: 37, o: 'Guarda na constante `image` o logo do Expo (`expo-logo.png`), com o estilo `image`.', p: 'As duas versões da camada mostram o mesmo logo. Criar uma vez e usar `{image}` nas duas evita repetir código.', alvo: 'm-splash' },
    { de: 38, ate: 38, o: 'Escolhe o que desenhar com o `? :`, um "se, senão" em uma linha. Se `animate` for verdadeiro, desenha a versão animada; senão, a versão parada, que vem depois do `:`.', p: 'As duas versões são iguais na aparência. A diferença é que só a primeira tem animação de saída.' },
    { de: 39, ate: 39, o: 'Abre uma `Animated.View`, uma `View` que o Reanimated consegue animar.', p: 'Uma `View` comum não aceita as animações do Reanimated, por isso aqui é preciso a versão `Animated`.', alvo: 'm-splash' },
    { de: 40, ate: 40, o: 'O `entering` faz a animação rodar quando o componente aparece. O `.duration(DURATION)` define 600 ms, e o `.withCallback` registra uma função para rodar quando a animação acabar.', p: 'A função recebe `finished`, que é verdadeiro quando a animação terminou sem ser interrompida. É a deixa para remover a camada.', alvo: 'm-splash' },
    { de: 41, ate: 41, o: 'O `\'worklet\'` marca esta função como worklet: uma função que roda na linha de execução da animação (UI), separada do JavaScript normal do app.', p: 'As animações do Reanimated rodam nessa linha da interface, e é de lá que esta função é chamada quando a animação acaba.' },
    { de: 42, ate: 45, o: 'Se a animação terminou (`finished`), o `scheduleOnRN` pede para executar `setVisible(false)` de volta no lado normal do JavaScript do app.', p: 'O estado do React precisa ser mudado nesse lado normal. Com `visible` falso, o componente devolve `null` e a camada some.', alvo: 'm-splash' },
    { de: 46, ate: 48, o: 'Aplica o estilo `splashOverlay`, que cobre a tela de azul, coloca o logo dentro e fecha a `Animated.View`.', p: 'É o mesmo estilo da versão parada, então a troca de uma versão para a outra não aparece.', alvo: 'm-splash' },
    { de: 49, ate: 50, o: 'Começa a segunda opção do `? :`. Quando `animate` ainda é falso, desenha uma `View` comum, sem animação.', p: 'Essa é a primeira versão da camada que aparece. Ela fica parada, cobrindo a tela, até a tela de abertura nativa sumir.', alvo: 'm-splash' },
    { de: 51, ate: 55, o: 'O `onLayout` roda quando a `View` é montada e posicionada na tela. Nesse momento, o código chama `SplashScreen.hideAsync()` para esconder a tela de abertura nativa. Quando esse pedido termina, dando certo ou não (`.finally`), muda `animate` para `true`.', p: 'Como a camada azul já cobre a tela, o usuário não vê a troca. Com `animate` verdadeiro, entra a `Animated.View`, que é um componente novo, então a animação `entering` começa.', alvo: 'm-splash' },
    { de: 56, ate: 60, o: 'Usa o mesmo estilo e o mesmo logo da versão animada. Depois, fecha a `View`, o `return` e a função.', p: 'Manter as duas versões iguais faz a passagem da versão parada para a animada ficar invisível para o usuário.', alvo: 'm-splash' },
    { de: 61, ate: 65, o: 'Cria `keyframe`, a animação do quadrado azul do ícone. Na etapa 0, a escala é `INITIAL_SCALE_FACTOR`: o quadrado começa gigante.', p: 'Começar desse tamanho faz o fundo do ícone cobrir a tela inteira no primeiro instante.', alvo: 'm-icone-fundo' },
    { de: 66, ate: 71, o: 'Na etapa 100, a escala volta a 1, o tamanho normal. O `Easing.elastic(0.7)` faz o quadrado encolher com um efeito de mola.', p: 'O efeito de mola deixa o movimento mais vivo do que uma redução em ritmo constante.', alvo: 'm-icone-fundo' },
    { de: 72, ate: 76, o: 'Cria `logoKeyframe`, a animação do logo. Na etapa 0, o logo está 30% maior (`scale: 1.3`) e invisível (`opacity: 0`).', p: 'O logo começa escondido enquanto o fundo azul ainda está gigante.', alvo: 'm-icone-logo' },
    { de: 77, ate: 81, o: 'Na etapa 40, o logo continua maior e invisível.', p: 'Isso faz o logo esperar os primeiros 40% do tempo, enquanto o fundo azul encolhe.', alvo: 'm-icone-logo' },
    { de: 82, ate: 87, o: 'Na etapa 100, o logo fica visível (`opacity: 1`) e no tamanho normal (`scale: 1`), com efeito de mola. Depois, fecha o `Keyframe`.', p: 'O logo aparece e encolhe um pouco ao mesmo tempo, como se pousasse no lugar.', alvo: 'm-icone-logo' },
    { de: 88, ate: 92, o: 'Cria `glowKeyframe`, a animação do brilho. Na etapa 0, a rotação (`rotateZ`) é de 0 grau.', p: 'O `rotateZ` gira o elemento no plano da tela, como os ponteiros de um relógio.', alvo: 'm-icone-brilho' },
    { de: 93, ate: 97, o: 'Na etapa 100, a rotação chega a 7200 graus, o que dá 20 voltas completas. Depois, fecha o `Keyframe`.', p: 'Como essa animação vai durar 4 minutos, as 20 voltas acontecem bem devagar.', alvo: 'm-icone-brilho' },
    { de: 98, ate: 99, o: 'Cria o componente `AnimatedIcon`, o ícone animado que aparece na tela inicial.', p: 'O `index.tsx` importa este componente e o coloca acima do título "Welcome to Expo".', alvo: 'm-icone' },
    { de: 100, ate: 100, o: 'Abre a caixa do ícone, com o estilo `iconContainer` (128 por 128).', p: 'Ela segura as três camadas do ícone, uma por cima da outra: o brilho, o fundo azul e o logo.', alvo: 'm-icone' },
    { de: 101, ate: 101, o: 'Cria a camada do brilho, que roda o `glowKeyframe` ao aparecer. A duração é `60 * 1000 * 4` milissegundos, ou seja, 4 minutos.', p: 'São 20 voltas em 4 minutos, uma volta a cada 12 segundos. O brilho gira devagar, só para dar vida ao ícone.', alvo: 'm-icone-brilho' },
    { de: 102, ate: 104, o: 'Dentro da camada, mostra a imagem `logo-glow.png` com o mesmo tamanho da camada. Depois, fecha a `Animated.View`.', p: 'É essa imagem que forma o brilho que gira atrás do ícone.', alvo: 'm-icone-brilho' },
    { de: 105, ate: 105, o: 'Cria a camada do fundo: uma `Animated.View` vazia, com o estilo `background` (o quadrado com degradê azul), que roda o `keyframe` em 600 ms.', p: 'A camada não precisa de conteúdo, porque o próprio estilo desenha o quadrado azul.', alvo: 'm-icone-fundo' },
    { de: 106, ate: 108, o: 'Cria a camada do logo, que roda o `logoKeyframe` em 600 ms, com a imagem `expo-logo.png` dentro.', p: 'Por vir depois no código, o logo fica por cima do fundo azul.', alvo: 'm-icone-logo' },
    { de: 109, ate: 112, o: 'Fecha a caixa do ícone, o `return` e a função `AnimatedIcon`.', p: 'Aqui termina a parte visual. Os estilos vêm a seguir.' },
    { de: 113, ate: 113, o: 'Começa a criar os estilos do arquivo com `StyleSheet.create`.', p: 'Os estilos ficam juntos no fim do arquivo, o que deixa o JSX mais limpo.' },
    { de: 114, ate: 117, o: 'O estilo `imageContainer` centraliza o conteúdo na vertical e na horizontal.', p: 'Ele mantém o logo no centro da caixa do ícone.', alvo: 'm-icone-logo' },
    { de: 118, ate: 122, o: 'O estilo `glow` tem 201 por 201 e `position: \'absolute\'`, que tira o elemento do fluxo normal e permite que ele fique por cima ou por baixo de outros.', p: 'O brilho é maior que o ícone (201 contra 128), por isso aparece em volta dele.', alvo: 'm-icone-brilho' },
    { de: 123, ate: 129, o: 'O estilo `iconContainer` centraliza o conteúdo, tem 128 por 128 e `zIndex: 100`. O `zIndex` diz quem fica na frente quando elementos se sobrepõem: quanto maior, mais na frente.', p: 'Com 100, o ícone fica na frente do título, seu vizinho na mesma seção. Isso importa no começo, quando o fundo azul ainda está gigante.', alvo: 'm-icone' },
    { de: 130, ate: 133, o: 'O estilo `image` define o tamanho do logo: 76 de largura e 71 de altura.', p: 'Esse estilo é usado no logo do ícone e também no logo da camada de abertura.', alvo: 'm-icone-logo' },
    { de: 134, ate: 140, o: 'O estilo `background` desenha o quadrado azul: 128 por 128, cantos arredondados (`borderRadius: 40`) e um degradê de cima para baixo feito com `experimental_backgroundImage`.', p: 'O `experimental_` no nome avisa que é um recurso novo do React Native. No celular, é ele que desenha o degradê. Na web, quem desenha é o `animated-icon.module.css`.', alvo: 'm-icone-fundo' },
    { de: 141, ate: 148, o: 'O estilo `splashOverlay` começa com `...StyleSheet.absoluteFill`: os três pontos copiam para cá propriedades prontas que fazem a camada cobrir todo o espaço. Também pinta o fundo com `#208AEF`, centraliza o logo e usa `zIndex: 1000`.', p: 'O azul `#208AEF` é o mesmo da tela de abertura configurada no `app.json`, e o `zIndex` alto deixa a camada na frente de tudo.', alvo: 'm-splash' }
  ]
};
SIM.explicacoes['modelo:src/components/animated-icon.web.tsx'] = {
  resumo: {
    titulo: 'O ícone animado (versão web)',
    oque: 'Esta é a versão do ícone animado que roda no navegador. Quando o app roda na web, o Metro usa este arquivo no lugar do `animated-icon.tsx`. As animações são parecidas com as do celular, mas aqui não existe camada de abertura e o degradê do fundo vem de um módulo CSS.',
    funcoes: [
      { nome: 'AnimatedSplashOverlay', texto: 'Na web, não desenha nada. Existe para o `_layout.tsx` funcionar do mesmo jeito nas duas plataformas.' },
      { nome: 'AnimatedIcon', texto: 'O ícone animado da tela inicial no navegador, com o brilho, o fundo azul e o logo.' },
      { nome: 'classes.expoLogoBackground', texto: 'A classe do módulo CSS que desenha o quadrado azul com degradê dentro de uma `<div>`.' },
      { nome: 'Keyframe', texto: 'Descreve as etapas de cada animação em porcentagens do tempo total.' },
      { nome: 'DURATION', texto: '300 milissegundos, a duração das animações do fundo e do logo nesta versão.' }
    ]
  },
  unidades: [
    { de: 1, ate: 1, o: 'Importa o componente `Image` da biblioteca `expo-image`, o mesmo usado na versão do celular.', p: 'O logo e o brilho continuam sendo imagens, também no navegador.' },
    { de: 2, ate: 2, o: 'Traz do React Native o `StyleSheet` (estilos) e a `View` (caixa).', p: 'No navegador, o React Native transforma esses componentes em elementos de página web.' },
    { de: 3, ate: 4, o: 'Importa do Reanimated o `Animated`, o `Keyframe` e o `Easing`.', p: 'O Reanimated também funciona na web, então as animações podem ser escritas do mesmo jeito.' },
    { de: 5, ate: 5, o: 'Importa o módulo CSS `animated-icon.module.css` com o nome `classes`. Cada classe daquele arquivo vira uma propriedade desse objeto, como `classes.expoLogoBackground`.', p: 'Módulo CSS só funciona na versão web. É ele que desenha o degradê azul do ícone no navegador.' },
    { de: 6, ate: 7, o: 'Define `DURATION` como 300, ou seja, 300 milissegundos. É metade do valor usado na versão do celular (600).', p: 'O valor é usado nas animações do fundo e do logo, e também numa conta que posiciona uma etapa do brilho.' },
    { de: 8, ate: 11, o: 'Cria uma versão do `AnimatedSplashOverlay` que não desenha nada (`return null`).', p: 'O `_layout.tsx` usa esse componente nas duas plataformas, então ele precisa existir aqui também. A tela de abertura nativa é coisa do Android e do iOS, por isso no navegador a camada azul não é necessária.' },
    { de: 12, ate: 15, o: 'Cria `keyframe`, a animação do fundo azul. Na etapa 0, a escala é 0: o quadrado está tão pequeno que não aparece.', p: 'Aqui o fundo nasce do nada e cresce, em vez de começar gigante como no celular.' },
    { de: 16, ate: 19, o: 'Na etapa 60, o quadrado chega a 120% do tamanho (`scale: 1.2`), com efeito de mola (`Easing.elastic(1.2)`).', p: 'Passar um pouco do tamanho final dá a sensação de um pulo.' },
    { de: 20, ate: 25, o: 'Na etapa 100, o quadrado volta ao tamanho normal (`scale: 1`). Depois, fecha o `Keyframe`.', p: 'Crescer, passar do ponto e voltar deixa a entrada do ícone mais animada.' },
    { de: 26, ate: 29, o: 'Cria `logoKeyframe`, a animação do logo. Na etapa 0, o logo está invisível (`opacity: 0`).', p: 'O logo espera o fundo aparecer antes de surgir.' },
    { de: 30, ate: 34, o: 'Na etapa 60, o logo ainda está invisível, mas já 20% maior (`scale: 1.2`).', p: 'Assim, quando começar a aparecer, o logo vem de um tamanho maior.' },
    { de: 35, ate: 40, o: 'Na etapa 100, o logo fica visível (`opacity: 1`) e volta ao tamanho normal, com efeito de mola. Depois, fecha o `Keyframe`.', p: 'O logo aparece nos últimos 40% do tempo, já com o fundo no lugar.' },
    { de: 41, ate: 46, o: 'Cria `glowKeyframe`, a animação do brilho. Na etapa 0, ele está girado meia volta para trás (`-180deg`), um pouco menor (`scale: 0.8`) e invisível.', p: 'Diferente do celular, aqui o brilho também surge com uma pequena entrada, antes de começar a girar devagar.' },
    { de: 47, ate: 51, o: 'Esta etapa usa uma conta como chave: `DURATION / 1000` dá 0,3 (300 dividido por 1000). Como as chaves são porcentagens, a etapa acontece em 0,3% dos 4 minutos, por volta de 0,7 segundo. Nesse ponto, o brilho já está em 0 grau, no tamanho normal e visível.', p: 'Os colchetes `[ ]` permitem usar uma conta como nome da chave. O resultado é um brilho que aparece girando logo no começo.' },
    { de: 52, ate: 56, o: 'Na etapa 100, a rotação chega a 7200 graus, ou seja, 20 voltas. Depois, fecha o `Keyframe`.', p: 'Depois da entrada rápida, o brilho segue girando devagar até completar os 4 minutos.' },
    { de: 57, ate: 58, o: 'Cria a versão web do `AnimatedIcon`, com as mesmas três camadas da versão do celular.', p: 'Tem o mesmo nome do componente do celular, então o `index.tsx` funciona sem mudar nada.' },
    { de: 59, ate: 59, o: 'Abre a caixa do ícone, com o estilo `iconContainer` (128 por 128).', p: 'Ela segura as três camadas, uma por cima da outra.' },
    { de: 60, ate: 60, o: 'Cria a camada do brilho, que roda o `glowKeyframe` com duração de `60 * 1000 * 4` milissegundos (4 minutos).', p: 'A duração longa faz o brilho girar bem devagar.' },
    { de: 61, ate: 63, o: 'Mostra a imagem `logo-glow.png` dentro da camada do brilho e fecha a `Animated.View`.', p: 'É a imagem que forma o brilho atrás do ícone.' },
    { de: 64, ate: 64, o: 'Cria a camada do fundo, uma `Animated.View` com o estilo `background`, que roda o `keyframe` em 300 ms.', p: 'Diferente do celular, aqui a camada não pinta o fundo sozinha: ela guarda uma `<div>` que faz isso.' },
    { de: 65, ate: 65, o: 'Coloca uma `<div>`, a caixa básica do HTML, com a classe `expoLogoBackground` do módulo CSS. É essa classe que desenha o quadrado azul com degradê.', p: 'Isso só funciona porque este arquivo roda apenas no navegador, onde o app vira uma página HTML. No celular não existe `<div>`, e o degradê vem de `experimental_backgroundImage`.' },
    { de: 66, ate: 67, o: 'Fecha a camada do fundo.', p: 'A animação de escala da camada leva junto a `<div>` que está dentro dela.' },
    { de: 68, ate: 70, o: 'Cria a camada do logo, que roda o `logoKeyframe` em 300 ms, com a imagem `expo-logo.png` dentro.', p: 'Por vir depois no código, o logo fica por cima do fundo azul.' },
    { de: 71, ate: 74, o: 'Fecha a caixa do ícone, o `return` e a função `AnimatedIcon`.', p: 'Aqui termina a parte visual. Os estilos vêm a seguir.' },
    { de: 75, ate: 75, o: 'Começa a criar os estilos do arquivo com `StyleSheet.create`.', p: 'No navegador, o React Native transforma esses estilos em CSS.' },
    { de: 76, ate: 82, o: 'Define o estilo `container`, com posição absoluta, largura total e `zIndex: 1000`.', p: 'Esse estilo não é usado em nenhum lugar deste arquivo, então não muda nada na tela. É uma sobra do modelo.' },
    { de: 83, ate: 86, o: 'O estilo `imageContainer` centraliza o conteúdo na vertical e na horizontal.', p: 'Ele mantém o logo no centro da caixa do ícone.' },
    { de: 87, ate: 91, o: 'O estilo `glow` tem 201 por 201 e posição absoluta.', p: 'O brilho é maior que o ícone, por isso aparece em volta dele.' },
    { de: 92, ate: 97, o: 'O estilo `iconContainer` centraliza o conteúdo e tem 128 por 128.', p: 'É o tamanho do ícone inteiro, o mesmo da versão do celular.' },
    { de: 98, ate: 102, o: 'O estilo `image` define o logo com 76 por 71 e posição absoluta.', p: 'Com a posição absoluta, o logo não ocupa espaço no fluxo da caixa, e o `imageContainer` o mantém no centro.' },
    { de: 103, ate: 108, o: 'O estilo `background` tem 128 por 128 e posição absoluta. Depois, fecha o objeto de estilos.', p: 'Aqui não há cor nem degradê, porque quem pinta o fundo é a `<div>` com a classe do módulo CSS.' }
  ]
};
SIM.explicacoes['modelo:src/components/app-tabs.tsx'] = {
  resumo: {
    titulo: 'As abas do app no celular',
    oque: 'Este arquivo monta a barra de abas que aparece embaixo da tela no Android e no iOS, com as abas Home e Explore. Ele usa o `NativeTabs`, que desenha as abas com os componentes nativos do próprio sistema. No navegador, o Metro usa outro arquivo no lugar deste: o `app-tabs.web.tsx`.',
    funcoes: [
      { nome: 'NativeTabs', texto: 'Cria a barra de abas nativa e recebe as cores do fundo, do indicador e do texto.' },
      { nome: 'NativeTabs.Trigger', texto: 'Representa uma aba. O `name` liga a aba a um arquivo de tela da pasta `src/app`.' },
      { nome: 'NativeTabs.Trigger.Label', texto: 'O texto que aparece na aba, como "Home" ou "Explore".' },
      { nome: 'NativeTabs.Trigger.Icon', texto: 'O ícone da aba, carregado de uma imagem que fica dentro do projeto.' },
      { nome: 'Colors', texto: 'As cores de cada tema, usadas para pintar a barra de acordo com o modo claro ou escuro.' }
    ]
  },
  unidades: [
    { de: 1, ate: 1, o: 'Importa o `NativeTabs`, componente do Expo Router que cria uma barra de abas com os componentes nativos do sistema (Android ou iOS).', p: 'O `unstable` no caminho avisa que esse recurso ainda é novo e pode mudar em versões futuras do Expo.', alvo: 'm-abas' },
    { de: 2, ate: 3, o: 'Traz o hook `useColorScheme`, que informa se o aparelho está no tema claro ou escuro.', p: 'As cores da barra de abas vão acompanhar esse tema.' },
    { de: 4, ate: 5, o: 'Importa `Colors`, o objeto com as cores de cada tema, que fica em `src/constants/theme.ts`. O `@/` é um atalho para a pasta `src`.', p: 'Assim as cores ficam definidas em um lugar só, e o app inteiro usa a mesma paleta.' },
    { de: 6, ate: 6, o: 'Cria o componente `AppTabs` e o exporta como padrão do arquivo (`export default`).', p: 'O `_layout.tsx` importa esse componente e o coloca na tela.', alvo: 'm-abas' },
    { de: 7, ate: 8, o: 'Descobre o tema atual e escolhe o grupo de cores certo dentro de `Colors`. Se o sistema responder `\'unspecified\'`, o código usa `\'light\'`.', p: '`\'unspecified\'` quer dizer que o tema não foi informado. Nesse caso o modelo trata como claro, para ter sempre um grupo de cores válido.' },
    { de: 9, ate: 11, o: 'Começa a devolver a barra de abas nativa com `<NativeTabs`.', p: 'As propriedades escritas logo abaixo, antes do `>`, configuram a aparência da barra inteira.', alvo: 'm-abas' },
    { de: 12, ate: 12, o: 'Pinta o fundo da barra de abas com a cor `background` do tema.', p: 'Assim a barra combina com o resto da tela, tanto no claro quanto no escuro.', alvo: 'm-abas' },
    { de: 13, ate: 13, o: 'Define a cor do indicador, a pílula de fundo que destaca a aba selecionada. Ela usa a cor `backgroundElement` do tema.', p: 'O indicador mostra ao usuário em qual aba ele está. Pela documentação, essa cor é usada no Android.', alvo: 'm-indicador' },
    { de: 14, ate: 14, o: 'Define que o nome da aba selecionada usa a cor `text` do tema, a cor principal dos textos.', p: 'A chave `selected` vale só para a aba que está ativa, então o nome dela fica com a cor de destaque.', alvo: 'm-abas' },
    { de: 15, ate: 16, o: 'Cria a primeira aba. O `name="index"` liga essa aba ao arquivo `src/app/index.tsx`, e o `Label` escreve o nome "Home".', p: 'No Expo Router, o `name` da aba é o nome do arquivo da tela, sem a extensão. É assim que a aba sabe qual tela abrir.', alvo: 'm-aba-home' },
    { de: 17, ate: 21, o: 'Coloca o ícone da aba Home. O `require` carrega a imagem `home.png`, que fica na pasta `assets` do projeto (o `@/assets/` é um atalho para ela). Depois, fecha a aba.', p: 'No iOS, o `renderingMode="template"` deixa o sistema pintar o ícone com a cor da aba, em vez de usar as cores originais da imagem.', alvo: 'm-aba-home' },
    { de: 22, ate: 24, o: 'Cria a segunda aba, ligada ao arquivo `src/app/explore.tsx`, com o nome "Explore".', p: 'Funciona igual à aba Home: o `name` precisa bater com o nome do arquivo da tela.', alvo: 'm-aba-explore' },
    { de: 25, ate: 29, o: 'Coloca o ícone da aba Explore, carregado da imagem `explore.png`, e fecha a aba.', p: 'É o mesmo esquema da aba Home: uma imagem do projeto e `renderingMode="template"`.', alvo: 'm-aba-explore' },
    { de: 30, ate: 32, o: 'Fecha o `NativeTabs`, o `return` e a função `AppTabs`.', p: 'Toda tag aberta precisa ser fechada. Aqui termina a definição das abas do celular.' }
  ]
};
SIM.explicacoes['modelo:src/components/app-tabs.web.tsx'] = {
  resumo: {
    titulo: 'As abas do app no navegador',
    oque: 'Esta é a versão das abas que roda no navegador. Quando o app roda na web, o Metro usa este arquivo no lugar do `app-tabs.tsx`. Em vez das abas nativas, ele monta as abas à mão com `Tabs`, `TabList`, `TabTrigger` e `TabSlot`, numa barra flutuante no topo com a marca "Expo Starter" e um link Docs.',
    funcoes: [
      { nome: 'Tabs', texto: 'O contêiner que guarda o sistema de abas montado à mão.' },
      { nome: 'TabSlot', texto: 'O espaço onde aparece a tela da aba selecionada.' },
      { nome: 'TabTrigger', texto: 'O botão que troca de aba. O `href` diz qual tela abrir.' },
      { nome: 'TabButton', texto: 'Desenha cada botão de aba e muda as cores quando a aba está selecionada (`isFocused`).' },
      { nome: 'CustomTabList', texto: 'A barra flutuante do topo, com a marca Expo Starter, os botões das abas e o link Docs.' },
      { nome: 'asChild', texto: 'Prop que faz o componente passar suas props para o filho, em vez de criar a própria caixa.' }
    ]
  },
  unidades: [
    { de: 1, ate: 5, o: 'Começa a importar peças do `expo-router/ui` para montar abas à mão: `Tabs` (o contêiner de tudo), `TabList` (a lista de botões), `TabTrigger` (o botão que troca de aba) e `TabSlot` (o espaço onde a tela aparece).', p: 'Com essas peças, você decide o visual das abas. O modelo usa isso para criar uma barra própria para o navegador.' },
    { de: 6, ate: 8, o: 'Importa também dois tipos do TypeScript: `TabTriggerSlotProps` (as props que um botão de aba recebe) e `TabListProps` (as props da lista de abas). O `from \'expo-router/ui\'` diz de onde tudo vem.', p: 'Esses tipos ajudam o editor a conferir se os componentes recebem as props certas.' },
    { de: 9, ate: 9, o: 'Importa o `SymbolView`, que mostra ícones de bibliotecas de símbolos: SF Symbols no iOS e Material Symbols no Android e na web.', p: 'Ele desenha o pequeno ícone de link ao lado do texto Docs.' },
    { de: 10, ate: 11, o: 'Traz do React Native o `Pressable` (área que responde ao toque ou ao clique), o `useColorScheme`, a `View` e o `StyleSheet`.', p: 'Os botões das abas e o link Docs são feitos com `Pressable`.' },
    { de: 12, ate: 15, o: 'Importa três componentes da mesma pasta: `ExternalLink` (link para fora do app), `ThemedText` e `ThemedView` (texto e caixa que seguem o tema).', p: 'O `ExternalLink` é usado no link Docs, que leva para a documentação do Expo.' },
    { de: 16, ate: 17, o: 'Importa do tema as cores (`Colors`), a largura máxima do conteúdo (`MaxContentWidth`, que vale 800) e os espaçamentos (`Spacing`).', p: 'Assim a barra usa as mesmas medidas e cores do resto do app.' },
    { de: 18, ate: 19, o: 'Cria o componente `AppTabs` da versão web. Ele tem o mesmo nome e o mesmo jeito de exportar (`export default`) da versão do celular.', p: 'Assim o `_layout.tsx` não precisa saber em qual plataforma está: o Metro escolhe sozinho o arquivo certo.', alvo: 'w-barra' },
    { de: 20, ate: 20, o: 'Abre o `Tabs`, o contêiner que guarda o sistema de abas inteiro.', p: 'Ele junta as duas partes: o espaço onde a tela aparece e a lista de botões.' },
    { de: 21, ate: 21, o: 'Coloca o `TabSlot`, o espaço onde aparece a tela da aba selecionada. O estilo faz esse espaço ocupar toda a altura.', p: 'Quando você troca de aba, só o conteúdo do `TabSlot` muda. A barra continua no lugar.' },
    { de: 22, ate: 23, o: 'Abre a `TabList`, a lista com os botões das abas. Com `asChild`, a `TabList` não cria a própria caixa: ela passa suas props para o filho, o `CustomTabList`.', p: 'É assim que o modelo troca a lista padrão por uma barra com o visual que ele quer.', alvo: 'w-barra' },
    { de: 24, ate: 26, o: 'Cria o botão da aba Home. O `href="/"` é o endereço da tela inicial (`src/app/index.tsx`). Com `asChild`, quem aparece na tela é o `TabButton` com o texto Home.', p: 'Na versão web, o `name` é só um nome para a aba (aqui, `home`), e quem diz qual tela abrir é o `href`.', alvo: 'w-aba-home' },
    { de: 27, ate: 29, o: 'Cria o botão da aba Explore, que abre o endereço `/explore`, ou seja, a tela `src/app/explore.tsx`.', p: 'Funciona igual ao botão Home: o `href` aponta a tela e o `TabButton` desenha o botão.', alvo: 'w-aba-explore' },
    { de: 30, ate: 34, o: 'Fecha o `CustomTabList`, a `TabList`, o `Tabs`, o `return` e a função.', p: 'Toda tag aberta precisa ser fechada. Aqui termina a montagem das abas.' },
    { de: 35, ate: 36, o: 'Cria o `TabButton`, o botão de cada aba. Ele separa três coisas das props: `children` (o texto do botão), `isFocused` (se a aba está selecionada) e `...props` (todo o resto).', p: 'O `TabTrigger` envia essas props para o botão. O `isFocused` permite pintar a aba ativa de um jeito diferente.', alvo: 'w-aba-home' },
    { de: 37, ate: 38, o: 'Desenha um `Pressable` e repassa para ele as outras props com `{...props}`. O estilo é uma função: enquanto o botão está pressionado (`pressed`), usa o estilo `pressed`.', p: 'Entre as props repassadas está o que faz o clique trocar de aba. O estilo `pressed` deixa o botão um pouco transparente, mostrando que o clique foi sentido.', alvo: 'w-aba-home' },
    { de: 39, ate: 41, o: 'Cria o fundo do botão. Se a aba está selecionada, usa a cor `backgroundSelected`; se não, `backgroundElement`.', p: 'A cor de fundo diferente mostra qual aba está aberta.', alvo: 'w-aba-home' },
    { de: 42, ate: 44, o: 'Escreve o nome da aba (`children`, que aqui é Home ou Explore). O texto da aba ativa usa a cor `text`; o das outras, a cor `textSecondary`, mais apagada.', p: 'Junto com o fundo, a cor do texto reforça qual aba está selecionada.', alvo: 'w-aba-home' },
    { de: 45, ate: 49, o: 'Fecha o fundo, o `Pressable`, o `return` e a função `TabButton`.', p: 'Aqui termina o botão de aba, que é usado duas vezes: em Home e em Explore.' },
    { de: 50, ate: 50, o: 'Cria o `CustomTabList`, a barra flutuante do topo da página. Ele recebe as props que a `TabList` repassou por causa do `asChild`.', p: 'Entre essas props está o `children`, que são os botões das abas.', alvo: 'w-barra' },
    { de: 51, ate: 53, o: 'Descobre o tema atual e escolhe o grupo de cores certo em `Colors`, tratando `\'unspecified\'` como claro.', p: 'A cor do texto (`colors.text`) é usada no ícone do link Docs.' },
    { de: 54, ate: 55, o: 'Desenha a caixa externa da barra, repassa as props recebidas com `{...props}` e usa o estilo `tabListContainer`.', p: 'Esse estilo deixa a barra solta por cima da página, ocupando toda a largura.', alvo: 'w-barra' },
    { de: 56, ate: 56, o: 'Cria a pílula da barra, com a cor de fundo `backgroundElement` e o estilo `innerContainer`.', p: 'É a faixa arredondada onde ficam a marca, os botões e o link.', alvo: 'w-barra' },
    { de: 57, ate: 60, o: 'Escreve a marca Expo Starter em negrito pequeno (`smallBold`), com o estilo `brandText`.', p: 'O estilo `brandText` empurra o resto da barra para a direita, deixando a marca sozinha na esquerda.', alvo: 'w-marca' },
    { de: 61, ate: 62, o: 'Coloca aqui os filhos recebidos (`props.children`): os dois `TabTrigger` com os botões Home e Explore.', p: 'É por isso que os botões aparecem entre a marca e o link Docs.' },
    { de: 63, ate: 63, o: 'Cria um link externo para a documentação do Expo. Com `asChild`, quem aparece na tela é o `Pressable` de dentro.', p: 'O `ExternalLink` cuida de abrir o endereço. No navegador, ele abre numa nova aba.', alvo: 'w-docs' },
    { de: 64, ate: 65, o: 'Cria a área clicável com o estilo `externalPressable` e escreve o texto Docs no estilo de link (`type="link"`).', p: 'É o texto que o usuário clica para ir à documentação.', alvo: 'w-docs' },
    { de: 66, ate: 70, o: 'Desenha um ícone pequeno (`size={12}`) ao lado do texto, pintado com `colors.text`. O `name` tem um nome para cada plataforma: `arrow.up.right.square` no iOS e `link` na web.', p: 'Como este arquivo só roda no navegador, o nome usado de verdade é o `link`, da biblioteca Material Symbols.', alvo: 'w-docs' },
    { de: 71, ate: 76, o: 'Fecha o `Pressable`, o `ExternalLink`, a pílula, a caixa externa, o `return` e a função `CustomTabList`.', p: 'Aqui termina a barra. Os estilos vêm a seguir.' },
    { de: 77, ate: 78, o: 'Começa a criar os estilos do arquivo com `StyleSheet.create`.', p: 'Os estilos ficam juntos no fim do arquivo, o que deixa o JSX mais limpo.' },
    { de: 79, ate: 86, o: 'O estilo `tabListContainer` usa `position: \'absolute\'` para a barra flutuar por cima da página e `width: \'100%\'` para ocupar a largura toda. Também cria um espaço em volta (`padding`) e centraliza os itens em linha.', p: 'Por ser absoluta, a barra não empurra a tela para baixo: ela fica no topo, por cima do conteúdo.', alvo: 'w-barra' },
    { de: 87, ate: 96, o: 'O estilo `innerContainer` dá espaço interno à pílula, arredonda os cantos (`Spacing.five`, que vale 32), coloca os itens em linha e deixa 8 de distância entre eles (`gap`). O `flexGrow: 1` estica a pílula, mas no máximo até `MaxContentWidth`.', p: 'Em telas largas, a pílula não passa de 800 de largura e fica centralizada.', alvo: 'w-barra' },
    { de: 97, ate: 99, o: 'O estilo `brandText` usa `marginRight: \'auto\'`, uma margem automática à direita que ocupa todo o espaço livre.', p: 'Isso empurra os botões e o link Docs para a direita.', alvo: 'w-marca' },
    { de: 100, ate: 102, o: 'O estilo `pressed` deixa o botão com 70% de opacidade (`opacity: 0.7`).', p: 'É usado enquanto o botão está pressionado, como resposta visual ao clique.' },
    { de: 103, ate: 107, o: 'O estilo `tabButtonView` dá espaço interno ao fundo de cada botão de aba e arredonda os cantos.', p: 'Deixa cada botão com cara de etiqueta arredondada dentro da pílula.', alvo: 'w-aba-home' },
    { de: 108, ate: 115, o: 'O estilo `externalPressable` coloca o texto e o ícone do link Docs em linha, centralizados, com 4 de distância entre eles (`gap: Spacing.one`) e uma margem de 16 à esquerda. Depois, fecha o objeto de estilos.', p: 'A margem à esquerda separa o link Docs dos botões das abas.', alvo: 'w-docs' }
  ]
};
SIM.explicacoes['modelo:src/components/external-link.tsx'] = {
  resumo: {
    titulo: 'O link para fora do app',
    oque: 'Este arquivo cria o `ExternalLink`, um link para páginas fora do app, como a documentação do Expo. No celular, ele abre a página num navegador dentro do próprio app. No navegador, abre a página numa nova aba.',
    funcoes: [
      { nome: 'ExternalLink', texto: 'Um link para endereços fora do app, que se comporta do jeito certo em cada plataforma.' },
      { nome: 'openBrowserAsync', texto: 'Abre uma página da internet num navegador dentro do app, no celular.' }
    ]
  },
  unidades: [
    { de: 1, ate: 6, o: 'Importa o `Link` do Expo Router, a função `openBrowserAsync` (que abre um navegador dentro do app) e um tipo do React. Depois, define as props: as mesmas do `Link`, mas com `href` obrigatório e do tipo texto.', p: 'Assim o componente aceita tudo o que um `Link` aceita, e o TypeScript garante que um endereço seja enviado.' },
    { de: 7, ate: 25, o: 'Devolve um `Link` com `target="_blank"`, que no navegador abre o endereço numa nova aba. No `onPress`, se o app não está na web (`process.env.EXPO_OS !== \'web\'`), o código cancela o comportamento padrão e abre o endereço num navegador dentro do app, com `openBrowserAsync`.', p: 'No celular, o usuário vê a página sem sair do app. No navegador, o link funciona normalmente e abre outra aba.' }
  ]
};
SIM.explicacoes['modelo:src/components/hint-row.tsx'] = {
  resumo: {
    titulo: 'A linha de dica',
    oque: 'Este arquivo cria o `HintRow`, um componente que desenha uma linha com um título à esquerda e uma dica à direita, dentro de uma caixinha. A tela inicial usa esse componente três vezes, uma para cada dica. Ter um componente para isso evita repetir o mesmo código três vezes.',
    funcoes: [
      { nome: 'HintRow', texto: 'O componente da linha. Recebe `title` e `hint` e desenha os dois lado a lado.' },
      { nome: 'HintRowProps', texto: 'O tipo que descreve as props aceitas pelo componente. O `?` indica que as duas são opcionais.' },
      { nome: 'ReactNode', texto: 'Tipo que quer dizer "qualquer coisa que o React consegue desenhar". Permite que a dica seja um texto ou um componente.' },
      { nome: 'StyleSheet.create', texto: 'Cria os estilos `stepRow` (linha com os itens nas pontas) e `codeSnippet` (caixinha arredondada).' }
    ]
  },
  unidades: [
    { de: 1, ate: 1, o: 'Importa só o tipo `ReactNode` do React. `ReactNode` quer dizer "qualquer coisa que o React consegue desenhar": um texto, um número ou um componente.', p: 'O `import type` traz apenas uma informação para o TypeScript conferir o código. Ela não vira código no app final.' },
    { de: 2, ate: 3, o: 'Traz a `View`, uma caixa que agrupa outros elementos, e o `StyleSheet`, que organiza os estilos.', p: 'A linha de dica é uma caixa com duas partes lado a lado, e os estilos ficam no fim do arquivo.' },
    { de: 4, ate: 6, o: 'Importa os componentes `ThemedText` e `ThemedView`, que ficam na mesma pasta (por isso o `./` no caminho).', p: 'Eles são versões de `Text` e `View` que pegam sozinhas as cores do tema claro ou escuro.' },
    { de: 7, ate: 8, o: 'Importa `Spacing`, a tabela de espaçamentos do projeto.', p: 'Usar valores como `Spacing.two` em vez de números soltos deixa os espaços iguais em todo o app.' },
    { de: 9, ate: 12, o: 'Descreve as props que o `HintRow` aceita: `title`, que é um texto (`string`), e `hint`, que é qualquer coisa que o React desenha (`ReactNode`).', p: 'Props são as informações que um componente recebe de fora, como os parâmetros de uma função. O `?` depois do nome diz que a prop é opcional.' },
    { de: 13, ate: 14, o: 'Cria o componente `HintRow` e já separa as props `title` e `hint`. Se elas não forem enviadas, valem `\'Try editing\'` e `\'app/index.tsx\'`.', p: 'Esses valores padrão garantem que a linha nunca fique vazia, mesmo quando alguém não envia uma das props. No modelo, as três linhas da tela inicial enviam as duas.', alvo: 'm-dicas' },
    { de: 15, ate: 16, o: 'Começa a desenhar a linha: uma `View` com o estilo `stepRow`.', p: 'É esse estilo que coloca o título e a caixinha lado a lado, cada um numa ponta.', alvo: 'm-dica-1' },
    { de: 17, ate: 17, o: 'Escreve o título da dica, à esquerda, com o tipo de texto `small`.', p: 'É o texto que diz o assunto da dica, como "Try editing" ou "Dev tools".', alvo: 'm-dica-titulo' },
    { de: 18, ate: 20, o: 'Cria a caixinha da direita, com o fundo `backgroundSelected`, e coloca o `hint` dentro de um texto com a cor `textSecondary`.', p: 'A caixinha destaca a dica como um pedaço de código. Como `hint` é um `ReactNode`, pode ser um texto simples ou um componente. Na tela inicial, ele é outro `ThemedText`, que usa a própria cor.', alvo: 'm-dica-codigo' },
    { de: 21, ate: 24, o: 'Fecha a `View`, o `return` e a função `HintRow`.', p: 'Aqui termina a parte visual do componente. Os estilos vêm a seguir.' },
    { de: 25, ate: 25, o: 'Começa a criar os estilos do componente com `StyleSheet.create`.', p: 'Guardar os estilos num objeto separado deixa o JSX (a parte parecida com HTML) mais limpo.' },
    { de: 26, ate: 29, o: 'O estilo `stepRow` usa `flexDirection: \'row\'` para colocar os itens em linha e `justifyContent: \'space-between\'` para mandar um para cada ponta.', p: 'É por isso que o título fica na esquerda e a caixinha fica na direita.', alvo: 'm-dica-1' },
    { de: 30, ate: 35, o: 'O estilo `codeSnippet` arredonda os cantos da caixinha (`borderRadius`) e cria um espaço interno em cima, embaixo e dos lados (`padding`), usando valores de `Spacing`. Depois, fecha o objeto de estilos.', p: 'O espaço interno afasta o texto da borda, e os cantos arredondados deixam a caixinha com cara de etiqueta.', alvo: 'm-dica-codigo' }
  ]
};
SIM.explicacoes['modelo:src/components/themed-text.tsx'] = {
  resumo: {
    titulo: 'O texto que segue o tema',
    oque: 'Este arquivo cria o `ThemedText`, o componente de texto usado em todo o app. Ele escolhe sozinho a cor certa para o tema claro ou escuro e oferece estilos prontos, como `title`, `small`, `link` e `code`. Assim os textos ficam padronizados e você não precisa repetir estilos.',
    funcoes: [
      { nome: 'ThemedText', texto: 'Um `Text` que já usa a cor do tema e oferece estilos prontos pela prop `type`.' },
      { nome: 'ThemedTextProps', texto: 'O tipo das props: tudo o que o `Text` aceita, mais `type` e `themeColor`.' }
    ]
  },
  unidades: [
    { de: 1, ate: 10, o: 'Importa o `Text` do React Native, as fontes, o tipo de cor do tema e o hook `useTheme`. Depois, define as props do `ThemedText`: todas as do `Text` mais duas opcionais, `type` (o estilo do texto, como `\'title\'` ou `\'code\'`) e `themeColor` (qual cor do tema usar).', p: 'Com o tipo bem definido, o editor avisa se você escrever um `type` que não existe.' },
    { de: 11, ate: 32, o: 'O componente pega as cores do tema atual e monta uma lista de estilos: primeiro a cor (`themeColor` ou, se não vier, `\'text\'`), depois o estilo do `type` escolhido e, por último, o `style` que você enviar. As outras props passam direto para o `Text`.', p: 'Cada linha com `&&` só inclui o estilo quando o `type` combina; quando não combina, o valor é `false` e o React Native ignora. Como o `style` vem por último, ele vence os anteriores.' },
    { de: 33, ate: 73, o: 'Define o visual de cada tipo de texto: tamanho (`fontSize`), altura da linha (`lineHeight`) e peso da fonte (`fontWeight`). O `title` é o maior (48), o `linkPrimary` tem uma cor azul fixa e o `code` usa a fonte monoespaçada de `Fonts.mono`.', p: 'No `code`, o peso é 700 no Android e 500 nas outras plataformas: o `Platform.select` só tem valor para o Android, e o `??` usa 500 quando não há valor.' }
  ]
};
SIM.explicacoes['modelo:src/components/themed-view.tsx'] = {
  resumo: {
    titulo: 'A caixa que segue o tema',
    oque: 'Este arquivo cria o `ThemedView`, uma caixa (`View`) que pinta o próprio fundo com a cor do tema claro ou escuro. Quase todas as caixas do app usam este componente, o que mantém as cores iguais em todas as telas.',
    funcoes: [
      { nome: 'ThemedView', texto: 'Uma `View` que já usa a cor de fundo do tema atual. A prop `type` escolhe qual cor de fundo usar.' }
    ]
  },
  unidades: [
    { de: 1, ate: 11, o: 'Importa a `View`, o tipo de cor do tema (`ThemeColor`) e o hook `useTheme`. Depois, define as props: todas as da `View` mais `lightColor`, `darkColor` e `type`, todas opcionais.', p: 'O `type` permite escolher entre as cores de fundo do tema, como `backgroundElement` ou `backgroundSelected`.' },
    { de: 12, ate: 16, o: 'O componente pega as cores do tema e devolve uma `View` com a cor de fundo do `type` (ou `background`, se nenhum for enviado). O `style` que você enviar vem depois e pode completar ou trocar esse fundo.', p: 'Repare que `lightColor` e `darkColor` são recebidas, mas não são usadas no código. Elas são separadas das outras props e não chegam à `View`.' }
  ]
};
SIM.explicacoes['modelo:src/components/ui/collapsible.tsx'] = {
  resumo: {
    titulo: 'A seção que abre e fecha',
    oque: 'Este arquivo cria o `Collapsible`, uma seção com título que abre e fecha ao ser tocada. A tela Explore usa esse componente em cada tópico. Ele também é um bom exemplo de estado (`useState`) e de uma animação simples do Reanimated.',
    funcoes: [
      { nome: 'Collapsible', texto: 'A seção com título que mostra ou esconde o conteúdo ao ser tocada.' },
      { nome: 'FadeIn', texto: 'Animação pronta do Reanimated que faz o conteúdo surgir aos poucos.' }
    ]
  },
  unidades: [
    { de: 1, ate: 10, o: 'Importa o `SymbolView` (o ícone da setinha), o `useState`, o `Pressable` e, do Reanimated, o `Animated` com a animação pronta `FadeIn`. Também traz componentes e valores do próprio projeto.', p: 'O `FadeIn` faz o conteúdo surgir aos poucos, em vez de aparecer de uma vez.' },
    { de: 11, ate: 42, o: 'O componente recebe um título (`title`) e um conteúdo (`children`). O estado `isOpen` guarda se a seção está aberta, e tocar no cabeçalho inverte esse valor. A setinha gira conforme o estado (`\'-90deg\'` aberta, `\'90deg\'` fechada), e o conteúdo só aparece quando `isOpen` é verdadeiro, surgindo com `FadeIn` em 200 ms.', p: 'É um padrão comum em apps: mostrar só os títulos e deixar o usuário abrir o que quiser ler.' },
    { de: 43, ate: 65, o: 'Os estilos do cabeçalho (em linha, com espaço entre a setinha e o título), do efeito ao tocar (opacidade 0,7), do botão redondo da setinha e da caixa do conteúdo, com margens e cantos arredondados.', p: 'O botão tem 24 por 24 e `borderRadius: 12`, metade do lado, por isso fica redondo.' }
  ]
};
SIM.explicacoes['modelo:src/components/web-badge.tsx'] = {
  resumo: {
    titulo: 'O selo do Expo na web',
    oque: 'Este arquivo cria o selo do Expo que aparece no fim da tela quando o app roda no navegador. Ele mostra a versão do Expo instalada e uma imagem do selo que muda conforme o tema claro ou escuro. No modelo, as telas só usam este componente na versão web.',
    funcoes: [
      { nome: 'WebBadge', texto: 'O componente do selo: mostra a versão do Expo e a imagem do selo.' },
      { nome: 'version', texto: 'O número da versão do Expo instalada, lido do `package.json` da biblioteca `expo`.' },
      { nome: 'useColorScheme', texto: 'Informa o tema, para escolher entre a imagem clara e a escura do selo.' },
      { nome: 'aspectRatio', texto: 'Mantém a proporção da imagem: com a largura definida, a altura é calculada sozinha.' }
    ]
  },
  unidades: [
    { de: 1, ate: 1, o: 'Lê o campo `version` do arquivo `package.json` da biblioteca `expo`, que fica dentro da pasta `node_modules`. É o número da versão do Expo instalada no projeto.', p: 'Assim o selo mostra a versão certa sozinho, sem ninguém precisar escrever o número à mão.', alvo: 'w-versao' },
    { de: 2, ate: 2, o: 'Importa o componente `Image` da biblioteca `expo-image`.', p: 'É ele que mostra a imagem do selo.' },
    { de: 3, ate: 4, o: 'Traz do React Native o hook `useColorScheme` (tema claro ou escuro) e o `StyleSheet` (estilos).', p: 'O tema decide qual das duas imagens do selo aparece.' },
    { de: 5, ate: 7, o: 'Importa o `ThemedText` e o `ThemedView` da mesma pasta. São texto e caixa que seguem as cores do tema.', p: 'Com eles, o texto da versão e o fundo do selo combinam com o resto da tela.' },
    { de: 8, ate: 9, o: 'Importa `Spacing`, a tabela de espaçamentos do projeto.', p: 'Os espaços do selo usam os mesmos valores do resto do app.' },
    { de: 10, ate: 10, o: 'Cria o componente `WebBadge`, o selo do Expo que aparece no fim da tela.', p: 'O `index.tsx` só desenha este componente quando `Platform.OS === \'web\'`, ou seja, no navegador.', alvo: 'w-selo' },
    { de: 11, ate: 12, o: 'Descobre se o tema do sistema é claro ou escuro e guarda em `scheme`.', p: 'O selo tem duas imagens, uma para cada tema.' },
    { de: 13, ate: 14, o: 'Começa a devolver o selo: uma caixa com o estilo `container`.', p: 'Essa caixa centraliza a versão e a imagem, uma embaixo da outra.', alvo: 'w-selo' },
    { de: 15, ate: 17, o: 'Escreve a letra v seguida da versão do Expo (`{version}`), no estilo de código, com a cor `textSecondary` e centralizado.', p: 'A cor mais apagada deixa a versão discreta, como uma informação extra.', alvo: 'w-versao' },
    { de: 18, ate: 23, o: 'Mostra a imagem do selo. Se o tema for escuro, usa `expo-badge-white.png` (versão branca); se não, usa `expo-badge.png`.', p: 'Num fundo escuro, um selo escuro sumiria. Trocar a imagem conforme o tema mantém o selo sempre visível.', alvo: 'w-selo-imagem' },
    { de: 24, ate: 25, o: 'Aplica o estilo `badgeImage`, que define o tamanho da imagem, e fecha o componente `Image`.', p: 'Sem um tamanho definido, a imagem poderia aparecer grande ou pequena demais.', alvo: 'w-selo-imagem' },
    { de: 26, ate: 29, o: 'Fecha a caixa do selo, o `return` e a função `WebBadge`.', p: 'Aqui termina a parte visual. Os estilos vêm a seguir.' },
    { de: 30, ate: 35, o: 'Começa os estilos. O `container` cria um espaço interno de 32 (`Spacing.five`), centraliza os itens e deixa 8 de distância entre eles (`gap: Spacing.two`).', p: 'O espaço interno afasta o selo do conteúdo que está acima dele.', alvo: 'w-selo' },
    { de: 36, ate: 38, o: 'O estilo `versionText` centraliza o texto da versão.', p: 'Deixa a versão alinhada com a imagem do selo.', alvo: 'w-versao' },
    { de: 39, ate: 43, o: 'O estilo `badgeImage` dá 123 de largura à imagem. O `aspectRatio: 123 / 24` mantém a proporção, então a altura fica em 24 sozinha. Depois, fecha o objeto de estilos.', p: 'Com a proporção fixa, a imagem não fica esticada nem achatada.', alvo: 'w-selo-imagem' }
  ]
};
SIM.explicacoes['modelo:src/constants/theme.ts'] = {
  resumo: {
    titulo: 'As constantes de visual',
    oque: 'Este arquivo guarda as constantes de visual do app: as cores de cada tema, as fontes, os espaçamentos e algumas medidas. Os componentes importam daqui em vez de escrever valores soltos. Assim, para mudar uma cor no app inteiro, basta mudar aqui.',
    funcoes: [
      { nome: 'Colors', texto: 'As cores de cada tema, claro (`light`) e escuro (`dark`), com os mesmos nomes nos dois.' },
      { nome: 'Spacing', texto: 'A tabela de espaçamentos usada em margens, espaços internos e distâncias.' },
      { nome: 'Fonts', texto: 'As famílias de fonte certas para cada plataforma.' }
    ]
  },
  unidades: [
    { de: 1, ate: 9, o: 'O comentário explica que aqui ficam as cores do app, nos modos claro e escuro, e cita outras formas de estilizar. Depois, importa o `global.css` e o `Platform`.', p: 'As variáveis de fonte usadas na versão web, como `var(--font-display)`, vêm do `global.css` importado aqui.' },
    { de: 10, ate: 28, o: 'O objeto `Colors` guarda as cores de cada tema: `light` (claro) e `dark` (escuro). Os dois têm os mesmos nomes de cor, como `text`, `background` e `backgroundElement`, com valores diferentes. O `ThemeColor` é um tipo com esses nomes.', p: 'Como os nomes são iguais nos dois temas, o código pede só o nome da cor e o tema decide o valor. O `as const` diz que esses valores não vão mudar.' },
    { de: 29, ate: 53, o: 'O `Fonts` usa `Platform.select` para escolher as fontes de cada plataforma: fontes do sistema no iOS, nomes genéricos como `monospace` nas outras plataformas (`default`, que inclui o Android) e variáveis CSS na web.', p: 'Assim o mesmo nome, como `Fonts.mono`, funciona em todas as plataformas.' },
    { de: 54, ate: 65, o: 'O `Spacing` é a tabela de espaçamentos, de `half` (2) até `six` (64). O `BottomTabInset` é a altura reservada para a barra de abas: 50 no iOS, 80 no Android e 0 nas outras plataformas. O `MaxContentWidth` limita o conteúdo a 800 de largura.', p: 'Usar esses nomes em vez de números soltos deixa o visual consistente e fácil de ajustar num lugar só.' }
  ]
};
SIM.explicacoes['modelo:src/global.css'] = {
  resumo: {
    titulo: 'As fontes da versão web',
    oque: 'Este é o arquivo de estilos globais da versão web. Ele cria variáveis CSS com listas de fontes, que o `src/constants/theme.ts` usa para definir as fontes no navegador. No celular, as fontes vêm dos valores de `ios` e `default` do `Fonts`.',
    funcoes: [
      { nome: ':root', texto: 'O elemento raiz da página. As variáveis criadas nele valem para a página inteira.' }
    ]
  },
  unidades: [
    { de: 1, ate: 4, o: 'O `:root` é o elemento raiz da página web. Aqui ele cria a variável `--font-display`, uma lista de fontes em ordem de preferência: o navegador usa a primeira que estiver disponível.', p: 'Variáveis CSS começam com `--` e guardam um valor para ser reaproveitado. O `theme.ts` usa esta com `var(--font-display)`.' },
    { de: 5, ate: 9, o: 'Cria mais três variáveis: `--font-mono` (fontes de largura fixa, boas para código), `--font-rounded` (fontes arredondadas) e `--font-serif` (fontes com serifa). Depois, fecha o bloco.', p: 'Essas variáveis só valem na versão web, onde o app vira uma página HTML.' }
  ]
};
SIM.explicacoes['modelo:src/hooks/use-color-scheme.ts'] = {
  resumo: {
    titulo: 'O tema do sistema (celular)',
    oque: 'Este arquivo de uma linha só repassa o `useColorScheme` do React Native. Ele existe para formar um par com o `use-color-scheme.web.ts`: no celular vale esta versão e, no navegador, o Metro usa a versão web. Quem importa `@/hooks/use-color-scheme` recebe sempre a versão certa.',
    funcoes: [
      { nome: 'useColorScheme', texto: 'Informa o tema do sistema: `\'light\'`, `\'dark\'` ou, em alguns casos, `\'unspecified\'`.' }
    ]
  },
  unidades: [
    { de: 1, ate: 1, o: 'Reexporta o `useColorScheme` do React Native: pega a função de lá e a entrega com o mesmo nome, sem mudar nada.', p: 'Assim o projeto pode importar de `@/hooks/use-color-scheme`. No navegador, o Metro troca este arquivo pela versão `.web.ts`, que tem um ajuste para a web.' }
  ]
};
SIM.explicacoes['modelo:src/hooks/use-color-scheme.web.ts'] = {
  resumo: {
    titulo: 'O tema do sistema (web)',
    oque: 'Esta é a versão web do `useColorScheme`. Na web, o modelo gera as páginas antes, como HTML pronto (`"output": "static"` no `app.json`). Por isso este hook devolve o tema claro até a página estar pronta no navegador, e só depois passa a devolver o tema real do sistema.',
    funcoes: [
      { nome: 'useColorScheme', texto: 'Versão web do hook de tema: devolve `\'light\'` até a página ficar pronta no navegador e depois o tema real.' },
      { nome: 'useEffect', texto: 'Roda um código depois que o componente aparece. Aqui marca que a página já está pronta no navegador.' }
    ]
  },
  unidades: [
    { de: 1, ate: 6, o: 'Importa `useEffect` e `useState` do React e o `useColorScheme` do React Native com outro nome, `useRNColorScheme`. O comentário explica o motivo do arquivo: com renderização estática, o tema precisa ser calculado de novo no navegador.', p: 'Renderização estática quer dizer que as páginas são geradas antes, como HTML pronto. Nessa hora não existe navegador para dizer qual é o tema. O nome novo evita confusão, porque a função deste arquivo também se chama `useColorScheme`.' },
    { de: 7, ate: 21, o: 'O hook começa com `hasHydrated` falso. Logo depois que o componente aparece no navegador, o `useEffect` muda esse valor para verdadeiro. Antes disso, o hook devolve sempre `\'light\'`; depois, devolve o tema real do sistema.', p: 'Hidratação é quando o React assume o HTML pronto e o deixa interativo no navegador. Devolver `\'light\'` até lá faz a primeira tela no navegador ficar igual ao HTML gerado antes.' }
  ]
};
SIM.explicacoes['modelo:src/hooks/use-theme.ts'] = {
  resumo: {
    titulo: 'O hook das cores do tema',
    oque: 'Este arquivo cria o hook `useTheme`, que entrega as cores do tema atual, claro ou escuro. O `ThemedText`, o `ThemedView` e as telas usam esse hook. Ele junta duas coisas: o tema do sistema e a tabela de cores do `theme.ts`.',
    funcoes: [
      { nome: 'useTheme', texto: 'Hook do projeto que devolve as cores do tema atual, prontas para usar.' }
    ]
  },
  unidades: [
    { de: 1, ate: 8, o: 'O comentário traz um link para aprender mais sobre os modos claro e escuro. Depois, importa `Colors` e o `useColorScheme` do próprio projeto.', p: 'Importar de `@/hooks/use-color-scheme` garante que, na web, seja usada a versão `.web.ts`.' },
    { de: 9, ate: 14, o: 'O `useTheme` pega o tema atual, troca `\'unspecified\'` por `\'light\'` e devolve o grupo de cores certo de `Colors`.', p: 'Os componentes chamam `useTheme()` e recebem as cores prontas, como `theme.text` e `theme.background`.' }
  ]
};
SIM.explicacoes['modelo:tsconfig.json'] = {
  resumo: {
    titulo: 'A configuração do TypeScript',
    oque: 'O `tsconfig.json` configura o TypeScript no projeto. Ele usa a base preparada pelo Expo, liga o modo rigoroso e cria os atalhos `@/` e `@/assets/`, usados nos imports de todo o app.',
    funcoes: [
      { nome: 'paths', texto: 'Atalhos de caminho, como `@/` para a pasta `src/`.' },
      { nome: 'strict', texto: 'Liga a conferência mais rigorosa do TypeScript.' }
    ]
  },
  unidades: [
    { de: 1, ate: 4, o: 'O `extends` aproveita a configuração base que o Expo prepara para o TypeScript. O `"strict": true` liga o modo rigoroso, em que o TypeScript confere o código com mais cuidado.', p: 'Com o modo rigoroso, muitos erros aparecem no editor antes de o app rodar.' },
    { de: 5, ate: 13, o: 'Os `paths` criam atalhos para caminhos: `@/` aponta para a pasta `src/` e `@/assets/` aponta para a pasta `assets/`.', p: 'Por isso você escreve `@/components/themed-text` em qualquer arquivo, sem precisar contar quantas pastas subir.' },
    { de: 14, ate: 20, o: 'O `include` diz quais arquivos o TypeScript deve conferir: todos os `.ts` e `.tsx`, e os tipos gerados pelo Expo (`.expo/types` e `expo-env.d.ts`).', p: 'Os tipos gerados ajudam, por exemplo, o recurso `typedRoutes` do `app.json` a conferir os endereços das telas.' }
  ]
};
