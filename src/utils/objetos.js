// Saca los campos vacios de un objeto antes de mandarlo a la API.
// Los esquemas del backend no aceptan strings vacios en campos opcionales
// (por ejemplo ubicacion: ""), y un filtro vacio no deberia viajar en la URL.
export const quitarVacios = (objeto) =>
  Object.fromEntries(
    Object.entries(objeto).filter(
      ([, valor]) => valor !== '' && valor !== undefined && valor !== null && !Number.isNaN(valor)
    )
  )

// Para inputs numericos: react-hook-form entrega siempre strings. Un campo
// vacio pasa a undefined (campo opcional sin cargar) y el resto a numero.
export const aNumeroOpcional = (valor) => (valor === '' || valor === null ? undefined : Number(valor))
