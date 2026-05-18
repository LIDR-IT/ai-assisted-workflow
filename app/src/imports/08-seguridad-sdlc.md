# Seguridad y SDLC

## Contexto

{{CLIENT_NAME}} esta implementando un **SDLC (Software Development Life Cycle) por PRIMERA VEZ**:

> _"No teniamos un SDLC en la compania y lo estamos implementando junto con este proyecto"_

## Liderazgo

El SDLC es liderado por el **Sec Lead** desde el equipo de **Ciberseguridad**.

## Pipeline del SDLC

El pipeline de seguridad se compone de las siguientes etapas:

### 1. SAST (Static Application Security Testing)

- Se ejecuta en **cada PR/cambio de codigo**
- Verifica vulnerabilidades en el **codigo fuente**

### 2. SCA (Software Composition Analysis)

- Se ejecuta **junto con SAST**
- Verifica vulnerabilidades en **dependencias de terceros**

### 3. Gate de Seguridad

- **No se permite** el paso de vulnerabilidades criticas o altas
- Funciona como puerta de control obligatoria

### 4. QA

- Verificaciones de **calidad funcional**

### 5. Segundo Escaneo SAST

- Se ejecuta **despues de los cambios de QA**
- Asegura que las correcciones no introduzcan nuevas vulnerabilidades

### 6. DAST (Dynamic Application Security Testing)

- Se ejecuta una vez que la aplicacion esta **desplegada/en ejecucion**
- Pruebas de seguridad sobre la aplicacion en vivo

### 7. Pruebas de Penetracion Manuales

- Revision profunda de **configuraciones**
- Doble verificacion de vulnerabilidades **remediadas**

### 8. Comite de Cambios

- **Gate final** de aprobacion antes de pasar a produccion

## Automatizacion

| Componente                  | Frecuencia      | Detalle                                |
| --------------------------- | --------------- | -------------------------------------- |
| **SAST/SCA**                | Cada PR         | Automatizado en cada Pull Request      |
| **Escaneo de endpoints**    | Semanal         | Automatizado, con frecuencia ajustable |
| **Escaneo post-despliegue** | Cada despliegue | Automatizado tras cada deployment      |

## Umbrales de Seguridad

No se permite el paso de vulnerabilidades de severidad **critica** o **alta** a la siguiente etapa del pipeline. Este es un requisito bloqueante.

## Integracion con QA

- QA y seguridad trabajan de forma **parcialmente paralela**
- Existe cierta **superposicion** en las herramientas de deteccion de vulnerabilidades
- Ejemplo: **SonarQube** es utilizado tanto por QA como por seguridad

## Comite de Cambios

El Comite de Cambios **aprueba los cambios** una vez que todas las puertas de seguridad han sido superadas. Es el ultimo paso antes de que cualquier cambio llegue a produccion.
