import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CardBebida from './components/CardBebida'
import ModalBebida from './components/ModalBebida'

const API = 'https://www.thecocktaildb.com/api/json/v1/1'

// 9 = 3 colunas em telas grandes, então as linhas do grid ficam cheias
const POR_PAGINA = 9

function App() {
  const [bebidas, setBebidas] = useState([])
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState('az')
  const [favoritos, setFavoritos] = useState([])
  const [somenteFavoritos, setSomenteFavoritos] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [bebidaSelecionada, setBebidaSelecionada] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)

  // serve para voltar ao topo da lista quando o usuário troca de página
  const inicioLista = useRef(null)

  // Executa uma vez quando a aplicação é aberta
  useEffect(() => {
    buscarBebidas()

    const salvos = JSON.parse(localStorage.getItem('favoritos')) || []
    setFavoritos(salvos)
  }, [])

  async function buscarBebidas() {
    try {
      // fetch faz a requisição AJAX e recebe os dados em JSON
      const resposta = await fetch(`${API}/filter.php?a=Non_Alcoholic`)
      const dados = await resposta.json()

      setBebidas(dados.drinks || [])
    } catch (error) {
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  async function verDetalhes(id) {
    try {
      // Busca os dados completos somente da bebida escolhida
      const resposta = await fetch(`${API}/lookup.php?i=${id}`)
      const dados = await resposta.json()

      setBebidaSelecionada(dados.drinks[0])
      setModalAberto(true)
    } catch (error) {
      setErro(true)
    }
  }

  function favoritar(id) {
    let novaLista

    if (favoritos.includes(id)) {
      novaLista = favoritos.filter((item) => item !== id)
    } else {
      novaLista = [...favoritos, id]
    }

    setFavoritos(novaLista)

    // localStorage mantém os favoritos mesmo depois de fechar o navegador
    localStorage.setItem('favoritos', JSON.stringify(novaLista))
  }

  // Cada filtro volta para a primeira página, senão o usuário pode cair numa página vazia
  function pesquisar(valor) {
    setBusca(valor)
    setPagina(1)
  }

  function ordenar(valor) {
    setOrdem(valor)
    setPagina(1)
  }

  function alternarFavoritos() {
    setSomenteFavoritos((valor) => !valor)
    setPagina(1)
  }

  function trocarPagina(novaPagina) {
    setPagina(novaPagina)
    inicioLista.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // useMemo evita refazer o filtro se os valores abaixo não mudarem
  const bebidasFiltradas = useMemo(() => {
    let resultado = bebidas.filter((bebida) =>
      bebida.strDrink.toLowerCase().includes(busca.toLowerCase()),
    )

    // o botão de favoritos corta a lista antes mesmo de ordenar
    if (somenteFavoritos) {
      resultado = resultado.filter((bebida) => favoritos.includes(bebida.idDrink))
    }

    return [...resultado].sort((a, b) => {
      if (ordem === 'za') {
        return b.strDrink.localeCompare(a.strDrink)
      }

      return a.strDrink.localeCompare(b.strDrink)
    })
  }, [bebidas, busca, ordem, somenteFavoritos, favoritos])

  const totalPaginas = Math.max(1, Math.ceil(bebidasFiltradas.length / POR_PAGINA))

  // a lista pode encolher ao desfavoritar algo, e aí a página atual deixa de existir
  const paginaAtual = Math.min(pagina, totalPaginas)

  const bebidasVisiveis = useMemo(
    () =>
      bebidasFiltradas.slice(
        (paginaAtual - 1) * POR_PAGINA,
        paginaAtual * POR_PAGINA,
      ),
    [bebidasFiltradas, paginaAtual],
  )

  return (
    <>
      <header>
        <h1>Mocktail Explorer</h1>
        <p>Encontre receitas de bebidas sem álcool</p>
      </header>

      <Container maxWidth="lg" className="conteudo">
        <div className="filtros">
          <TextField
            label="Pesquisar bebida"
            value={busca}
            onChange={(event) => pesquisar(event.target.value)}
            className="campo-busca"
            fullWidth
          />

          <TextField
            select
            label="Ordenar"
            value={ordem}
            onChange={(event) => ordenar(event.target.value)}
            className="ordenar"
          >
            <MenuItem value="az">A - Z</MenuItem>
            <MenuItem value="za">Z - A</MenuItem>
          </TextField>

          <Button
            variant={somenteFavoritos ? 'contained' : 'outlined'}
            color="secondary"
            onClick={alternarFavoritos}
            className="botao-favoritos"
          >
            {somenteFavoritos ? '★ Só favoritos' : '☆ Ver favoritos'}
            {favoritos.length > 0 && ` (${favoritos.length})`}
          </Button>
        </div>

        <div ref={inicioLista} />

        <Typography sx={{ mb: 2 }}>
          {somenteFavoritos
            ? `${bebidasFiltradas.length} de ${favoritos.length} favoritos`
            : `${bebidasFiltradas.length} bebidas encontradas`}
        </Typography>

        {erro && (
          <Alert severity="error">
            Ocorreu um erro ao buscar os dados da API.
          </Alert>
        )}

        {carregando ? (
          <div className="carregando">
            <CircularProgress />
          </div>
        ) : (
          <>
            {bebidasVisiveis.length === 0 ? (
              <Alert severity="info">
                {somenteFavoritos
                  ? 'Você ainda não favoritou nenhuma bebida. Use o botão ☆ Favoritar em um card.'
                  : 'Nenhuma bebida encontrada com esse nome.'}
              </Alert>
            ) : (
              <div className="lista">
                {bebidasVisiveis.map((bebida) => (
                  <CardBebida
                    key={bebida.idDrink}
                    bebida={bebida}
                    favorita={favoritos.includes(bebida.idDrink)}
                    favoritar={favoritar}
                    verDetalhes={verDetalhes}
                  />
                ))}
              </div>
            )}

            {totalPaginas > 1 && (
              <Stack alignItems="center" className="paginacao">
                <Pagination
                  count={totalPaginas}
                  page={paginaAtual}
                  onChange={(event, valor) => trocarPagina(valor)}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            )}
          </>
        )}
      </Container>

      <ModalBebida
        aberto={modalAberto}
        fechar={() => setModalAberto(false)}
        bebida={bebidaSelecionada}
      />
    </>
  )
}

export default App