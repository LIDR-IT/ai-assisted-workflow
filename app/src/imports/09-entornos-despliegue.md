# Entornos y Despliegue

## Estado Actual

Los entornos **NO estan todos implementados** todavia:

> _"Esta es la primera implementación formal del framework LIDR SDLC"_

Este proyecto implementa la primera versión estructurada del framework LIDR SDLC que define entornos y puertas de despliegue de forma adecuada.

## Pipeline de Entornos Deseado

```
Dev -> Staging -> UAT -> Pre-produccion -> Produccion
```

### 1. Dev (Desarrollo)

Entorno de desarrollo donde se realiza la codificacion y las pruebas iniciales.

### 2. Staging (Integracion)

Entorno de pruebas de integracion donde se valida que los distintos componentes funcionan juntos.

### 3. UAT (User Acceptance Testing)

Entorno donde los **usuarios finales** realizan sus pruebas de aceptacion.

### 4. Pre-produccion

Entorno para **configuraciones especificas de clientes** y casos particulares:

> _"Hemos hablado de tener un preproduccion para particularidades con clientes"_

### 5. Produccion

Entorno en vivo, accesible por los usuarios reales.

## Proceso de Despliegue

- El equipo de **Cloud/Ops (DevOps)** se encarga de los despliegues
- El equipo de **seguridad (Sec Lead)** audita con **DAST** una vez la aplicacion esta en vivo en cada entorno
- Se ejecutan **escaneos automatizados semanales** de endpoints en los entornos desplegados

## Aspiracion vs. Realidad

- Los proyectos anteriores iban de forma mucho mas directa a produccion
- El **LIDR Framework Implementation** valida la metodología para futuros proyectos
- Este proyecto sirve como **primera implementación** para validar el framework completo

## Granularidad del Despliegue

- Los despliegues se realizan **por funcionalidad/user story**
- El equipo de infraestructura se comunica **directamente con los desarrolladores** para coordinar los despliegues

## Planificacion de Releases

- Los releases se definen en el **roadmap**
- Las **dependencias entre user stories** se rastrean en Jira
- El contenido de cada **sprint se mapea a releases** especificos
- Esto permite tener visibilidad de que funcionalidades estaran disponibles en cada version
