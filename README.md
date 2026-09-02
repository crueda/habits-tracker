# Agatsu — Habit tracker

PWA móvil para registrar tiempo dedicado a hábitos sin una pantalla de acceso. Guarda primero en IndexedDB, funciona sin conexión y sincroniza en segundo plano con una identidad anónima de Firebase.

La aplicación incluye tres destinos:

- **Registro**: tarjetas rápidas para Piano, Fuerza, Japonés, Piscina, Diario y Ofuro, centradas en registrar sin controles secundarios.
- **Progreso**: mapa de 52 semanas al estilo de las contribuciones de GitHub, con intensidad y filtro por hábito.
- **Hábitos**: nombre, 40 iconos Lucide categorizados, color, duración del slot, objetivo y orden de las tarjetas.

En el primer uso se crean esos seis hábitos con slots de 15 minutos y un objetivo inicial de un slot. Las instalaciones anteriores reciben Diario y Ofuro una sola vez; después todos se pueden editar, archivar o eliminar.

## Desarrollo local

Requisitos: Node.js 24 y npm.

```bash
npm install
npm run dev
```

Comprobaciones habituales:

```bash
npm run lint
npm test
npm run build
```

La compilación usa `/habits-tracker/` como ruta base para GitHub Pages. La configuración web de Firebase incluida en `src/data/firebase.ts` es pública; nunca se debe añadir una cuenta de servicio, una clave privada ni un token personal al repositorio.

## Firebase

Proyecto configurado: `habits-tracker-78d9b`.

- Authentication → Configuración → Acciones de usuario: **Creación de cuentas** habilitada.
- Authentication → Método de acceso: proveedor **Anónimo** habilitado.
- Authentication → Configuración → Dominios autorizados: `crueda.github.io`.
- Firestore: base `(default)`, edición Standard, región `eur3` y plan Spark.
- Reglas: [firestore.rules](./firestore.rules).

Antes de publicar la aplicación hay que desplegar las reglas. Hay dos formas:

1. En Firebase Console, abrir **Firestore Database → Reglas**, sustituir el contenido por `firestore.rules` y pulsar **Publicar**.
2. Mediante CLI:

```bash
npx firebase login
npx firebase deploy --only firestore:rules
```

Las reglas únicamente permiten a una identidad autenticada leer y escribir dentro de `users/{su-uid}`. El sitio público no permite acceder a los datos de otra persona.

Si aparece `auth/admin-restricted-operation`, Firebase está bloqueando la creación de la identidad anónima: hay que habilitar **Creación de cuentas** en Acciones de usuario. Si aparece `auth/operation-not-allowed`, falta habilitar el proveedor **Anónimo**. Después se puede pulsar **Reintentar** en Agatsu; los cambios realizados mientras tanto permanecen guardados localmente.

### Pruebas de reglas

Requieren JDK 21 o posterior para iniciar el emulador local:

```bash
npm run test:rules
```

Las pruebas comprueban acceso propio, bloqueo entre usuarios y bloqueo sin identidad.

## Publicar en GitHub Pages

El workflow [deploy-pages.yml](./.github/workflows/deploy-pages.yml) prueba y compila cada envío a `main`.

En GitHub, abrir **Settings → Pages → Build and deployment** y seleccionar **GitHub Actions** como origen. La URL publicada será:

```text
https://crueda.github.io/habits-tracker/
```

## Persistencia y copias

Cada acción se guarda primero en IndexedDB y después se sincroniza con Firestore. La identidad anónima se conserva en el mismo navegador, pero se puede perder si se eliminan los datos del sitio o se cambia de dispositivo.

En **Hábitos → Tus datos** se puede:

- descargar una copia JSON restaurable en el formato versionado 2 (tipos de hábito y registros de slots);
- restaurar una copia después de validarla y confirmarla;
- descargar un resumen Markdown legible.

Conviene conservar periódicamente el JSON fuera del navegador.

## Especificación

Los requisitos vigentes están consolidados en [`openspec/specs`](./openspec/specs). Las propuestas, decisiones y tareas completadas se conservan con trazabilidad en [`openspec/changes/archive`](./openspec/changes/archive).
