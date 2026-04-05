# VPEX Hub — Brainstorm de Design

## Contexto
Portal de gestão centralizada para franqueados (O Boticário, Cacau Show). Usuários não-tech que operam no limite. Design System: Dark Mode Premium, Verde Neon #39FF14, Sora/Inter.

---

<response>
<text>

## Ideia 1: "Command Center" — Brutalismo Digital Refinado

**Design Movement:** Neo-Brutalismo adaptado ao Dark Mode, com elementos de interfaces de controle militar/aeronáutico.

**Core Principles:**
1. Dados como protagonistas — números gigantes, sem decoração supérflua.
2. Hierarquia por peso visual — o que importa é maior e mais brilhante.
3. Bordas retas e cantos mínimos — transmite seriedade e precisão.

**Color Philosophy:** Fundo preto absoluto (#050505) com verde neon (#39FF14) exclusivamente para dados positivos e CTAs. Cinza médio (#6B7280) para texto secundário. Vermelho (#FF3131) e amarelo (#FFD700) apenas para alertas reais.

**Layout Paradigm:** Grid assimétrico com sidebar fixa estreita (ícones apenas) e área de conteúdo dividida em blocos de dados densos. Sem espaço desperdiçado.

**Signature Elements:** Indicadores de status tipo "semáforo" pulsantes; linhas de grade sutis no fundo como papel milimetrado digital.

**Interaction Philosophy:** Zero animações decorativas. Transições instantâneas. Feedback tátil via mudança de cor/brilho.

**Animation:** Apenas micro-animações funcionais: pulso em alertas, fade-in de dados ao carregar.

**Typography System:** Sora Black para números de KPI (48-64px), Sora SemiBold para títulos de seção, Inter Regular para corpo.

</text>
<probability>0.07</probability>
</response>

<response>
<text>

## Ideia 2: "Glass Cockpit" — Glassmorphism Escuro com Profundidade

**Design Movement:** Glassmorphism sobre Dark Mode, inspirado em painéis de cockpit de aviões modernos e interfaces automotivas de luxo.

**Core Principles:**
1. Camadas de profundidade — cards translúcidos sobre fundo com gradiente radial sutil.
2. Foco guiado — o olho é conduzido naturalmente pelo brilho neon.
3. Conforto visual — bordas suaves e blur criam sensação de premium sem agressividade.

**Color Philosophy:** Fundo com gradiente radial sutil (do #0A0A0A centro para #050505 bordas). Verde neon (#39FF14) como luz guia. Cards com fundo rgba(255,255,255,0.04) e backdrop-blur. Bordas em rgba(57,255,20,0.08).

**Layout Paradigm:** Sidebar colapsável com ícones grandes e labels claros. Conteúdo principal em grid de cards com espaçamento generoso. Cada card é uma "janela" de informação autocontida.

**Signature Elements:** Efeito de glow suave atrás dos cards principais; gradiente radial verde muito sutil no centro da página que "respira".

**Interaction Philosophy:** Hover revela profundidade extra (elevação do card). Cliques são confirmados com flash neon sutil.

**Animation:** Entrada dos cards com stagger (0.05s entre cada), hover com scale(1.01) e aumento de glow. Barras de progresso animam ao entrar na viewport.

**Typography System:** Sora Bold para títulos e KPIs, Sora Medium para subtítulos, Inter 400/500 para corpo e labels.

</text>
<probability>0.08</probability>
</response>

<response>
<text>

## Ideia 3: "Stealth Dashboard" — Minimalismo Cirúrgico Japonês

**Design Movement:** Wabi-Sabi Digital — minimalismo japonês aplicado a interfaces de dados. Inspirado em interfaces de relógios Casio G-Shock e painéis de instrumentos Lexus.

**Core Principles:**
1. Ma (間) — o espaço vazio é tão importante quanto o preenchido.
2. Kanso (簡素) — simplicidade radical, cada elemento justifica sua existência.
3. Shibui (渋い) — beleza discreta que revela profundidade com o uso.

**Color Philosophy:** Fundo #0A0A0A uniforme e limpo. Verde neon (#39FF14) usado com extrema parcimônia — apenas em 1-2 elementos por tela. Texto principal em #E5E5E5. Texto secundário em #737373. Sem gradientes no fundo.

**Layout Paradigm:** Sidebar mínima com ícones monocromáticos. Conteúdo em coluna única ou grid 2x2 máximo. Muito espaço entre seções. Cards com bordas quase invisíveis.

**Signature Elements:** Uma única linha verde neon fina (1px) como separador entre seções; números de KPI com tracking ultra-wide (letter-spacing: 0.1em).

**Interaction Philosophy:** Transições lentas e elegantes (300-400ms). Hover muda apenas a opacidade. Nada pisca, nada pulsa — calma e controle.

**Animation:** Fade-in suave dos elementos (opacity 0→1, 400ms). Sem bounce, sem spring. Barras de progresso preenchem lentamente.

**Typography System:** Sora Light para KPIs gigantes (contraste pelo tamanho, não pelo peso), Sora SemiBold para títulos, Inter 400 para tudo mais.

</text>
<probability>0.06</probability>
</response>

---

## Decisão
**Abordagem escolhida: Ideia 2 — "Glass Cockpit"**

A abordagem Glass Cockpit é a mais adequada para o perfil de franqueados que operam no limite. Ela combina a densidade de dados necessária com uma estética premium que transmite confiança e controle. O glassmorphism sobre dark mode cria profundidade sem complexidade visual, e o verde neon como "luz guia" conduz o olhar do usuário não-tech para o que importa. As animações suaves de entrada e hover dão a sensação de um produto vivo e responsivo, sem sobrecarregar.
