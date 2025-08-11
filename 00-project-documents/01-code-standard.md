# 🚀 Código Optimizado - Guía de Desarrollo de Alto Rendimiento

## Prompt Engineering para Programación Moderna y Experta

**Propósito:** Fuente única de verdad para desarrollo de código de alta calidad y rendimiento  
**Audiencia:** Equipo de desarrollo MutualMetrics - Programadores Expertos  
**Uso:** Consultar antes de escribir código y durante code reviews  
**Versión:** 2.0  
**Última actualización:** Enero 2025  
**Nivel:** Avanzado/Experto

---

## 🎯 PRINCIPIOS FUNDAMENTALES

### 1. **Paradigmas de Programación**
- **Funcional** donde es necesario (transformaciones de datos, cálculos puros)
- **OOP** donde corresponde (entidades con estado, herencia natural)
- **Híbrido** cuando ambos paradigmas se complementan

### 2. **Design Patterns Prioritarios**
```typescript
// ✅ PREFERIDOS en orden de prioridad:
// 1. Factory Pattern - Creación de objetos complejos
// 2. Builder Pattern - Construcción paso a paso
// 3. Strategy Pattern - Algoritmos intercambiables
// 4. Observer Pattern - Eventos y notificaciones
// 5. Singleton Pattern - Recursos únicos (con cuidado)
// 6. Abstract Factory - Familias de objetos relacionados
```

### 3. **Patrones Estructurales y de Comportamiento**
- **Estructurales:** Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
- **Comportamiento:** Chain of Responsibility, Command, Iterator, Mediator, Memento, State, Template Method, Visitor

---

## 🧹 REGLAS DE LIMPIEZA DE CÓDIGO

### 4. **Eliminación de Breadcrumbs**
```typescript
// ❌ NUNCA dejar:
import { unusedFunction } from './utils';  // Remove if unused
const unusedVariable = 'test';             // Remove if unused
function unusedFunction() { }              // Remove if unused

// ✅ SIEMPRE verificar:
// - Imports no utilizados
// - Variables declaradas pero no usadas
// - Funciones vacías o sin implementar
// - Console.log de debugging
// - TODO comments sin fecha
```

### 5. **Desarrollo Sistemático**
```typescript
// ✅ ENFOQUE SISTEMÁTICO:
// 1. Identificar todos los archivos afectados
// 2. Implementar cambios en todos los niveles necesarios
// 3. Actualizar tipos, interfaces, tests
// 4. Verificar integración completa
// 5. Documentar cambios en todos los archivos

// ❌ NUNCA hacer:
// - Cambios parciales
// - Implementaciones incompletas
// - Dejar archivos sin actualizar
```

---

## 📝 ESTRUCTURA DE COMENTARIOS

### 6. **Header de Archivo Obligatorio**
```typescript
/**
 * @fileoverview [Descripción clara de la responsabilidad del archivo]
 * @version [X.Y.Z]
 * @author [Nombre del desarrollador]
 * @since [YYYY-MM-DD]
 * @lastModified [YYYY-MM-DD]
 * 
 * @description
 * [Explicación detallada de qué hace este archivo]
 * 
 * @dependencies
 * - [Lista de dependencias críticas]
 * 
 * @usage
 * [Ejemplo de uso básico]
 * 
 * @state
 * ✅ [Estado actual: Funcional, En desarrollo, Bug conocido]
 * 
 * @bugs
 * - [Lista de bugs conocidos o limitaciones]
 * 
 * @todo
 * - [Tareas pendientes con prioridad]
 * - [Mejoras futuras]
 * 
 * @performance
 * - [Notas de rendimiento críticas]
 * 
 * @security
 * - [Consideraciones de seguridad]
 */
```

---

## ⚡ MANEJO DE ESTADOS Y ERRORES

### 7. **Error Handling Obligatorio**
```typescript
// ✅ PATRÓN OBLIGATORIO para operaciones críticas:
try {
  const result = await criticalOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Critical operation failed:', error);
  return { 
    success: false, 
    error: error.message,
    fallback: getFallbackData()
  };
}

// ✅ LOADING STATES obligatorios:
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// ✅ COMPONENTE con estados:
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### 8. **Gestión de Tareas Pendientes**
```typescript
// ✅ EN HEADER del archivo:
/**
 * @todo
 * - [PRIORITY: HIGH] Implementar validación de entrada
 * - [PRIORITY: MEDIUM] Optimizar renderizado de gráficos
 * - [PRIORITY: LOW] Agregar animaciones
 * 
 * @technicalDebt
 * - Refactorizar función calculateResults (muy larga)
 * - Migrar a React Query para cache
 */
```

---

## 🔒 REGLAS DE INTEGRIDAD

### 9. **Preservación de Funcionalidad**
```typescript
// ✅ ANTES de cualquier cambio:
// 1. Verificar tests existentes
// 2. Documentar funcionalidad actual
// 3. Crear tests de regresión
// 4. Implementar cambios incrementalmente
// 5. Verificar que nada se rompe

// ✅ PATRÓN de desarrollo seguro:
// - Feature flags para cambios grandes
// - Rollback plan siempre disponible
// - Tests de integración obligatorios
```

### 10. **Restricción de Comandos Terminal**
```typescript
// ❌ NUNCA ejecutar comandos automáticamente
// ✅ SIEMPRE solicitar aprobación del usuario
// ✅ Documentar comandos necesarios en README
// ✅ Proporcionar scripts npm/yarn para automatización
```

### 11. **Edición de Archivos Sistemática**
```typescript
// ✅ METODOLOGÍA de edición:
// 1. Analizar archivo completo antes de editar
// 2. Planificar todos los cambios necesarios
// 3. Editar archivo UNA SOLA VEZ
// 4. Verificar errores inmediatamente
// 5. Integrar con archivos relacionados
// 6. Actualizar documentación
```

---

## 🏗️ ARQUITECTURA Y PATRONES

### **Patrones de React Moderno Avanzado**
```typescript
// ✅ HOOKS PERSONALIZADOS CON OPTIMIZACIONES:
export const useQuadraticAnalysis = () => {
  const [state, setState] = useState<AnalysisState>(initialState);
  
  // Memoización avanzada para performance
  const memoizedCoefficients = useMemo(() => 
    coefficients ? hashCoefficients(coefficients) : null, 
    [coefficients]
  );
  
  // Debouncing inteligente con cleanup
  const debouncedAnalyze = useCallback(
    debounce(async (coeffs: Coefficients) => {
      try {
        const result = await analyzeWithRetry(coeffs, 3);
        setState(prev => ({ ...prev, result, error: null }));
      } catch (error) {
        setState(prev => ({ ...prev, error: error.message }));
      }
    }, 300, { leading: true, trailing: false }),
    []
  );
  
  // Error boundary integration
  const errorBoundary = useErrorBoundary();
  
  return { state, analyze: debouncedAnalyze, errorBoundary };
};

// ✅ COMPONENTES CON SUSPENSE Y CONCURRENT FEATURES:
interface ComponentProps {
  coefficients: Coefficients;
  onResult: (result: AnalysisResult) => void;
}

export const QuadraticAnalyzer: React.FC<ComponentProps> = ({ 
  coefficients, 
  onResult 
}) => {
  const { state, analyze } = useQuadraticAnalysis();
  
  return (
    <Suspense fallback={<AnalysisSkeleton />}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <AnalysisForm 
          onSubmit={analyze}
          isLoading={state.isLoading}
          error={state.error}
        />
        {state.result && (
          <AnalysisResults 
            result={state.result}
            onExport={onResult}
          />
        )}
      </ErrorBoundary>
    </Suspense>
  );
};

// ✅ SERVER COMPONENTS (React 18+):
const ServerAnalysisChart = async ({ coefficients }: Props) => {
  const analysis = await analyzeOnServer(coefficients);
  return <Chart data={analysis} />;
};
```

### **Patrones de TypeScript Avanzado**
```typescript
// ✅ TIPOS ESTRICTOS CON VALIDACIÓN:
type AnalysisMode = 'roots' | 'vertex' | 'optimal' | 'full';

interface AnalysisRequest {
  coefficients: {
    a: number;
    b: number;
    c: number;
  };
  mode: AnalysisMode;
}

// ✅ UTILITY TYPES AVANZADOS:
type PartialAnalysis = Partial<AnalysisRequest>;
type RequiredCoefficients = Required<AnalysisRequest['coefficients']>;

// ✅ CONDITIONAL TYPES:
type AnalysisResult<T extends AnalysisMode> = 
  T extends 'roots' ? RootsResult :
  T extends 'vertex' ? VertexResult :
  T extends 'optimal' ? OptimalResult :
  FullAnalysisResult;

// ✅ TEMPLATE LITERAL TYPES:
type ApiEndpoint = `/api/${AnalysisMode}`;
type EventName = `analysis:${AnalysisMode}:${'started' | 'completed' | 'failed'}`;

// ✅ MAPPED TYPES CON TRANSFORMACIONES:
type ValidationRules = {
  [K in keyof AnalysisRequest]: {
    required: boolean;
    validator: (value: AnalysisRequest[K]) => boolean;
  };
};

// ✅ BRANDED TYPES PARA TYPE SAFETY:
type ValidCoefficient = number & { readonly __brand: 'ValidCoefficient' };
type NonZeroCoefficient = number & { readonly __brand: 'NonZeroCoefficient' };

// ✅ DISCRIMINATED UNIONS:
type AnalysisState = 
  | { status: 'idle' }
  | { status: 'loading'; progress: number }
  | { status: 'success'; result: AnalysisResult<'full'> }
  | { status: 'error'; error: Error; retryCount: number };
```

---

## 📊 MÉTRICAS DE CALIDAD AVANZADAS

### **Cobertura Obligatoria**
- **Tests unitarios:** ≥ 85% cobertura
- **Tests de integración:** Todos los flujos críticos
- **Tests E2E:** Flujos principales de usuario
- **Contract tests:** 100% de APIs documentadas
- **Performance tests:** Todos los componentes críticos
- **Accessibility tests:** WCAG 2.1 AA compliance

### **Performance Targets**
- **Bundle size:** < 1MB (crítico para carga inicial)
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms
- **Time to Interactive:** < 3s
- **Lighthouse Score:** ≥ 90
- **Core Web Vitals:** Todos en verde

### **Code Quality**
- **Complexity:** ≤ 10 por función
- **Lines per function:** ≤ 50
- **Depth of nesting:** ≤ 4 niveles
- **Cognitive complexity:** ≤ 15
- **Maintainability index:** ≥ 65
- **Technical debt ratio:** ≤ 5%

---

## 🔄 WORKFLOW DE DESARROLLO

### **Antes de Escribir Código:**
1. ✅ Leer esta guía
2. ✅ Entender el contexto del archivo
3. ✅ Planificar la implementación
4. ✅ Verificar dependencias

### **Durante el Desarrollo:**
1. ✅ Seguir patrones establecidos
2. ✅ Implementar error handling
3. ✅ Escribir tests paralelos
4. ✅ Documentar cambios

### **Después del Desarrollo:**
1. ✅ Verificar que no hay breadcrumbs
2. ✅ Actualizar header del archivo
3. ✅ Ejecutar tests completos
4. ✅ Code review obligatorio

### **🚨 DETECCIÓN SISTEMÁTICA DE ERRORES (OBLIGATORIO):**
```bash
# ✅ VERIFICACIÓN OBLIGATORIA después de cada cambio:
npm run typecheck

# ✅ VERIFICACIÓN OBLIGATORIA antes de commit:
npm run typecheck
npm run test

# ✅ VERIFICACIÓN OBLIGATORIA antes de merge:
npm run typecheck
npm run test:coverage
npm run build
```

**🔍 DETECCIÓN AUTOMÁTICA DE ERRORES:**
- **TypeScript Errors:** `npm run typecheck` detecta TODOS los errores de tipos
- **Build Errors:** `npm run build` detecta errores de compilación
- **Test Errors:** `npm run test` detecta errores en tests
- **Linting:** Configurar ESLint para detección automática en editor

**📋 CHECKLIST DE VERIFICACIÓN SISTEMÁTICA:**
- [ ] `npm run typecheck` - Sin errores de TypeScript
- [ ] `npm run build` - Build exitoso
- [ ] `npm run test` - Todos los tests pasando
- [ ] Sin warnings de linter
- [ ] Funcionalidad verificada manualmente
- [ ] Documentación actualizada

**⚠️ REGLA CRÍTICA:** NUNCA hacer commit con errores de TypeScript. Usar `npm run typecheck` sistemáticamente para detectar y corregir errores antes de continuar con el desarrollo.

---

## 🚨 CHECKLIST RÁPIDO

### **Antes de Commit:**
- [ ] No hay imports no utilizados
- [ ] No hay variables no utilizadas
- [ ] Error handling implementado
- [ ] Loading states configurados
- [ ] Header del archivo actualizado
- [ ] Tests pasando
- [ ] Funcionalidad existente no rota
- [ ] Documentación actualizada

### **Antes de Merge:**
- [ ] Code review aprobado
- [ ] Tests de integración pasando
- [ ] Performance validada
- [ ] Accesibilidad verificada
- [ ] Security review completado

---

## 🔧 RESOLUCIÓN SISTEMÁTICA DE ERRORES TYPESCRIPT

### **Patrones de Resolución Comunes:**

#### **1. Errores de Chart.js con Tipos Mixtos:**
```typescript
// ❌ PROBLEMA: Bar component con datos mixtos (bar + line)
<Bar data={chartData} /> // Error: Type '"line"' is not assignable to type '"bar"'

// ✅ SOLUCIÓN: Usar Chart genérico para tipos mixtos
<Chart type="bar" data={chartData} />

// ✅ ALTERNATIVA: Separar en componentes específicos
<Bar data={barData} />
<Line data={lineData} />
```

#### **2. Errores de Readonly Arrays:**
```typescript
// ❌ PROBLEMA: KEYFRAMES as const causa errores de mutabilidad
export const KEYFRAMES = { ... } as const; // Error: readonly arrays

// ✅ SOLUCIÓN: Remover as const o usar type assertion
export const KEYFRAMES = { ... };
// O
export const KEYFRAMES = { ... } as Record<string, Keyframe[]>;
```

#### **3. Errores de Union Types:**
```typescript
// ❌ PROBLEMA: Type mismatch en propiedades
iterations: finalConfig.iterationCount, // Error: number | "infinite" vs number

// ✅ SOLUCIÓN: Transformar tipos antes de usar
iterations: finalConfig.iterationCount === 'infinite' ? Infinity : finalConfig.iterationCount,
```

### **Flujo de Resolución Sistemática:**
```bash
# 1. Detectar errores
npm run typecheck

# 2. Analizar cada error
# - Leer el mensaje completo
# - Identificar el archivo y línea
# - Entender el tipo esperado vs actual

# 3. Aplicar patrón de resolución
# - Usar type assertion cuando sea seguro
# - Transformar tipos antes de usar
# - Cambiar implementación si es necesario

# 4. Verificar resolución
npm run typecheck

# 5. Repetir hasta 0 errores
```

### **Herramientas de Detección Automática:**
- **`npm run typecheck`** - Detección completa de errores TypeScript
- **Editor Integration** - TypeScript errors en tiempo real
- **Pre-commit Hooks** - Verificación automática antes de commit
- **CI/CD Pipeline** - Verificación en cada pull request

---

## 📚 RECURSOS ADICIONALES

### **Referencias Técnicas:**
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [Clean Code Principles](https://blog.cleancoder.com/)

### **Herramientas de Calidad:**
- ESLint + Prettier
- SonarQube
- Lighthouse CI
- Jest + React Testing Library

---

## 🔧 PATRONES DE PERFORMANCE AVANZADOS

### **Virtualización para Listas Grandes**
```typescript
// ✅ VIRTUALIZATION PATTERNS:
const VirtualizedAnalysisList = memo(({ analyses }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const { virtualItems, totalSize } = useVirtualizer({
    count: analyses.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${totalSize}px`, position: 'relative' }}>
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <AnalysisItem analysis={analyses[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
});
```

### **Code Splitting Inteligente**
```typescript
// ✅ INTELLIGENT CODE SPLITTING:
const LazyAnalysisChart = lazy(() => 
  import('./AnalysisChart').then(module => ({
    default: module.AnalysisChart
  }))
);

const LazyExportModule = lazy(() => 
  import('./ExportModule').then(module => ({
    default: module.ExportModule
  }))
);

// Preload on user interaction
const preloadChart = () => {
  const chartModule = import('./AnalysisChart');
  return chartModule;
};
```

### **Web Workers para Cálculos Pesados**
```typescript
// ✅ WEB WORKER PATTERNS:
const useWebWorker = <T>(worker: Worker, data: any) => {
  const [result, setResult] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    worker.postMessage(data);
    
    const handleMessage = (e: MessageEvent<T>) => {
      setResult(e.data);
      setIsLoading(false);
    };
    
    worker.addEventListener('message', handleMessage);
    
    return () => {
      worker.removeEventListener('message', handleMessage);
      worker.terminate();
    };
  }, [data]);
  
  return { result, isLoading };
};

// Worker implementation
const analysisWorker = new Worker(new URL('./analysis.worker.ts', import.meta.url));
```

---

## 🛡️ PATRONES DE SEGURIDAD OBLIGATORIOS

### **Sanitización de Inputs**
```typescript
// ✅ INPUT SANITIZATION:
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
};

const validateUserInput = (input: unknown): UserInput => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    coefficients: z.object({
      a: z.number().refine(val => val !== 0, "Coeficiente 'a' no puede ser cero"),
      b: z.number(),
      c: z.number()
    })
  });
  return schema.parse(input);
};
```

### **CSP Headers y XSS Prevention**
```typescript
// ✅ SECURITY HEADERS:
const SecurityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// ✅ CSRF PROTECTION:
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

const apiCall = async (data: any) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken || '',
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

---

## 🧪 PATRONES DE TESTING AVANZADOS

### **Contract Testing**
```typescript
// ✅ CONTRACT TESTING:
describe('API Contract Tests', () => {
  it('should match OpenAPI specification', async () => {
    const response = await request(app)
      .post('/api/analyze')
      .send({
        coefficients: { a: 1, b: -4, c: 4 },
        mode: 'full'
      });
    
    expect(response.body).toMatchSchema(analysisResponseSchema);
    expect(response.status).toBe(200);
  });
});

// ✅ PERFORMANCE TESTING:
describe('Performance Tests', () => {
  it('should render within 16ms', () => {
    const start = performance.now();
    render(<HeavyAnalysisComponent />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(16);
  });
  
  it('should handle large datasets efficiently', () => {
    const largeDataset = generateLargeDataset(10000);
    const { container } = render(<AnalysisList data={largeDataset} />);
    
    expect(container.querySelectorAll('.analysis-item')).toHaveLength(10000);
  });
});

// ✅ ACCESSIBILITY TESTING:
describe('A11y Tests', () => {
  it('should meet WCAG 2.1 AA standards', async () => {
    const { container } = render(<AnalysisForm />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
  
  it('should support keyboard navigation', () => {
    render(<AnalysisForm />);
    
    fireEvent.keyDown(screen.getByLabelText('Coeficiente A'), { key: 'Tab' });
    expect(screen.getByLabelText('Coeficiente B')).toHaveFocus();
  });
});
```

---

## 🏗️ ARQUITECTURA DE MICROFRONTENDS

### **Module Federation**
```typescript
// ✅ MODULE FEDERATION PATTERNS:
// webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'mutualmetrics',
      remotes: {
        calculator: 'calculator@http://localhost:3001/remoteEntry.js',
        charts: 'charts@http://localhost:3002/remoteEntry.js',
      },
      exposes: {
        './AnalysisForm': './src/components/AnalysisForm',
        './AnalysisResults': './src/components/AnalysisResults',
      },
    }),
  ],
};

// ✅ DYNAMIC IMPORTS:
const CalculatorModule = lazy(() => import('calculator/Calculator'));
const ChartsModule = lazy(() => import('charts/ChartLibrary'));
```

### **Event-Driven Communication**
```typescript
// ✅ EVENT BUS PATTERNS:
class EventBus extends EventTarget {
  private static instance: EventBus;
  
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }
  
  emit(event: string, data: any) {
    this.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}

const eventBus = EventBus.getInstance();

// Subscribe to events
eventBus.addEventListener('analysis-complete', (e: CustomEvent) => {
  const result = e.detail;
  updateUI(result);
});

// Emit events
eventBus.emit('analysis-complete', analysisResult);
```

---

## ⚡ CI/CD QUALITY GATES

### **Pipeline de Calidad**
```yaml
# ✅ .github/workflows/quality-gate.yml
name: Quality Gate
on: [pull_request, push]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - name: SonarQube Analysis
        run: |
          sonar-scanner \
            -Dsonar.projectKey=mutualmetrics \
            -Dsonar.qualitygate.wait=true \
            -Dsonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts
      
      - name: Performance Budget Check
        run: |
          lighthouse-ci autorun \
            --config=./lighthouserc.json \
            --budget-path=./budget.json
      
      - name: Security Scan
        run: |
          npm audit --audit-level=moderate
          snyk test --severity-threshold=high
      
      - name: Bundle Analysis
        run: |
          npm run build
          npx webpack-bundle-analyzer build/static/js/*.js
```

### **Performance Budget**
```json
// ✅ budget.json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "2kb",
      "maximumError": "4kb"
    }
  ]
}
```

---

## 📊 MONITORING Y OBSERVABILIDAD

### **Error Tracking**
```typescript
// ✅ ERROR TRACKING PATTERNS:
import * as Sentry from '@sentry/react';

const errorTracker = new ErrorTracker({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Error boundary with tracking
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorTracker.captureException(error, { extra: errorInfo });
  }
}
```

### **Performance Monitoring**
```typescript
// ✅ PERFORMANCE MONITORING:
const performanceMonitor = new PerformanceMonitor({
  metrics: ['FCP', 'LCP', 'CLS', 'FID', 'TTFB'],
  threshold: { 
    FCP: 1000, 
    LCP: 2500, 
    CLS: 0.1, 
    FID: 100 
  },
  onMetric: (metric) => {
    analytics.track('performance_metric', metric);
  }
});

// Custom performance marks
performance.mark('analysis-start');
const result = await analyzeQuadratic(coefficients);
performance.mark('analysis-end');
performance.measure('analysis-duration', 'analysis-start', 'analysis-end');
```

### **User Behavior Tracking**
```typescript
// ✅ ANALYTICS PATTERNS:
const analytics = new Analytics({
  events: [
    'analysis_started', 
    'analysis_completed', 
    'analysis_failed',
    'export_requested',
    'chart_interaction'
  ],
  userProperties: {
    userType: 'premium',
    analysisCount: 0,
    preferredMode: 'full'
  }
});

// Track user interactions
const trackAnalysis = (coefficients: Coefficients, mode: AnalysisMode) => {
  analytics.track('analysis_started', {
    coefficients,
    mode,
    timestamp: Date.now()
  });
};
```

---

## ⚙️ PATRONES DE PROGRAMACIÓN FUNCIONAL AVANZADO

### **Railway Oriented Programming**
```typescript
// ✅ RAILWAY ORIENTED PROGRAMMING:
type Result<T, E> = Success<T> | Failure<E>;

const analyzeQuadratic = (coefficients: Coefficients): Result<Analysis, Error> => {
  return pipe(
    coefficients,
    validateCoefficients,
    Result.flatMap(calculateRoots),
    Result.flatMap(calculateVertex),
    Result.flatMap(calculateOptimal),
    Result.map(createAnalysis)
  );
};

// ✅ MONADIC ERROR HANDLING:
const safeOperation = (operation: () => Promise<T>) =>
  TaskEither.tryCatch(operation, (error) => new Error(String(error)));

const analysisPipeline = pipe(
  safeOperation(() => fetchAnalysis(coefficients)),
  TaskEither.chain(result => safeOperation(() => processResult(result))),
  TaskEither.fold(
    (error) => handleError(error),
    (result) => handleSuccess(result)
  )
);
```

### **Lens Patterns**
```typescript
// ✅ LENS PATTERNS FOR IMMUTABLE UPDATES:
import { lensProp, over, set, view } from 'ramda';

const analysisLens = lensProp<State>('analysis');
const coefficientsLens = lensProp<Analysis>('coefficients');
const nestedLens = lensPath(['analysis', 'coefficients', 'a']);

const updateAnalysis = over(analysisLens, setResults);
const getCoefficients = view(coefficientsLens, state);
const updateCoefficientA = set(nestedLens, newValue, state);
```

---

## 💾 PATRONES DE OPTIMIZACIÓN DE MEMORIA

### **Object Pooling**
```typescript
// ✅ OBJECT POOLING:
class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (obj: T) => void;
  
  constructor(factory: () => T, reset: (obj: T) => void, initialSize: number = 10) {
    this.factory = factory;
    this.reset = reset;
    
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }
  
  acquire(): T {
    return this.pool.pop() || this.factory();
  }
  
  release(obj: T): void {
    this.reset(obj);
    this.pool.push(obj);
  }
}

const analysisResultPool = new ObjectPool<AnalysisResult>(
  () => new AnalysisResult(),
  (result) => result.reset(),
  100
);
```

### **Weak References para Caching**
```typescript
// ✅ WEAK REFERENCES:
const cache = new WeakMap<Coefficients, AnalysisResult>();

const getCachedResult = (coefficients: Coefficients): AnalysisResult | null => {
  return cache.get(coefficients) || null;
};

const setCachedResult = (coefficients: Coefficients, result: AnalysisResult): void => {
  cache.set(coefficients, result);
};
```

### **Memory Leak Prevention**
```typescript
// ✅ MEMORY LEAK PREVENTION:
const useAnalysisWithCleanup = () => {
  const [state, setState] = useState<AnalysisState>(initialState);
  const abortControllerRef = useRef<AbortController>();
  
  useEffect(() => {
    abortControllerRef.current = new AbortController();
    
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);
  
  const analyze = useCallback(async (coefficients: Coefficients) => {
    try {
      const result = await fetchAnalysis(coefficients, {
        signal: abortControllerRef.current?.signal
      });
      setState(prev => ({ ...prev, result }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        setState(prev => ({ ...prev, error: error.message }));
      }
    }
  }, []);
  
  return { state, analyze };
};
```

---

## 🔄 PATRONES DE CONCURRENCIA

### **Promise.all con Error Handling**
```typescript
// ✅ CONCURRENCY PATTERNS:
const parallelAnalysis = async (coefficients: Coefficients[]) => {
  const results = await Promise.allSettled(
    coefficients.map(analyze)
  );
  
  const successful = results
    .filter((result): result is PromiseFulfilledResult<AnalysisResult> => 
      result.status === 'fulfilled'
    )
    .map(result => result.value);
    
  const failed = results
    .filter((result): result is PromiseRejectedResult => 
      result.status === 'rejected'
    )
    .map(result => result.reason);
    
  return { successful, failed };
};
```

### **Rate Limiting**
```typescript
// ✅ RATE LIMITING:
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;
  
  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded');
    }
    
    this.requests.push(now);
    return fn();
  }
}

const apiRateLimiter = new RateLimiter(10, 1000); // 10 requests per second
```

### **Circuit Breaker Pattern**
```typescript
// ✅ CIRCUIT BREAKER:
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private failureThreshold: number = 5,
    private resetTimeout: number = 60000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

const analysisCircuitBreaker = new CircuitBreaker(5, 60000);
```

---

## 🎯 DOMAIN-DRIVEN DESIGN PATTERNS

### **Value Objects**
```typescript
// ✅ VALUE OBJECTS:
class Coefficient {
  private constructor(private value: number) {}
  
  static create(value: number): Result<Coefficient, Error> {
    if (typeof value !== 'number' || isNaN(value)) {
      return Result.failure(new Error('Invalid coefficient value'));
    }
    return Result.success(new Coefficient(value));
  }
  
  getValue(): number {
    return this.value;
  }
  
  equals(other: Coefficient): boolean {
    return this.value === other.value;
  }
}

class QuadraticEquation {
  constructor(
    private a: Coefficient,
    private b: Coefficient,
    private c: Coefficient
  ) {}
  
  static create(a: number, b: number, c: number): Result<QuadraticEquation, Error> {
    return pipe(
      Coefficient.create(a),
      Result.chain(aCoeff => 
        pipe(
          Coefficient.create(b),
          Result.chain(bCoeff =>
            pipe(
              Coefficient.create(c),
              Result.map(cCoeff => new QuadraticEquation(aCoeff, bCoeff, cCoeff))
            )
          )
        )
      )
    );
  }
}
```

### **Aggregates**
```typescript
// ✅ AGGREGATES:
class AnalysisAggregate {
  private constructor(
    private id: AnalysisId,
    private equation: QuadraticEquation,
    private results: AnalysisResult[],
    private events: DomainEvent[] = []
  ) {}
  
  static create(equation: QuadraticEquation): AnalysisAggregate {
    const id = AnalysisId.generate();
    return new AnalysisAggregate(id, equation, []);
  }
  
  performAnalysis(mode: AnalysisMode): void {
    const result = this.equation.analyze(mode);
    this.results.push(result);
    this.events.push(new AnalysisPerformedEvent(this.id, result));
  }
  
  getUncommittedEvents(): DomainEvent[] {
    return [...this.events];
  }
  
  markEventsAsCommitted(): void {
    this.events = [];
  }
}
```

---

**💡 RECUERDA:** Esta guía es tu fuente única de verdad para código de alta calidad y rendimiento. Consúltala antes de cada sesión de programación para mantener consistencia, excelencia y cumplir con los estándares de programación moderna y experta en todo el proyecto MutualMetrics.
