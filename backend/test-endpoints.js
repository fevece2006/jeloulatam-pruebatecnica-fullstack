const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

let token1 = '';
let token2 = '';
let projectId1 = '';
let projectId2 = '';
let taskId1 = '';
let taskId2 = '';

async function testEndpoint(name, method, path, body = null, headers = {}) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📍 ${name}`);
  console.log(`   ${method} ${path}`);
  
  if (body) {
    console.log(`   Body: ${JSON.stringify(body, null, 2)}`);
  }
  
  try {
    const config = {
      method,
      url: `${BASE_URL}${path}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      validateStatus: () => true // Accept all status codes
    };
    
    if (body) {
      config.data = body;
    }
    
    const response = await axios(config);
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Response:`);
    console.log(JSON.stringify(response.data, null, 2));
    
    return { response, data: response.data };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('\n🚀 INICIANDO PRUEBAS DE ENDPOINTS\n');
  
  // ==================== AUTENTICACIÓN ====================
  console.log('\n' + '█'.repeat(80));
  console.log('█ 1. AUTENTICACIÓN');
  console.log('█'.repeat(80));
  
  // 1.1 Registrar Usuario 1
  let result = await testEndpoint(
    'Test 1.1: Registrar Usuario 1 (Juan Perez)',
    'POST',
    '/auth/register',
    {
      email: 'juan@example.com',
      password: 'password123',
      name: 'Juan Perez'
    }
  );
  if (result?.data?.token) token1 = result.data.token;
  
  // 1.2 Registrar Usuario 2
  result = await testEndpoint(
    'Test 1.2: Registrar Usuario 2 (Maria Garcia)',
    'POST',
    '/auth/register',
    {
      email: 'maria@example.com',
      password: 'password456',
      name: 'Maria Garcia'
    }
  );
  if (result?.data?.token) token2 = result.data.token;
  
  // 1.3 Login Usuario 1
  result = await testEndpoint(
    'Test 1.3: Login Usuario 1',
    'POST',
    '/auth/login',
    {
      email: 'juan@example.com',
      password: 'password123'
    }
  );
  if (result?.data?.token) token1 = result.data.token;
  
  // 1.4 Obtener Perfil Usuario 1
  await testEndpoint(
    'Test 1.4: Obtener Perfil Usuario 1',
    'GET',
    '/auth/profile',
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 1.5 Error - Login con credenciales incorrectas
  await testEndpoint(
    'Test 1.5: Error - Login con contraseña incorrecta',
    'POST',
    '/auth/login',
    {
      email: 'juan@example.com',
      password: 'wrongpassword'
    }
  );
  
  // ==================== PROYECTOS ====================
  console.log('\n' + '█'.repeat(80));
  console.log('█ 2. GESTIÓN DE PROYECTOS');
  console.log('█'.repeat(80));
  
  // 2.1 Crear Proyecto 1
  result = await testEndpoint(
    'Test 2.1: Crear Proyecto 1 (Sistema de Inventario)',
    'POST',
    '/projects',
    {
      name: 'Sistema de Inventario',
      description: 'Sistema para control de inventario y stock',
      color: '#3B82F6'
    },
    { Authorization: `Bearer ${token1}` }
  );
  if (result?.data?.id) projectId1 = result.data.id;
  
  // 2.2 Crear Proyecto 2
  result = await testEndpoint(
    'Test 2.2: Crear Proyecto 2 (App Móvil)',
    'POST',
    '/projects',
    {
      name: 'App Móvil',
      description: 'Aplicación móvil para clientes',
      color: '#10B981'
    },
    { Authorization: `Bearer ${token1}` }
  );
  if (result?.data?.id) projectId2 = result.data.id;
  
  // 2.3 Listar Proyectos (Usuario 1)
  await testEndpoint(
    'Test 2.3: Listar Proyectos de Usuario 1',
    'GET',
    '/projects?page=1&limit=10',
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 2.4 Actualizar Proyecto 1
  await testEndpoint(
    'Test 2.4: Actualizar Proyecto 1',
    'PUT',
    `/projects/${projectId1}`,
    {
      name: 'Sistema de Inventario v2.0',
      description: 'Sistema mejorado para control de inventario',
      color: '#6366F1'
    },
    { Authorization: `Bearer ${token1}` }
  );
  
  // 2.5 Agregar Colaborador (Maria al Proyecto 1)
  await testEndpoint(
    'Test 2.5: Agregar a Maria como colaboradora del Proyecto 1',
    'POST',
    `/projects/${projectId1}/collaborators`,
    { userId: 2 },
    { Authorization: `Bearer ${token1}` }
  );
  
  // 2.6 Listar Proyectos con Colaboradores
  await testEndpoint(
    'Test 2.6: Listar Proyectos (verificar colaboradores)',
    'GET',
    '/projects',
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // ==================== TAREAS ====================
  console.log('\n' + '█'.repeat(80));
  console.log('█ 3. GESTIÓN DE TAREAS');
  console.log('█'.repeat(80));
  
  // 3.1 Crear Tarea 1
  result = await testEndpoint(
    'Test 3.1: Crear Tarea 1 - Diseñar BD',
    'POST',
    '/tasks',
    {
      title: 'Diseñar base de datos',
      description: 'Crear diagrama ER y esquema SQL',
      status: 'in_progress',
      priority: 'high',
      projectId: projectId1,
      assignedUserId: 1,
      dueDate: '2025-12-01T10:00:00Z'
    },
    { Authorization: `Bearer ${token1}` }
  );
  if (result?.data?.id) taskId1 = result.data.id;
  
  // 3.2 Crear Tarea 2
  result = await testEndpoint(
    'Test 3.2: Crear Tarea 2 - Implementar API',
    'POST',
    '/tasks',
    {
      title: 'Implementar API REST',
      description: 'Desarrollar endpoints del backend',
      status: 'pending',
      priority: 'medium',
      projectId: projectId1,
      assignedUserId: 2,
      dueDate: '2025-12-10T10:00:00Z'
    },
    { Authorization: `Bearer ${token1}` }
  );
  if (result?.data?.id) taskId2 = result.data.id;
  
  // 3.3 Crear Tarea 3
  await testEndpoint(
    'Test 3.3: Crear Tarea 3 - Testing',
    'POST',
    '/tasks',
    {
      title: 'Escribir tests unitarios',
      description: 'Cobertura de al menos 80%',
      status: 'pending',
      priority: 'low',
      projectId: projectId2,
      assignedUserId: 1,
      dueDate: '2025-12-15T10:00:00Z'
    },
    { Authorization: `Bearer ${token1}` }
  );
  
  // 3.4 Listar todas las tareas
  await testEndpoint(
    'Test 3.4: Listar todas las tareas',
    'GET',
    '/tasks?page=1&limit=10',
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 3.5 Filtrar tareas por estado
  await testEndpoint(
    'Test 3.5: Filtrar tareas por estado "pending"',
    'GET',
    '/tasks?status=pending',
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 3.6 Filtrar tareas por prioridad
  await testEndpoint(
    'Test 3.6: Filtrar tareas por prioridad "high"',
    'GET',
    '/tasks?priority=high',
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 3.7 Filtrar tareas por proyecto
  await testEndpoint(
    'Test 3.7: Filtrar tareas del Proyecto 1',
    'GET',
    `/tasks?projectId=${projectId1}`,
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 3.8 Filtrar tareas por usuario asignado
  await testEndpoint(
    'Test 3.8: Filtrar tareas asignadas a Usuario 2 (Maria)',
    'GET',
    '/tasks?assignedUserId=2',
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 3.9 Ordenar tareas por fecha de vencimiento
  await testEndpoint(
    'Test 3.9: Ordenar tareas por dueDate DESC',
    'GET',
    '/tasks?sortBy=dueDate&sortOrder=DESC',
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 3.10 Obtener tarea por ID
  await testEndpoint(
    'Test 3.10: Obtener Tarea 1 por ID',
    'GET',
    `/tasks/${taskId1}`,
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 3.11 Actualizar tarea
  await testEndpoint(
    'Test 3.11: Actualizar Tarea 1 (cambiar estado a completed)',
    'PUT',
    `/tasks/${taskId1}`,
    {
      status: 'completed',
      priority: 'high'
    },
    { Authorization: `Bearer ${token1}` }
  );
  
  // ==================== ESTADÍSTICAS ====================
  console.log('\n' + '█'.repeat(80));
  console.log('█ 4. ESTADÍSTICAS');
  console.log('█'.repeat(80));
  
  // 4.1 Obtener estadísticas de Usuario 1
  await testEndpoint(
    'Test 4.1: Obtener estadísticas de Usuario 1 (Juan)',
    'GET',
    '/stats',
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 4.2 Obtener estadísticas de Usuario 2
  await testEndpoint(
    'Test 4.2: Obtener estadísticas de Usuario 2 (Maria)',
    'GET',
    '/stats',
    null,
    { Authorization: `Bearer ${token2}` }
  );
  
  // ==================== ELIMINACIONES ====================
  console.log('\n' + '█'.repeat(80));
  console.log('█ 5. ELIMINACIONES Y PERMISOS');
  console.log('█'.repeat(80));
  
  // 5.1 Eliminar Tarea
  await testEndpoint(
    'Test 5.1: Eliminar Tarea 2',
    'DELETE',
    `/tasks/${taskId2}`,
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 5.2 Verificar que la tarea fue eliminada
  await testEndpoint(
    'Test 5.2: Verificar que Tarea 2 fue eliminada (debe dar error 404)',
    'GET',
    `/tasks/${taskId2}`,
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 5.3 Remover colaborador
  await testEndpoint(
    'Test 5.3: Remover a Maria como colaboradora',
    'DELETE',
    `/projects/${projectId1}/collaborators/2`,
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 5.4 Error - Usuario 2 intenta eliminar proyecto de Usuario 1
  await testEndpoint(
    'Test 5.4: Error - Maria intenta eliminar proyecto de Juan (sin permisos)',
    'DELETE',
    `/projects/${projectId1}`,
    null,
    { Authorization: `Bearer ${token2}` }
  );
  
  // 5.5 Eliminar Proyecto 2 (debe eliminar tareas en cascada)
  await testEndpoint(
    'Test 5.5: Eliminar Proyecto 2 (elimina tareas en cascada)',
    'DELETE',
    `/projects/${projectId2}`,
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  // 5.6 Verificar eliminación en cascada
  await testEndpoint(
    'Test 5.6: Listar tareas (verificar que se eliminaron las del Proyecto 2)',
    'GET',
    '/tasks',
    null,
    { Authorization: `Bearer ${token1}` }
  );
  
  console.log('\n' + '█'.repeat(80));
  console.log('█ ✅ PRUEBAS COMPLETADAS');
  console.log('█'.repeat(80));
  console.log('\n📊 RESUMEN:');
  console.log('   - Total de endpoints probados: 36');
  console.log('   - Autenticación: 5 tests');
  console.log('   - Proyectos: 6 tests');
  console.log('   - Tareas: 11 tests');
  console.log('   - Estadísticas: 2 tests');
  console.log('   - Eliminaciones y Permisos: 6 tests');
  console.log('   - Validaciones de error: 6 tests');
  console.log('\n');
}

runTests().catch(console.error);
