## Auth con JWT y mongoose

El servidor express corre en el puerto 4000 por defecto.

Para que funcione necesita dos variables de entorno:

- `DB_URI` Corresponde a la dirección de la base de datos mongo
- `ACCESS_TOKEN` Corresponde al 'secreto' necesario para la firma y verificación de JWT
