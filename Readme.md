Consola
Elegante Console Logger para Node.js y navegador

JS estándar versión npm descargas npm fobia al paquete fobia al paquete

¿Por qué Consola?
👌  Fácil de usar
💅  Salida elegante con respaldo para entornos mínimos
🔌  Reporteros conectables
💻  Experiencia consistente de interfaz de línea de comandos (CLI)
🏷  Soporte de etiquetas
🚏  Redirigir consoley stdout/stderra consola y restaurar fácilmente redireccionamiento.
🌐  Soporte de navegador
⏯  Pausar / Reanudar soporte
👻  Apoyo burlón
👮‍♂️  Prevención de correo no deseado mediante la limitación de registros

Instalación
Usando hilo:

hilo añadir consola
Usando npm:

npm i consola
Empezando
const  consola  =  require ( 'consola' )

// Ver la sección de tipos para todos los tipos disponibles

consola . success ( 'Built!' ) 
consola . info ( 'Reportero: Alguna información' ) 
consola . error ( nuevo  Error ( 'Foo' ) )
Mostrará en la terminal:

Captura de pantalla 2020-01-28 a las 14 15 15

NOTA: Alternativamente, puede importar consola desde la fuente. Pero no olvide incluirlo en la lista blanca para la transpilación:

importar  consola  desde  'consola / src / node' 
importar  consola  desde  'consola / src / browser'
Métodos
<type>(logObject) <type>(args...)
Regístrese para todos los reporteros.

Ejemplo: consola.info('Message')

Puede encontrar una lista de tipos disponibles aquí .

addReporter(reporter)
Alias: add
Registre una instancia de reportero personalizada.

removeReporter(reporter?)
Alias remove,clear
Eliminar a un reportero registrado.

Si no se pasan argumentos, todos los reporteros serán eliminados.

setReporters(reporter|reporter[])
Reemplazar a todos los reporteros.

create(options)
Cree una nueva Consolainstancia y herede todas las opciones principales para los valores predeterminados.

withDefaults(defaults)
Crea una nueva Consolainstancia con los valores predeterminados proporcionados

withTag(tag)
Alias: withScope
Crea una nueva Consolainstancia con esa etiqueta.

wrapConsole() restoreConsole()
Redirigir globalmente todas las console.logllamadas, etc. a los controladores de consola.

wrapStd() restoreStd()
Redirigir globalmente todas las salidas stdout / stderr a consola.

wrapAll() restoreAll()
Envuelva ambos, estándar y consola.

La consola usa std en el subyacente, por lo que la llamada también wrapStdredirige la consola. El beneficio de esta función es que cosas como console.infose redireccionarán correctamente al tipo correspondiente.

pauseLogs() resumeLogs()
Alias: pause/resume
Pausar y reanudar globalmente los registros.

Consola pondrá en cola todos los registros cuando esté en pausa y luego los enviará al informe cuando se reanude.

mockTypes
Alias: mock
Burlarse de todo tipo. Útil para usar con pruebas.

El primer argumento que se pasa mockTypesdebe ser una función de devolución de llamada que acepta (typeName, type)y devuelve el valor simulado:

consola . mockTypes ( ( typeName ,  type )  =>  jest . fn ( ) )
Tenga en cuenta que con el ejemplo anterior, todo se burla de forma independiente para cada tipo. Si necesita un fn simulado, créelo afuera:

const  fn  =  broma . fn ( ) 
consola . mockTypes ( ( )  =>  fn )
Si la función de devolución de llamada devuelve un valor falso , ese tipo no se burlará.

Por ejemplo, si solo necesitas burlarte consola.fatal:

consola . mockTypes ( ( typeName )  =>  typeName  ===  'fatal'  &&  jest . fn ( ) )
NOTA: Cualquier instancia de consola que herede la instancia simulada, volverá a aplicar la devolución de llamada proporcionada. De esta manera, la burla funciona para los withTagregistradores con alcance sin necesidad de esfuerzos adicionales.

Campos
reporters
Una serie de reporteros activos.

level
El nivel para mostrar registros. Se mostrarán todos los registros en este nivel o por encima de él. Lista de niveles disponibles aquí .

Puede establecer el nivel de registro utilizando la CONSOLA_LEVELvariable de entorno, que debe tener el nivel de registro numérico como valor.

logObject
El logObjectes un objeto de extensión libre que se pasará a los reporteros.

Campos estándar:

message
additional
args
date
tag
Campos adicionales:

badge
Reporteros
Elija entre uno de los reporteros integrados o traiga el suyo.

De forma predeterminada, FancyReporterestá registrado para terminales modernos o BasicReporterse utilizará si se ejecuta en entornos limitados como CI.

Reporteros disponibles:

BasicReporter
FancyReporter
JSONReporter
WinstonReporter
Creando tu propio reportero
Un reportero (clase u objeto) expone el log(logObj)método. Para obtener más información sobre cómo escribir su propio reportero, eche un vistazo a las implementaciones vinculadas arriba.

Tipos
Los tipos se utilizan para registrar mensajes a los reporteros. Cada tipo se adjunta a un nivel de registro .

Aquí encontrará una lista de todos los tipos predeterminados disponibles .

Creando una nueva instancia
Consola tiene una instancia global y se recomienda su uso en todas partes. En caso de que se necesite más control, cree una nueva instancia.

importar  consola  desde  'consola'

const  logger  =  consola . create ( { 
    // nivel: 4, 
    reporteros : [ 
      nueva  consola . JSONReporter ( ) 
    ] , 
    valores predeterminados : { 
      additionalColor : 'white' 
    } 
} )
Integraciones
Con broma
describe ( 'your-consola-mock-test' ,  ( )  =>  { 
  beforeAll ( ( )  =>  { 
      // Redirigir std y console a consola también 
      // Llamar esto una vez es suficiente 
      consola . wrapAll ( ) 
    } )

    beforeEach ( ( )  =>  { 
      // Vuelve a simular consola antes de cada llamada de prueba para eliminar 
      // las llamadas anteriores a 
      consola . mockTypes ( ( )  =>  jest . fn ( ) ) 
    } )


  test ( 'tu prueba' ,  async  ( )  =>  { 
    // Algo de código aquí

    // Recuperemos todos los mensajes de `consola.log` 
    // Obtenga el simulacro y 
    mapee todas las llamadas a su primer argumento const  consolaMessages  =  consola . log . burlarse . llamadas . map ( c  =>  c [ 0 ] ) 
    espera ( consolaMessages ) . toContain ( 'su mensaje' ) 
  } )

} )
Con jsdom
{ 
  virtualConsole : nuevo  jsdom . VirtualConsole ( ) . sendTo ( consola ) 
}
Licencia
MIT - Hecho con 💖 ¡Por el equipo de Nuxt.js!
