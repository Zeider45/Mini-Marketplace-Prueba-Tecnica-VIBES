# test-vibes

Mi proyecto fullstack Mini-marketplace con API REST en Express + TypeScript y frontend en Next.js para mi evaluacion tecnica para VIBES, usando bun, un runtime moderno para Javascript y Typescript, me ayudo a crear de manera eficiente el proyecto de la API sin tener que configurar de cero typescript y el entorno de desarrollo.

## Estructura del proyecto

- `/api`: Backend Express con endpoints para productos tanto en JSON como en MongoDB.
- `/web`: Frontend Next.js que consume la API.
- `/shared`: Tipos y utilidades compartidas.

## Instalación

1. Clona el repositorio.
2. Instala Bun si no lo tienes: [https://bun.com/](https://bun.com/)
3. instala dependencias en los directorios usando bun:

```sh
  cd ./api && bun install
  cd ../web && bun install
```

## Configuración del router de productos

Puedes elegir entre el router de productos basado en MongoDB o el basado en JSON para el backend.  
La selección se realiza modificando el archivo `api/src/index.ts`:

- Para usar el router de MongoDB, asegúrate de que la línea activa sea:
  ```js
  app.use("/api/products", mongoProductsRouter);
  ```
- Para usar el router de JSON, comenta la línea anterior y descomenta:
  ```js
  app.use("/api/products", jsonProductsRouter);
  ```

## Ejecución

- **API**:
  ```sh
  cd api
  bun run dev
  ```
- **Web**:
  ```sh
  cd web
  bun run dev
  ```

## Decisiones

- Se decidió que, cada vez que el usuario aplica o modifica un filtro en la página de productos, se realice una nueva solicitud al endpoint correspondiente en lugar de traer inicialmente todos los productos y filtrarlos en el cliente, esto con el fin de los siguientes objetivos:

  - Unicamente se consultan y envían desde el servidor los productos que cumplen con los criterios de filtrado, evitando transferencias innecesarias de grandes volúmenes de información.

  - Al no cargar y procesar la totalidad de los productos en el navegador, se reduce el consumo de memoria y se mejora la experiencia del usuario.

  - Permite manejar catálogos de productos más extensos sin afectar de manera significativa el tiempo de carga ni el uso de recursos en el cliente.

  - Por lo tanto la lógica de filtrado se centraliza en el servidor, mientras que el cliente se encarga únicamente de solicitar y mostrar los resultados necesarios, garantizando así una mayor eficiencia en la aplicación.

- Se ha decidido mantener la funcionalidad de mostrar los tres productos más baratos como un apartado independiente, separado de los filtros de búsqueda generales. Esta decisión busca mejorar la legibilidad y escalabilidad del sistema, evitando que la lógica de filtrado principal se sobrecargue o genere conflictos. De esta manera, la visualización de los productos destacados se mantiene clara y fácilmente extensible a futuras funcionalidades.

- A nivel de interfaz, se han creado funciones específicas para renderizar los productos filtrados y los tres productos más baratos de manera independiente. Esta separación permite un código más limpio y legible, facilitando su mantenimiento y la incorporación de nuevas características sin afectar la estructura existente.

## Pendientes

- Actualmente, la lógica de filtrado se encuentra implementada únicamente a nivel de código en el cliente. Como mejora pendiente, planteo integrar los parámetros de filtrado directamente en la URL del navegador, de esta manera, la URL contendría los filtros aplicados, al compartir el enlace, la página cargará directamente con los filtros ya aplicados.

- Falta agregar tests automáticos tanto para el backend como para el frontend, para asegurar el correcto funcionamiento y facilitar el mantenimiento futuro.
