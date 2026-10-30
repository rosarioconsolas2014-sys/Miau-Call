# GUÍA OFICIAL: GENERAR APK DE ANDROID CON CAPACITOR
## MIAU CALL – El llamador de gatitos 🐱

El proyecto nativo de Android ya está **100% generado, configurado y sincronizado** en el directorio `android/` con Capacitor.

---

### Configuración Oficial Aplicada en Android
- **Nombre de la Aplicación:** `MIAU CALL` (configurado en `strings.xml` y `capacitor.config.json`)
- **Identificador de Paquete:** `com.miaucall.app` (en `build.gradle`, `AndroidManifest.xml` y `strings.xml`)
- **Orientación:** Bloqueada en vertical (`portrait`) para una experiencia móvil perfecta (`android:screenOrientation="portrait"`).
- **Aceleración Gráfica:** Habilitada (`android:hardwareAccelerated="true"`).
- **Ícono Adorable:** Generado en todas las densidades mipmap (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`) con el gatito Kawaii (`ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png`).
- **Sonidos Locales:** Los 8 sonidos de gatos reales están empaquetados localmente en `android/app/src/main/assets/public/sounds/`:
  1. `ven.mp3`: Maullidos cortos y repetidos de llamado.
  2. `te-amo.mp3`: Ronroneos suaves y maullidos cariñosos.
  3. `hola-gatito.mp3`: Maullido de bienvenida.
  4. `a-comer.mp3`: Maullidos insistentes de gato pidiendo comida.
  5. `besitos.mp3`: Ronroneos y pequeños maullidos tiernos.
  6. `a-dormir.mp3`: Ronroneos relajantes de un gato tranquilo.
  7. `miau-miau.mp3`: Variedades de maullidos reales.
  8. `veni-mi-amor.mp3`: Maullidos repetidos y llamativos para atraer al gato.
- **Modo 100% Offline:** No requiere conexión a Internet; todo el audio se reproduce desde los assets internos de la aplicación.

---

### Pasos Rápidos para Generar el APK Debug

#### Opción A: Desde Android Studio (Recomendada)
1. En la terminal del proyecto, ejecuta:
   ```bash
   npx cap open android
   ```
2. Android Studio se abrirá automáticamente con el proyecto cargado.
3. Espera unos segundos a que Gradle termine de indexar.
4. En el menú superior de Android Studio, ve a:
   **Build > Build Bundle(s) / APK(s) > Build APK(s)**
5. Cuando finalice la compilación, aparecerá una notificación abajo a la derecha diciendo *"Build APK(s): APK(s) generated successfully"*.
6. Haz clic en el enlace azul **"locate"** para abrir la carpeta que contiene el archivo:
   `app-debug.apk`

---

#### Opción B: Directo por Línea de Comandos (Terminal)
Si tienes el Android SDK instalado en tu equipo, puedes compilar el APK directamente sin abrir la interfaz de Android Studio:

```bash
cd android
./gradlew assembleDebug
```
*(En Windows usa `gradlew.bat assembleDebug`)*

El archivo APK generado estará disponible en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

### Cómo Instalar el APK en tu Celular Android
1. Envía el archivo `app-debug.apk` a tu teléfono (por cable USB, WhatsApp, Telegram, Google Drive o correo).
2. Toca el archivo `.apk` en tu celular para abrirlo.
3. Si el sistema te lo solicita, activa el permiso *"Permitir instalar aplicaciones de fuentes desconocidas"* para tu explorador o aplicación de mensajería.
4. Presiona **Instalar**.
5. ¡Listo! Abre **MIAU CALL** con su ícono de gatito y disfruta llamando a tus michis sin necesidad de conexión a Internet.
