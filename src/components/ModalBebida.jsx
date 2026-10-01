import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Typography,
} from '@mui/material'

function ModalBebida({ aberto, fechar, bebida }) {
  const [carregandoImagem, setCarregandoImagem] = useState(true)
  const [falhaImagem, setFalhaImagem] = useState(false)

  // Cada bebida tem uma imagem própria, então o estado reinicia ao trocar de receita
  useEffect(() => {
    setCarregandoImagem(true)
    setFalhaImagem(false)
  }, [bebida])

  if (!bebida) return null

  // A API nem sempre preenche o campo, então o modal continua funcionando sem imagem
  const temImagem = Boolean(bebida.strDrinkThumb)
  const mostrarAviso = !temImagem || falhaImagem

  const ingredientes = []

  // A API manda os ingredientes em campos separados, por isso percorremos de 1 até 15
  for (let i = 1; i <= 15; i++) {
    const ingrediente = bebida[`strIngredient${i}`]
    const medida = bebida[`strMeasure${i}`]

    if (ingrediente) {
      ingredientes.push(`${medida || ''} ${ingrediente}`.trim())
    }
  }

  return (
    <Dialog open={aberto} onClose={fechar} fullWidth maxWidth="sm">
      <DialogTitle>{bebida.strDrink}</DialogTitle>

      <DialogContent>
        <div className="area-imagem">
          {carregandoImagem && !mostrarAviso && (
            <Skeleton
              variant="rectangular"
              animation="wave"
              className="esqueleto-imagem"
            />
          )}

          {mostrarAviso ? (
            <Typography variant="body2" color="text.secondary">
              Imagem indisponível para esta bebida.
            </Typography>
          ) : (
            <img
              className="imagem-modal"
              src={bebida.strDrinkThumb}
              alt={bebida.strDrink}
              style={{ opacity: carregandoImagem ? 0 : 1 }}
              onLoad={() => setCarregandoImagem(false)}
              onError={() => setFalhaImagem(true)}
            />
          )}
        </div>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Ingredientes
        </Typography>

        <ul>
          {ingredientes.map((ingrediente, index) => (
            <li key={index}>{ingrediente}</li>
          ))}
        </ul>

        <Typography variant="h6">Modo de preparo</Typography>
        <Typography>
          {bebida.strInstructions || 'Instruções não disponíveis.'}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={fechar}>Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalBebida
