# Revisión de portfolio y CV - finalizada el 1 de noviembre de 2026

## Estado y comparación

- Rama de trabajo local: `portfolio-international-profile`.
- Base de comparación: `master`, commit `b1130e5` (actualización de Momentum).
- No se han hecho pushes, pull requests ni despliegues de esta rama. La web publicada permanece intacta.
- Comparación: `git diff master...portfolio-international-profile` tras el commit local, o panel Review contra `master`.
- Previsualización: `npm run dev -- --host 127.0.0.1 --port 4322`; español `/`, inglés `/en/`.

## Auditoría inicial

Arquitectura inspeccionada: Astro 6, adaptador Vercel, renderizado de servidor, páginas ES/EN, componentes de presentación, API de contacto Brevo, API del asistente OpenAI, i18n y activos públicos. No se han modificado los servicios de los proyectos externos.

El CV se descargaba como dos PDF estáticos importados desde `src/assets/`; no existía generador en este repositorio. Los textos profesionales se repetían en dos diccionarios, dos documentos y un contexto de chatbot. Los PDF tenían dos columnas y al extraer texto aparecían idiomas, tecnologías y formación antes del perfil y la experiencia. En los PDF figuraba B2.2, mientras que la web y el contexto del asistente confirmaban B2. Se conserva B2, con la referencia Cambridge ya existente, sin inventar un examen concreto.

La experiencia de I-MAS estaba resumida en un párrafo. No explicaba con suficiente precisión la autonomía, las APIs, las relaciones de datos, los merge requests ni las revisiones de compañeros. Los proyectos aparecían antes de la experiencia profesional. Las tecnologías se mostraban en un carrusel animado que no diferenciaba su contexto de uso. Faltaban canonical, hreflang, Open Graph, sitemap y datos estructurados.

En móvil se detectó desbordamiento en cabecera, botones del CV y formulario: el `box-sizing` del layout estaba limitado por el CSS encapsulado de Astro. El icono negro de GitHub tenía escasa visibilidad en modo oscuro.

## Cambios de contenido

- Presentación como desarrollador frontend / full-stack, sin etiquetas Senior ni un nivel Mid consolidado.
- React, TypeScript y Node.js ligados a experiencia en producción; SQL/MySQL, APIs y bases de datos descritos sin inventar arquitectura ni resultados.
- Autonomía situada dentro de un equipo con code review y apoyo/revisión del tech lead.
- Cuatro responsabilidades concretas en I-MAS: investigación, implementación, integración y revisión.
- Experiencia profesional antes de proyectos; se mantiene también la experiencia anterior en atención al cliente, almacén y deporte.
- Proyectos profesionales, personales y formativos etiquetados. Se conservan los enlaces públicos existentes y se recupera la app de catálogo multimedia documentada en los CV originales.
- Momentum se presenta como PWA disponible; su versión nativa, widgets y pantalla de bloqueo siguen siendo planes futuros.
- Interés en equipos en inglés de Dinamarca y Suiza, sin afirmar nacionalidad, permiso de trabajo ni compromiso de traslado.

## DFM y confidencialidad

La propuesta usa el título genérico «Software industrial DFM · integración de IA». Explica únicamente la contribución frontend y la integración de un visualizador, funciones de análisis y APIs de IA en una aplicación desarrollada en equipo.

No incorpora Proto&Go, nombres de clientes, archivos STEP/PDF, documentos técnicos, capturas internas, rutas de servicios, arquitectura, modelos, lógica propietaria, métricas ni el nombre de un proyecto interno. No atribuye entrenamiento de modelos, algoritmos geométricos o autoría del motor de análisis. La información ya pública de la tarjeta Fabriqer se conserva separada; no se asocia explícitamente con el caso DFM.

Incluso esta descripción general debe validarse antes de publicar. Ningún texto se ha enviado a Vercel, GitHub ni servicios de IA. El nuevo sistema interno previsto para noviembre no se incluye en el perfil, los PDF ni el contexto del asistente: no se ha confirmado que haya comenzado ni qué responsabilidades se han asumido.

## Fuente profesional y CV

`src/data/professional-profile.json` centraliza identidad, experiencia, formación, idiomas, categorías técnicas y proyectos bilingües. La web, el contexto público del asistente y el generador del CV consumen esta fuente. Los proyectos usan los mismos títulos, roles y URLs; `cvOrder` selecciona los del documento y `cvDescription` permite una versión breve sin duplicar sus metadatos.

Se conserva la descarga de los PDF desde `src/assets/` y se añade:

- `scripts/generate-cv.py`: genera ambas versiones con ReportLab; exige una página.
- `scripts/verify-cv.py`: comprueba extracción, secciones, palabras verificadas, enlaces y límites.
- `scripts/requirements-cv.txt`: dependencias Python reproducibles.
- `output/pdf/`: copias para revisar, excluidas de Git. Los PDF integrados en la web sí se versionan.

El CV inglés es la descarga principal del hero en ambos idiomas. La sección CV ofrece también la versión española. Ambos documentos usan una columna, texto seleccionable, encabezados convencionales, tipografía de 9-10 puntos en contenido y enlaces profesionales. No hay foto, barras de habilidades, gráficos ni palabras clave ocultas.

Generación y verificación, con un Python que tenga las dependencias instaladas:

```sh
python3 -m pip install -r scripts/requirements-cv.txt
npm run cv:generate
npm run cv:verify
```

Los PDF originales se conservan en el historial Git para comparar. Los resúmenes de proyectos y competencias genéricas se han priorizado para mantener una página; el detalle completo queda en la web.

## UI, accesibilidad y SEO

Se mantienen tipografía, colores, identidad, hero y tarjetas del sitio. La revisión añade:

- Descarga del CV visible desde el hero y acceso directo a experiencia.
- Selector explícito «English / Español», conservando el ancla al cambiar de idioma.
- Competencias agrupadas en texto real: frontend, backend/datos, colaboración y proyectos personales/adicional.
- Listas de responsabilidades y definición de contribución/estado en proyectos donde están acreditados.
- Enlace para saltar al contenido, foco visible, respeto de movimiento reducido y mejor contraste en tema claro.
- Corrección del desbordamiento móvil y del icono de GitHub en tema oscuro.
- Dimensiones reservadas y decodificación asíncrona para imágenes de proyectos.
- Titles y descriptions técnicos, canonical por idioma, hreflang recíproco ES/EN y x-default inglés.
- Open Graph y Twitter usando una imagen pública existente, sin crear capturas ficticias.
- JSON-LD ProfilePage/Person: puesto, empresa, competencias y enlaces comprobables. Sin datos inventados de contratación, valoración o resultados.
- `public/robots.txt` y `public/sitemap.xml`.

No se cambia `/` a inglés para evitar romper la URL española existente. `/en/`, selector visible y CV inglés prioritario facilitan el acceso internacional.

## Comprobaciones

- `npm run check`: 0 errores, 0 warnings, 0 hints. Se añadieron herramientas de desarrollo oficiales Astro/TypeScript y tipos de Node; sin nuevas dependencias de producción.
- `npm run build`: correcto con el adaptador de Vercel.
- `npm test`: 3 pruebas de coherencia bilingüe, omisión de detalles internos y activos/URLs.
- `npm run test:site`: ambas rutas devuelven HTML válido para las comprobaciones de idioma, H1 único, canonical/hreflang, JSON-LD, anclas y descargas. Los bytes descargados coinciden con los PDF actuales.
- PDF ES/EN: una página; extracción con pypdf y pdfplumber; orden perfil -> competencias -> experiencia -> proyectos -> formación -> idiomas. Enlaces presentes y texto dentro de márgenes. Revisión visual de páginas renderizadas.
- Revisión manual de la web en escritorio y móvil de 390 px; cambio de idioma y tema. Desbordamiento horizontal corregido: ancho de contenido igual al viewport.
- Cinco destinos públicos de proyectos responden HTTP 200: Fabriqer, Momentum, CREM, Estudio Podcast Barcelona y PokeApi. Esto comprueba disponibilidad del enlace, no acceso a áreas privadas ni funcionamiento íntegro del producto.
- `git diff --check`: correcto. No había un linter configurado; no se presenta el typecheck como lint. Prettier aplicado a los nuevos archivos de datos/TS/JS.

No se ha ejecutado un ATS comercial ni se garantiza superar filtros de selección. No se han medido Core Web Vitals de campo ni se afirma una puntuación Lighthouse. El contacto y el asistente no se han enviado a proveedores externos durante la revisión: sus integraciones se mantienen y requieren claves locales para una prueba real. El contexto del asistente sí se ha actualizado con datos públicos compartidos, sin teléfono/correo ni detalles internos.

La instalación de dependencias informa de 17 avisos de auditoría (el mismo recuento observado antes de estos cambios). No se han aplicado actualizaciones de producción potencialmente incompatibles como parte de esta revisión de contenido. Conviene tratarlas en una revisión técnica separada.

## Pendiente de confirmar antes de publicar

1. Aprobación de la descripción genérica de DFM y de que se mencione como contribución en I-MAS. Mantener omitida cualquier relación con clientes/productos concretos hasta autorización.
2. Vigencia de datos de contacto y la grafía preferida del nombre completo en el CV.
3. Qué examen de Cambridge acredita B2 y, solo si se quiere publicarlo, su fecha. No se ha inventado.
4. Alcance individual concreto en Fabriqer y stack verificable de cada contribución profesional. La tarjeta existente no se amplía con responsabilidades no confirmadas.
5. Preferencia de países, disponibilidad y posible traslado. No se ha afirmado permiso de trabajo ni nacionalidad.
6. Cuando empiece realmente el proyecto de noviembre, actualizar solo responsabilidades ya asumidas y autorizadas para comunicar.

## Candidaturas en Dinamarca y Suiza

- Dinamarca: adaptar el resumen y la carta a cada puesto, conectando ejemplos de I-MAS con las necesidades del equipo. Workindenmark recomienda CV y carta de motivación, dirigidos a la vacante: https://workindenmark.dk/job-search-in-denmark/our-best-job-search-tips y https://www.workindenmark.dk/job-search-in-denmark/your-cover-letter/.
- Suiza: seguir el idioma y los documentos pedidos en la oferta; para equipos internacionales, usar este CV inglés y preparar certificados/referencias cuando se soliciten. ETH Zurich recomienda adaptar la carta y el lenguaje al anuncio: https://ethz.ch/en/the-eth-zurich/working-teaching-and-research/welcome-center/job-search-and-application/how-to-apply-for-a-job.html.
- En ambos: buscar Frontend/React/Full-Stack con responsabilidades compatibles con la experiencia, adaptar el orden de proyectos y preparar una explicación oral en inglés de una tarea real: problema, alternativas, implementación, revisión y resultado verificable. No añadir cifras que no se puedan acreditar.

## Archivos principales

- Datos profesionales: `src/data/professional-profile.json`, `src/i18n/index.ts`, diccionarios ES/EN y `src/data/chatbot-profile.ts`.
- Presentación: `Home`, `Experience`, `SkillsLanguages`, `Projects`, `CV`, `Header`, `PortfolioChat`, `ContactForm` y `Layout`.
- Documentos: `src/assets/CV_Marti_Vilas_EN.pdf`, `src/assets/CV_Marti_Vilas_ES.pdf` y scripts de generación/verificación.
- Calidad/SEO: tests, `scripts/verify-site.mjs`, robots, sitemap, herramientas de desarrollo y `.gitattributes` para tratar PDF como binarios.
