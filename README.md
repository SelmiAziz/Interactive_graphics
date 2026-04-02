# 🚀 WebGL Modular Engine v1.0

Un micro-motore grafico 2D costruito in **WebGL Raw** (senza librerie esterne). Il progetto segue un'architettura orientata agli oggetti (OOP) per separare la gestione dell'hardware, della geometria e degli oggetti di scena.

---

## 📁 Struttura del Progetto

| File | Classe / Ruolo | Descrizione |
| :--- | :--- | :--- |
| **`Shaders.js`** | `GLSL Source` | Il "cervello" nella GPU. Contiene il codice per trasformare i vertici e colorare i pixel. |
| **`Driver.js`** | `Driver` | Il ponte hardware. Gestisce il contesto WebGL, compila gli shader e isola le aree di disegno (Scissor Test). |
| **`Asset.js`** | `Asset` | Gestore della Geometria. Carica le coordinate (es. triangolo/cerchio) nella memoria VRAM della GPU. |
| **`Entity.js`** | `Entity` | L'oggetto nel mondo. Possiede una forma (Asset), un colore, una posizione e una scala. |
| **`Engine.js`** | `Engine` | Il Regista. Coordina l'inizializzazione, crea le entità e gestisce il ciclo di rendering. |
| **`index.html`** | `Entry Point` | Il punto di ingresso che ospita il `<canvas>` e avvia l'Engine come modulo JS. |

---

## 🔄 Flusso di Esecuzione (Pipeline)

Ecco l'ordine logico delle chiamate per disegnare, ad esempio, un **Triangolo Rosso**:

### 1. Inizializzazione (Setup)
1. **`Engine`** istanzia il **`Driver`**: viene creato il contesto WebGL sul canvas.
2. **`Driver.loadFirmware()`**: Gli shader vengono inviati alla scheda video, compilati e collegati in un `Program`.
3. **`Asset.CreateTriangle()`**: Definisce i punti del triangolo e li salva in un **Buffer** sulla GPU (operazione fatta una sola volta per risparmiare memoria).
4. **`Entity`**: Viene creato un oggetto che "punta" all'asset del triangolo e memorizza i suoi dati specifici (es: colore Rosso, posizione `[-0.5, 0.5]`).

### 2. Ciclo di Disegno (Rendering Loop)
Ad ogni frame (60 volte al secondo):
1. **`Driver.isolateArea()`**: 
   - Definisce la porzione di schermo (es. metà sinistra).
   - Attiva lo **Scissor Test** per evitare che il colore di sfondo "sbordi" nell'altra metà.
2. **`Entity.draw()`**:
   - **`Asset.enable()`**: Dice alla GPU di "ascoltare" i dati dal buffer del triangolo.
   - **`gl.uniform...`**: Invia la posizione, la scala e il colore specifici dell'entità alle variabili `uniform` dello shader.
   - **`gl.drawArrays()`**: Invia il comando finale di disegno alla GPU.

---

## 🧠 Note Tecniche e Matematica

### Normalized Device Coordinates (NDC)
WebGL non ragiona in pixel (800x400), ma in uno spazio che va da **-1.0** a **+1.0**. 
* Il centro è `(0, 0)`.
* L'Engine mappa queste coordinate all'interno della `Viewport` definita dal Driver.

### Trasformazione nel Vertex Shader
La posizione finale di ogni punto viene calcolata istantaneamente dalla GPU con la formula:
$$FinalPosition = (Vertex \cdot Scale) + Translation$$

### Ottimizzazione degli Asset
Il motore è progettato per il **riutilizzo**. Puoi avere 100 triangoli diversi a schermo, ma i dati geometrici nel buffer della GPU rimangono solo quelli di **un unico Asset**, riducendo drasticamente il carico sulla memoria video.

---

## 🛠️ Come Avviarlo
1. Assicurati che tutti i file siano nella stessa cartella.
2. Apri il progetto tramite un **Server Locale** (es: estensione *Live Server* di VS Code o `python -m http.server`).
3. Apri `index.html` nel browser.
