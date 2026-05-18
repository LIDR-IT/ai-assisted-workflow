# Requisitos Funcionales (RF) - Estructura Detallada

## Definicion

Un Requisito Funcional (RF) es una especificacion detallada de una funcionalidad individual del producto. Forma parte de un PRD Funcional y contiene toda la informacion necesaria para que el equipo de desarrollo implemente la funcionalidad y para que QA valide su correcto funcionamiento.

---

## Estructura Estandar de un RF

### Campos de Identificacion

| Campo             | Descripcion                                                          | Ejemplo                                             |
| ----------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| **Identificador** | ID unico para referencia cruzada entre documentos, tickets y pruebas | RF-360-001                                          |
| **Titulo**        | Nombre breve y descriptivo que identifica la funcionalidad           | Pantalla de Login Biometrico                        |
| **Modulo / Area** | Modulo del producto al que pertenece el requisito                    | Autenticacion, Dashboard, Gestion de Usuarios, etc. |

### Convencion de Identificadores

El formato del identificador sigue el patron: `RF-[PROYECTO]-[NUMERO_SECUENCIAL]`

- **RF**: Prefijo que identifica el documento como Requisito Funcional.
- **PROYECTO**: Codigo del proyecto (ej. 360 para Proyecto 360).
- **NUMERO_SECUENCIAL**: Numero correlativo que indica el orden de creacion.

---

## Secciones de Contenido Minimas

Todo RF debe contener, como minimo, las siguientes secciones:

### 1. Descripcion

La seccion de descripcion establece el contexto y el alcance del requisito:

#### Objetivo de Negocio

Explica por que existe este requisito, que necesidad de negocio cubre y que valor aporta al producto o al usuario final. Debe ser claro y orientado a resultados.

#### Actores / Usuarios que Intervienen

Identifica todos los roles o perfiles de usuario que interactuan con la funcionalidad:

- Usuario final (cliente, empleado, ciudadano, etc.)
- Administrador del sistema
- Operador / agente
- Sistemas externos (APIs, servicios de terceros)

#### Alcance del Requisito

Define los limites de lo que cubre este RF especifico:

- Que funcionalidad incluye esta version.
- Hasta donde llega la responsabilidad de este RF.
- Donde comienza la responsabilidad de otro RF relacionado.

#### Exclusiones

Describe explicitamente lo que NO esta incluido en esta version del requisito. Esto es fundamental para evitar ambiguedades y gestionar expectativas:

- Funcionalidades que se implementaran en versiones futuras.
- Casos de uso que estan fuera de alcance.
- Integraciones que no aplican para esta iteracion.

---

### 2. Comportamiento

La seccion de comportamiento describe como debe funcionar la funcionalidad desde la perspectiva del usuario:

#### Flujo Principal (Paso a Paso)

Descripcion secuencial del camino feliz (happy path):

- Que pantallas ve el usuario.
- Que acciones (clicks, inputs, gestos) realiza.
- Que respuestas del sistema observa.
- Como transiciona entre estados.

Ejemplo de formato:

```
1. El usuario accede a la pantalla de login.
2. El sistema muestra la opcion de autenticacion biometrica.
3. El usuario selecciona "Autenticacion Facial".
4. El sistema activa la camara y muestra el marco de captura.
5. El usuario posiciona su rostro dentro del marco.
6. El sistema captura la imagen y la procesa.
7. El sistema valida la identidad contra el registro biometrico.
8. Si la validacion es exitosa, el sistema redirige al dashboard principal.
```

#### Flujos Alternativos

Caminos validos pero diferentes al flujo principal:

- Que ocurre si el usuario elige otra opcion.
- Variantes del flujo segun el tipo de usuario o configuracion.
- Caminos secundarios que tambien llevan a un resultado exitoso.

#### Flujos de Error

Descripcion de que ocurre cuando algo falla:

- Errores de validacion (datos incorrectos, formatos invalidos).
- Errores de sistema (timeout, servicio no disponible).
- Errores de negocio (usuario bloqueado, sesion expirada).
- Mensajes de error que debe mostrar el sistema.
- Acciones de recuperacion disponibles para el usuario.

#### Reglas de Negocio Asociadas

Validaciones y condiciones especiales que aplican:

- Validaciones de campos (formatos, longitudes, valores permitidos).
- Condiciones de acceso (permisos, roles requeridos).
- Limites operativos (intentos maximos, tiempos de expiracion).
- Logica de negocio especifica (calculos, transformaciones, reglas condicionales).

---

### 3. Criterios de Aceptacion

Los criterios de aceptacion son el corazon del RF desde la perspectiva de calidad. Deben cumplir las siguientes caracteristicas:

#### Claridad y No Ambiguedad

- Cada criterio debe ser interpretable de una unica manera.
- No deben existir terminos vagos como "rapido", "eficiente" o "user-friendly" sin cuantificar.
- Los valores, limites y condiciones deben ser especificos.

#### Madurez Suficiente para QA

- Los criterios deben estar lo suficientemente detallados para que el equipo de QA pueda generar test cases directamente a partir de ellos.
- No debe requerir interpretacion adicional ni sesiones de clarificacion.

#### Formato BDD (Given/When/Then)

Los criterios deben permitir su conversion directa a escenarios BDD:

```gherkin
Escenario: Autenticacion facial exitosa
  Dado que el usuario tiene un registro biometrico activo
  Y la camara del dispositivo esta operativa
  Cuando el usuario selecciona "Autenticacion Facial"
  Y posiciona su rostro dentro del marco de captura
  Entonces el sistema valida su identidad
  Y el usuario es redirigido al dashboard principal

Escenario: Autenticacion facial fallida por identidad no reconocida
  Dado que el usuario tiene un registro biometrico activo
  Cuando el sistema no puede validar la identidad del usuario
  Entonces el sistema muestra el mensaje "Identidad no verificada"
  Y ofrece la opcion de reintentar o usar metodo alternativo
```

---

### 4. Dependencias y Trazabilidad

#### Links a Otros RFs Relacionados

Cada RF documenta sus relaciones con otros requisitos:

- **Depende de**: RFs que deben estar implementados antes de este.
- **Es prerequisito de**: RFs que dependen de este para funcionar.
- **Relacionado con**: RFs que comparten contexto pero no tienen dependencia directa.

#### Dependencias con Otros Modulos

Identificacion de dependencias a nivel de modulo o sistema:

- APIs que debe consumir o exponer.
- Servicios compartidos que utiliza.
- Datos que requiere de otros modulos.

#### Momento de Generacion

Las dependencias se mapean **despues** de tener todos los RFs del modulo completo. Esto permite tener una vision global antes de establecer las relaciones, evitando dependencias incompletas o incorrectas.

---

## Proceso de Generacion con IA

### Herramienta Principal: Robo (RoboFlow integrado con Confluence)

El PO utilizaba Robo como herramienta principal para la generacion asistida de RFs. El proceso seguia estos pasos:

#### 1. Preparacion del Contexto

Se proporcionaba a la IA todo el contexto relevante del proyecto:

- Contexto general del producto y sus objetivos.
- Descripcion de la pantalla o funcionalidad especifica.
- Acciones esperadas del usuario.
- Filtros, opciones y configuraciones relevantes.
- Comportamiento deseado del sistema.

#### 2. Solicitud Estructurada

Se pedia a la IA que generara el output con una estructura especifica:

- Descripcion (objetivo, actores, alcance, exclusiones).
- Comportamiento (flujos principal, alternativo, de error, reglas de negocio).
- Criterios de aceptacion (en formato que permita conversion a BDD).

#### 3. Revision de Coherencia

El output generado por la IA se revisaba manualmente para:

- Verificar coherencia interna del RF.
- Validar coherencia con otros RFs del modulo.
- Asegurar que los criterios de aceptacion son completos y no ambiguos.
- Ajustar terminologia y nivel de detalle segun estandares del equipo.

---

### Problema Descubierto: Inconsistencia entre Usuarios

Se identifico un problema significativo en el uso de IA para generacion de RFs:

> **El mismo prompt produce resultados distintos cuando lo ejecutan diferentes personas.**

El PO y el Product Lead, utilizando el mismo prompt base, obtenian resultados con diferencias notables en:

- Nivel de detalle.
- Estructura del contenido.
- Terminologia utilizada.
- Completitud de los criterios de aceptacion.

Esto se debe a que el contexto conversacional previo, la forma de proporcionar informacion adicional y las interacciones con la IA varian entre personas.

---

### Solucion Propuesta: Estandarizacion de Prompts

Para resolver el problema de inconsistencia, se propone:

1. **Definir prompts estandarizados** con un formato de salida claramente especificado.
2. **Incluir templates de output** en los prompts para que la IA siga una estructura fija.
3. **Documentar los prompts** en Confluence para que todo el equipo use las mismas instrucciones.
4. **Establecer un checklist de revision** post-generacion para validar la calidad del output independientemente de quien lo genero.

Esta estandarizacion busca garantizar que la calidad y estructura de los RFs sea consistente sin importar quien interactue con la herramienta de IA.

---

## Ejemplo de RF Completo

```
Identificador: RF-360-001
Titulo: Pantalla de Login Biometrico
Modulo: Autenticacion

DESCRIPCION
-----------
Objetivo: Permitir a los usuarios autenticarse en la plataforma
mediante reconocimiento facial biometrico.

Actores: Usuario final, sistema de biometria.

Alcance: Autenticacion facial para usuarios previamente registrados
con template biometrico activo.

Exclusiones: No incluye el proceso de registro biometrico inicial
(cubierto en RF-360-005). No incluye autenticacion por huella
dactilar (cubierto en RF-360-008).

COMPORTAMIENTO
--------------
Flujo Principal:
1. El usuario accede a la pantalla de login.
2. El sistema muestra las opciones de autenticacion disponibles.
3. El usuario selecciona "Autenticacion Facial".
4. El sistema activa la camara y muestra el marco de captura.
5. El usuario posiciona su rostro dentro del marco.
6. El sistema realiza la captura y procesa la imagen.
7. El sistema valida la identidad contra los registros biometricos.
8. Validacion exitosa: el sistema redirige al dashboard.

Flujo Alternativo:
- Si el usuario no tiene camara disponible, mostrar opcion
  de autenticacion por credenciales (usuario/contraseña).

Flujo de Error:
- Identidad no reconocida: mostrar mensaje de error y opcion
  de reintento (maximo 3 intentos).
- Camara no disponible: mostrar mensaje informativo y opciones
  alternativas.
- Timeout (30 segundos sin captura): cancelar proceso y volver
  a pantalla inicial.

Reglas de Negocio:
- Maximo 3 intentos de autenticacion facial por sesion.
- Umbral de confianza configurable por administrador (default: 85%).
- Sesion expira tras 30 minutos de inactividad post-login.

CRITERIOS DE ACEPTACION
------------------------
CA-001: Dado un usuario con registro biometrico activo,
        cuando realiza autenticacion facial exitosa,
        entonces es redirigido al dashboard en menos de 3 segundos.

CA-002: Dado un usuario sin registro biometrico,
        cuando intenta autenticacion facial,
        entonces el sistema muestra mensaje de registro requerido.

CA-003: Dado un usuario que falla la autenticacion 3 veces,
        cuando intenta un cuarto intento,
        entonces la cuenta es bloqueada temporalmente por 15 minutos.

DEPENDENCIAS
------------
- Depende de: RF-360-005 (Registro Biometrico)
- Prerequisito de: RF-360-010 (Dashboard Principal)
- Relacionado con: RF-360-008 (Autenticacion por Huella)
```
