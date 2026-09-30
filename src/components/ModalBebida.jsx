import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

function ModalBebida({ aberto, fechar, bebida }) {
  if (!bebida) return null

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
        <img
          className="imagem-modal"
          src={bebida.strDrinkThumb}
          alt={bebida.strDrink}
        />

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
