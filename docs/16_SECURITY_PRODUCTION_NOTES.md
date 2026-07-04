# NexoDigital - Security Production Notes

Estado: notas de seguridad para V1 productiva  
Infraestructura: Hostinger + Railway + Neon

---

## 1. Secretos

No versionar nunca:

- `backend/.env`
- connection string real de Neon;
- `JWT_ACCESS_SECRET`;
- `JWT_REFRESH_SECRET`;
- password admin real;
- tokens emitidos por la API;
- credenciales de proveedores.

Los archivos `.env.example` solo deben contener placeholders.

## 2. Variables críticas

Backend Railway:

```txt
DATABASE_URL
NODE_ENV=production
CORS_ORIGIN
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_NAME
ADMIN_ROLE
```

Frontend Hostinger:

```txt
VITE_API_BASE_URL
```

`VITE_API_BASE_URL` es público por naturaleza porque se incluye en el build frontend. No poner secretos ahí.

## 3. CORS

En producción, Railway debe aceptar únicamente el dominio real de Hostinger.

Correcto:

```txt
CORS_ORIGIN=https://nexo-digital.tech,https://www.nexo-digital.tech
```

Incorrecto:

```txt
CORS_ORIGIN=*
```

Si se usa dominio temporal, agregarlo explícitamente y removerlo cuando deje de usarse.

## 4. Autenticación

Estado V1:

- access token corto;
- refresh token más largo;
- refresh token guardado en frontend de forma encapsulada;
- logout revoca refresh token;
- contraseñas hasheadas con bcrypt.

Pendiente recomendado antes de producción sensible:

- evaluar mover refresh token a cookie `httpOnly`, `Secure`, `SameSite`;
- agregar pantalla real para rotar contraseña admin;
- agregar gestión de usuarios internos;
- agregar bloqueo/estado de usuario desde panel.

## 5. Roles y permisos

Roles actuales:

- `ADMIN`
- `MEMBER`
- `COLLABORATOR`
- `READONLY`

Reglas V1:

- lecturas internas requieren token válido;
- mutaciones requieren `ADMIN` o `MEMBER`;
- auditoría requiere `ADMIN`;
- `READONLY` no debe ver acciones de crear/editar/archivar/cancelar;
- el backend sigue siendo la autoridad final aunque la UI oculte botones.

## 6. Auditoría

La auditoría guarda eventos relevantes:

- login exitoso;
- login fallido;
- refresh;
- logout;
- creación/edición/archivado de entidades principales.

El backend sanitiza metadata y redacta claves sensibles que contengan:

- password;
- token;
- secret;
- authorization;
- cookie;
- apiKey.

La UI de auditoría:

- solo está visible para `ADMIN`;
- muestra metadata en modal;
- no debe imprimir datos sensibles en consola.

## 7. Rate limiting

Estado V1:

- login limitado por IP;
- API general limitada por IP;
- rate limiting en memoria.

Riesgo:

- si Railway escala a múltiples instancias, el rate limiting en memoria no será compartido.

Pendiente futuro:

- mover rate limiting a Redis/servicio externo si aumenta tráfico o exposición.

## 8. Base de datos Neon

Recomendaciones:

- usar connection string con SSL;
- no compartir `DATABASE_URL`;
- aplicar migraciones con `prisma migrate deploy`;
- no usar `prisma migrate dev` contra producción;
- mantener backups/snapshots de Neon según plan contratado.

## 9. Datos sensibles

No guardar en el CRM:

- contraseñas de proveedores;
- datos completos de tarjetas;
- tokens privados de servicios;
- secrets de APIs;
- cookies;
- credenciales bancarias.

Para proveedores, usar campos operativos:

- nombre;
- categoría;
- email de cuenta;
- owner interno;
- notas no sensibles;
- uso recomendado.

## 10. Web pública y CRM

La web pública no debe consumir datos privados del CRM.

La futura conexión de trabajos públicos debe usar:

```txt
GET /api/public/works
```

Ese endpoint no expone notas internas, costos, repositorios privados ni datos sensibles.

## 11. Checklist de seguridad antes de producción

- [ ] Confirmar que `.env` real no está versionado.
- [ ] Rotar secrets si fueron compartidos durante pruebas.
- [ ] Configurar `NODE_ENV=production`.
- [ ] Configurar `CORS_ORIGIN` exacto.
- [ ] Verificar login admin.
- [ ] Verificar que READONLY no puede mutar datos.
- [ ] Verificar que audit logs requiere ADMIN.
- [ ] Verificar que Hostinger usa HTTPS.
- [ ] Verificar que Railway usa HTTPS público.
- [ ] Verificar que Neon usa SSL.
- [ ] Ejecutar `git diff --check`.
- [ ] Ejecutar build frontend y backend.

## 12. Riesgos aceptados en V1

- Refresh token todavía no usa cookie httpOnly.
- Rate limiting en memoria.
- No hay gestión completa de usuarios desde UI.
- No hay emails de alerta.
- No hay cron jobs.
- No hay monitoreo avanzado.

Estos riesgos son aceptables para una V1 interna controlada, pero deben revisarse antes de abrir el CRM a más usuarios.
