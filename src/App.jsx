import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  CircularProgress,
  Container,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import CardBebida from './components/CardBebida'
import ModalBebida from './components/ModalBebida'

const API = 'https://www.thecocktaildb.com/api/json/v1/1'

function App() {
  const [bebidas, setBebidas] = useState([])
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState('az')
  const [favoritos, setFavoritos] = useState([])
  const [bebidaSelecionada, setBebidaSelecionada] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)

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

  // useMemo evita refazer o filtro se os valores abaixo não mudarem
  const bebidasFiltradas = useMemo(() => {
    const resultado = bebidas.filter((bebida) =>
      bebida.strDrink.toLowerCase().includes(busca.toLowerCase()),
    )

    return [...resultado].sort((a, b) => {
      if (ordem === 'za') {
        return b.strDrink.localeCompare(a.strDrink)
      }

      return a.strDrink.localeCompare(b.strDrink)
    })
  }, [bebidas, busca, ordem])

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
            onChange={(event) => setBusca(event.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Ordenar"
            value={ordem}
            onChange={(event) => setOrdem(event.target.value)}
            className="ordenar"
          >
            <MenuItem value="az">A - Z</MenuItem>
            <MenuItem value="za">Z - A</MenuItem>
          </TextField>
        </div>

        <Typography sx={{ mb: 2 }}>
          {bebidasFiltradas.length} bebidas encontradas
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
          <div className="lista">
            {bebidasFiltradas.map((bebida) => (
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
