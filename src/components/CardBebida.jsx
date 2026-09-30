import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material'

function CardBebida({ bebida, favorita, favoritar, verDetalhes }) {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="190"
        image={bebida.strDrinkThumb}
        alt={bebida.strDrink}
      />

      <CardContent>
        <Typography variant="h6">{bebida.strDrink}</Typography>

        <div className="botoes-card">
          <Button
            variant="contained"
            size="small"
            onClick={() => verDetalhes(bebida.idDrink)}
          >
            Ver receita
          </Button>

          <Button
            size="small"
            color="secondary"
            onClick={() => favoritar(bebida.idDrink)}
          >
            {favorita ? '★ Favorito' : '☆ Favoritar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardBebida
