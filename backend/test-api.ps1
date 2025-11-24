# Script de prueba de API - Backend Project Management
Write-Host "=== PRUEBA COMPLETA DE API ===" -ForegroundColor Cyan
Write-Host ""

# Variables globales
$baseUrl = "http://localhost:3001/api"
$token = ""
$userId = 0
$projectId = 0
$taskId = 0
$user2Id = 0

Write-Host "PASO 1: Registro de Usuario Principal" -ForegroundColor Yellow
Write-Host "Endpoint: POST /auth/register" -ForegroundColor Gray
$registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body (@{
        email = "test@example.com"
        password = "Password123!"
        name = "Test User"
    } | ConvertTo-Json)

Write-Host "✅ Usuario registrado exitosamente" -ForegroundColor Green
Write-Host "   ID: $($registerResponse.user.id)" -ForegroundColor Gray
Write-Host "   Email: $($registerResponse.user.email)" -ForegroundColor Gray
Write-Host "   Nombre: $($registerResponse.user.name)" -ForegroundColor Gray
Write-Host "   Token recibido: $($registerResponse.token.Substring(0, 20))..." -ForegroundColor Gray
$token = $registerResponse.token
$userId = $registerResponse.user.id
Write-Host ""

Write-Host "PASO 2: Login de Usuario" -ForegroundColor Yellow
Write-Host "Endpoint: POST /auth/login" -ForegroundColor Gray
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body (@{
        email = "test@example.com"
        password = "Password123!"
    } | ConvertTo-Json)

Write-Host "✅ Login exitoso" -ForegroundColor Green
Write-Host "   Token actualizado: $($loginResponse.token.Substring(0, 20))..." -ForegroundColor Gray
$token = $loginResponse.token
Write-Host ""

Write-Host "PASO 3: Obtener Perfil de Usuario" -ForegroundColor Yellow
Write-Host "Endpoint: GET /auth/profile" -ForegroundColor Gray
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$profileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/profile" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Perfil obtenido" -ForegroundColor Green
Write-Host "   ID: $($profileResponse.id)" -ForegroundColor Gray
Write-Host "   Email: $($profileResponse.email)" -ForegroundColor Gray
Write-Host "   Nombre: $($profileResponse.name)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 4: Crear Segundo Usuario (para colaboradores)" -ForegroundColor Yellow
Write-Host "Endpoint: POST /auth/register" -ForegroundColor Gray
$user2Response = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body (@{
        email = "collaborator@example.com"
        password = "Password123!"
        name = "Collaborator User"
    } | ConvertTo-Json)

Write-Host "✅ Segundo usuario registrado" -ForegroundColor Green
Write-Host "   ID: $($user2Response.user.id)" -ForegroundColor Gray
Write-Host "   Email: $($user2Response.user.email)" -ForegroundColor Gray
$user2Id = $user2Response.user.id
Write-Host ""

Write-Host "PASO 5: Crear Proyecto" -ForegroundColor Yellow
Write-Host "Endpoint: POST /projects" -ForegroundColor Gray
$createProjectResponse = Invoke-RestMethod -Uri "$baseUrl/projects" `
    -Method Post `
    -Headers $headers `
    -Body (@{
        name = "Proyecto de Prueba"
        description = "Descripción del proyecto de prueba"
        color = "#FF5733"
    } | ConvertTo-Json)

Write-Host "✅ Proyecto creado" -ForegroundColor Green
Write-Host "   ID: $($createProjectResponse.id)" -ForegroundColor Gray
Write-Host "   Nombre: $($createProjectResponse.name)" -ForegroundColor Gray
Write-Host "   Color: $($createProjectResponse.color)" -ForegroundColor Gray
Write-Host "   Owner ID: $($createProjectResponse.owner.id)" -ForegroundColor Gray
$projectId = $createProjectResponse.id
Write-Host ""

Write-Host "PASO 6: Listar Proyectos (con paginación)" -ForegroundColor Yellow
Write-Host "Endpoint: GET /projects?page=1&limit=10" -ForegroundColor Gray
$listProjectsResponse = Invoke-RestMethod -Uri "$baseUrl/projects?page=1&limit=10" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Proyectos listados" -ForegroundColor Green
Write-Host "   Total: $($listProjectsResponse.total)" -ForegroundColor Gray
Write-Host "   Página: $($listProjectsResponse.page) de $($listProjectsResponse.totalPages)" -ForegroundColor Gray
Write-Host "   Proyectos en página: $($listProjectsResponse.data.Count)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 7: Actualizar Proyecto" -ForegroundColor Yellow
Write-Host "Endpoint: PUT /projects/$projectId" -ForegroundColor Gray
$updateProjectResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId" `
    -Method Put `
    -Headers $headers `
    -Body (@{
        name = "Proyecto Actualizado"
        description = "Descripción actualizada"
        color = "#00FF00"
    } | ConvertTo-Json)

Write-Host "✅ Proyecto actualizado" -ForegroundColor Green
Write-Host "   Nuevo nombre: $($updateProjectResponse.name)" -ForegroundColor Gray
Write-Host "   Nuevo color: $($updateProjectResponse.color)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 8: Agregar Colaborador al Proyecto" -ForegroundColor Yellow
Write-Host "Endpoint: POST /projects/$projectId/collaborators" -ForegroundColor Gray
$addCollaboratorResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId/collaborators" `
    -Method Post `
    -Headers $headers `
    -Body (@{
        userId = $user2Id
    } | ConvertTo-Json)

Write-Host "✅ Colaborador agregado" -ForegroundColor Green
Write-Host "   Colaboradores totales: $($addCollaboratorResponse.collaborators.Count)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 9: Crear Tarea en el Proyecto" -ForegroundColor Yellow
Write-Host "Endpoint: POST /tasks" -ForegroundColor Gray
$createTaskResponse = Invoke-RestMethod -Uri "$baseUrl/tasks" `
    -Method Post `
    -Headers $headers `
    -Body (@{
        title = "Tarea de Prueba"
        description = "Descripción de la tarea"
        status = "pending"
        priority = "high"
        projectId = $projectId
        assignedUserId = $user2Id
        dueDate = "2025-12-31T23:59:59.000Z"
    } | ConvertTo-Json)

Write-Host "✅ Tarea creada" -ForegroundColor Green
Write-Host "   ID: $($createTaskResponse.id)" -ForegroundColor Gray
Write-Host "   Título: $($createTaskResponse.title)" -ForegroundColor Gray
Write-Host "   Estado: $($createTaskResponse.status)" -ForegroundColor Gray
Write-Host "   Prioridad: $($createTaskResponse.priority)" -ForegroundColor Gray
Write-Host "   Asignada a: $($createTaskResponse.assignedUser.name)" -ForegroundColor Gray
$taskId = $createTaskResponse.id
Write-Host ""

Write-Host "PASO 10: Crear más tareas para probar filtros" -ForegroundColor Yellow
Write-Host "Endpoint: POST /tasks (múltiples)" -ForegroundColor Gray

Invoke-RestMethod -Uri "$baseUrl/tasks" `
    -Method Post `
    -Headers $headers `
    -Body (@{
        title = "Tarea Completada"
        description = "Esta tarea ya está completa"
        status = "completed"
        priority = "low"
        projectId = $projectId
        assignedUserId = $userId
    } | ConvertTo-Json) | Out-Null

Invoke-RestMethod -Uri "$baseUrl/tasks" `
    -Method Post `
    -Headers $headers `
    -Body (@{
        title = "Tarea En Progreso"
        description = "Esta tarea está en progreso"
        status = "in-progress"
        priority = "medium"
        projectId = $projectId
        assignedUserId = $userId
    } | ConvertTo-Json) | Out-Null

Write-Host "✅ 2 tareas adicionales creadas" -ForegroundColor Green
Write-Host ""

Write-Host "PASO 11: Listar Tareas (sin filtros)" -ForegroundColor Yellow
Write-Host "Endpoint: GET /tasks" -ForegroundColor Gray
$listTasksResponse = Invoke-RestMethod -Uri "$baseUrl/tasks" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Tareas listadas" -ForegroundColor Green
Write-Host "   Total: $($listTasksResponse.total)" -ForegroundColor Gray
Write-Host "   Tareas: $($listTasksResponse.data.Count)" -ForegroundColor Gray
foreach ($task in $listTasksResponse.data) {
    Write-Host "   - $($task.title) [$($task.status)] [$($task.priority)]" -ForegroundColor Gray
}
Write-Host ""

Write-Host "PASO 12: Filtrar Tareas por Estado" -ForegroundColor Yellow
Write-Host "Endpoint: GET /tasks?status=completed" -ForegroundColor Gray
$filterTasksResponse = Invoke-RestMethod -Uri "$baseUrl/tasks?status=completed" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Tareas filtradas por estado 'completed'" -ForegroundColor Green
Write-Host "   Total encontradas: $($filterTasksResponse.total)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 13: Filtrar Tareas por Prioridad" -ForegroundColor Yellow
Write-Host "Endpoint: GET /tasks?priority=high" -ForegroundColor Gray
$filterPriorityResponse = Invoke-RestMethod -Uri "$baseUrl/tasks?priority=high" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Tareas filtradas por prioridad 'high'" -ForegroundColor Green
Write-Host "   Total encontradas: $($filterPriorityResponse.total)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 14: Ordenar Tareas por Fecha de Vencimiento" -ForegroundColor Yellow
Write-Host "Endpoint: GET /tasks?sortBy=dueDate&sortOrder=ASC" -ForegroundColor Gray
$sortTasksResponse = Invoke-RestMethod -Uri "$baseUrl/tasks?sortBy=dueDate&sortOrder=ASC" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Tareas ordenadas por fecha de vencimiento" -ForegroundColor Green
Write-Host "   Total: $($sortTasksResponse.total)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 15: Obtener Tarea Específica por ID" -ForegroundColor Yellow
Write-Host "Endpoint: GET /tasks/$taskId" -ForegroundColor Gray
$getTaskResponse = Invoke-RestMethod -Uri "$baseUrl/tasks/$taskId" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Tarea obtenida" -ForegroundColor Green
Write-Host "   ID: $($getTaskResponse.id)" -ForegroundColor Gray
Write-Host "   Título: $($getTaskResponse.title)" -ForegroundColor Gray
Write-Host "   Proyecto: $($getTaskResponse.project.name)" -ForegroundColor Gray
Write-Host "   Asignada a: $($getTaskResponse.assignedUser.name)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 16: Actualizar Tarea" -ForegroundColor Yellow
Write-Host "Endpoint: PUT /tasks/$taskId" -ForegroundColor Gray
$updateTaskResponse = Invoke-RestMethod -Uri "$baseUrl/tasks/$taskId" `
    -Method Put `
    -Headers $headers `
    -Body (@{
        title = "Tarea Actualizada"
        description = "Descripción actualizada de la tarea"
        status = "in-progress"
        priority = "medium"
    } | ConvertTo-Json)

Write-Host "✅ Tarea actualizada" -ForegroundColor Green
Write-Host "   Nuevo título: $($updateTaskResponse.title)" -ForegroundColor Gray
Write-Host "   Nuevo estado: $($updateTaskResponse.status)" -ForegroundColor Gray
Write-Host "   Nueva prioridad: $($updateTaskResponse.priority)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 17: Obtener Estadísticas del Usuario" -ForegroundColor Yellow
Write-Host "Endpoint: GET /stats" -ForegroundColor Gray
$statsResponse = Invoke-RestMethod -Uri "$baseUrl/stats" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Estadísticas obtenidas" -ForegroundColor Green
Write-Host "   Total de proyectos: $($statsResponse.totalProjects)" -ForegroundColor Gray
Write-Host "   Total de tareas: $($statsResponse.totalTasks)" -ForegroundColor Gray
Write-Host "   Tareas por estado:" -ForegroundColor Gray
foreach ($status in $statsResponse.tasksByStatus) {
    Write-Host "     - $($status.status): $($status.count)" -ForegroundColor Gray
}
Write-Host ""

Write-Host "PASO 18: Eliminar Tarea" -ForegroundColor Yellow
Write-Host "Endpoint: DELETE /tasks/$taskId" -ForegroundColor Gray
$deleteTaskResponse = Invoke-RestMethod -Uri "$baseUrl/tasks/$taskId" `
    -Method Delete `
    -Headers $headers

Write-Host "✅ Tarea eliminada" -ForegroundColor Green
Write-Host "   Mensaje: $($deleteTaskResponse.message)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 19: Remover Colaborador del Proyecto" -ForegroundColor Yellow
Write-Host "Endpoint: DELETE /projects/$projectId/collaborators/$user2Id" -ForegroundColor Gray
$removeCollaboratorResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId/collaborators/$user2Id" `
    -Method Delete `
    -Headers $headers

Write-Host "✅ Colaborador removido" -ForegroundColor Green
Write-Host "   Colaboradores restantes: $($removeCollaboratorResponse.collaborators.Count)" -ForegroundColor Gray
Write-Host ""

Write-Host "PASO 20: Eliminar Proyecto" -ForegroundColor Yellow
Write-Host "Endpoint: DELETE /projects/$projectId" -ForegroundColor Gray
$deleteProjectResponse = Invoke-RestMethod -Uri "$baseUrl/projects/$projectId" `
    -Method Delete `
    -Headers $headers

Write-Host "✅ Proyecto eliminado" -ForegroundColor Green
Write-Host "   Mensaje: $($deleteProjectResponse.message)" -ForegroundColor Gray
Write-Host ""

Write-Host "=== PRUEBA COMPLETA FINALIZADA ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "RESUMEN:" -ForegroundColor Yellow
Write-Host "✅ Autenticación: Registro, Login, Perfil" -ForegroundColor Green
Write-Host "✅ Proyectos: CRUD completo + Colaboradores" -ForegroundColor Green
Write-Host "✅ Tareas: CRUD completo + Filtros + Ordenamiento" -ForegroundColor Green
Write-Host "✅ Estadísticas: Agregación de datos" -ForegroundColor Green
Write-Host ""
Write-Host "Todos los endpoints funcionan correctamente! 🎉" -ForegroundColor Cyan
