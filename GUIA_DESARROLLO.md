# 🎄 Sorteo Cesta de Navidad - Guía de Desarrollo

## 📁 Estructura del Proyecto

```
CestaNavidad/
├── src/
│   ├── app.ts                 # 🚀 APLICACIÓN PRINCIPAL
│   ├── modules/
│   │   ├── participantes.ts   # 👥 Gestión de participantes
│   │   ├── tablero.ts         # 🎲 Tablero de números (00-99)
│   │   ├── sorteo.ts          # 🎊 Lógica del sorteo
│   │   ├── numero.ts          # 🔢 Gestión de números
│   │   └── informe.ts         # 📊 Estadísticas e informes
│   ├── types/
│   │   └── Interfaces.ts      # 📝 Interfaces TypeScript
│   └── UI/
│       ├── index.html         # 🌐 Interfaz de usuario
│       └── styles.css         # 🎨 Estilos CSS
├── tsconfig.json              # ⚙️ Configuración TypeScript
└── package.json               # 📦 Dependencias del proyecto
```

## 🚀 Cómo ejecutar el proyecto

### 1. Compilar TypeScript
```bash
# Desde la carpeta raíz del proyecto
npx tsc

# O en modo watch (recompila automáticamente)
npx tsc --watch
```

### 2. Abrir en navegador
```bash
# Abrir el archivo HTML directamente
open src/UI/index.html

# O usar un servidor local (recomendado)
npx http-server src/UI/ -p 8080
```

## 🎯 Funcionalidades Implementadas

### ✅ **Registro de Participantes**
- Formulario para registrar nombre, email y teléfono
- Validación de campos obligatorios
- Prevención de emails duplicados
- IDs únicos automáticos

### ✅ **Gestión del Tablero**
- Tablero visual de 100 números (00-99)
- Reserva y liberación de números
- Estado visual (verde=libre, rojo=ocupado)
- Click en números para ver información

### ✅ **Sistema de Sorteo**
- **Sorteo Manual**: Introduce un número específico
- **Sorteo Aleatorio**: Simula 5 extracciones de la Lotería Nacional
- Detección automática de ganador o sorteo desierto
- Animaciones y efectos visuales

### ✅ **Estadísticas en Tiempo Real**
- Total de participantes registrados
- Números ocupados vs libres
- Porcentaje de ocupación del tablero
- Consulta de números por participante

### ✅ **Interfaz de Usuario**
- Diseño responsive (móvil y escritorio)
- Tema navideño con colores festivos
- Notificaciones automáticas
- Interfaz intuitiva y amigable

## 🛠️ Tecnologías Utilizadas

- **TypeScript**: Tipado estático y programación orientada a objetos
- **HTML5**: Estructura semántica y formularios
- **CSS3**: Estilos modernos y responsive design
- **ES Modules**: Sistema de módulos moderno
- **DOM API**: Manipulación dinámica de la interfaz

## 🎓 Conceptos Aplicados

### **Programación Orientada a Objetos**
- Clases con encapsulación (`GestorParticipantes`, `SorteoNavidad`)
- Herencia y polimorfismo
- Manejo de errores personalizados

### **TypeScript Avanzado**
- Interfaces y tipos personalizados
- Union types y type guards
- Parámetros opcionales y por defecto
- Genéricos donde corresponde

### **Buenas Prácticas**
- Separación de responsabilidades
- Validación de datos
- Manejo de errores robusto
- Código documentado en español
- Naming conventions consistentes

## 🎄 Características del Sorteo

### **Funcionalidad Principal**
El sistema simula el tradicional sorteo de cesta de navidad donde:

1. **Participantes se registran** con sus datos personales
2. **Reservan números** del 00 al 99 (como en un tablero físico)
3. **El sorteo** utiliza los dos últimos dígitos de la Lotería Nacional
4. **El ganador** es quien tenga el número premiado
5. **Si no hay participante** en ese número, el sorteo queda desierto

### **Casos de Uso Cubiertos**
- ✅ Registro de múltiples participantes
- ✅ Un participante puede tener varios números
- ✅ Un número solo puede tener un participante
- ✅ Sorteo manual (número específico)
- ✅ Sorteo aleatorio (simula Lotería Nacional)
- ✅ Gestión de sorteos desiertos
- ✅ Liberación de números reservados
- ✅ Consultas y estadísticas

## 🎨 Estilo Visual

El diseño mantiene un **estilo de proyecto estudiantil**:
- Colores básicos sin gradientes complejos
- Tipografía estándar (Arial)
- Efectos simples pero funcionales
- CSS limpio y fácil de entender
- Responsive design básico pero efectivo

## 🔧 Próximas Mejoras Posibles

- [ ] Persistencia de datos (localStorage)
- [ ] Exportar informes a PDF
- [ ] Historial de sorteos anteriores
- [ ] Integración con API de Lotería Nacional real
- [ ] Sistema de notificaciones por email
- [ ] Modo administrador con más controles

---

**Desarrollado por:** Renzo y Fabricio  
**Curso:** DWEC 2025
**Tema:** Ejercicio Grupal - Sorteo Cesta de Navidad