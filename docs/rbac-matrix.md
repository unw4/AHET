# RBAC Role-Permission Matrix

**Project:** AH@
**Authors:** MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

---

## Roles

| Role | Description |
|------|-------------|
| **MANAGER** | Full administrative access. Can manage vehicles, create/assign tasks, start diagnostic sessions, create maintenance records, manage users. |
| **EMPLOYEE** | Operational access. Can start diagnostic sessions, update task status, add findings to sessions, view vehicles and DTCs. Cannot create or delete high-level resources. |
| **USER** | Read-only access. Can view their assigned vehicle's status, receive push notifications, view maintenance schedules. |

---

## Permission Matrix

| Resource | Action | MANAGER | EMPLOYEE | USER |
|----------|--------|:-------:|:--------:|:----:|
| **Vehicles** | List all | ✅ | ✅ | Own vehicle only |
| | View detail | ✅ | ✅ | Own vehicle only |
| | Create | ✅ | ❌ | ❌ |
| | Delete | ✅ | ❌ | ❌ |
| **DTC Events** | View list | ✅ | ✅ | ❌ |
| | View detail | ✅ | ✅ | ❌ |
| **Telemetry** | Ingest (device) | Device Key | ❌ | ❌ |
| | Query history | ✅ | ✅ | ❌ |
| **Tasks** | List | ✅ | Own tasks | ❌ |
| | Create & assign | ✅ | ❌ | ❌ |
| | Update status | ✅ | ✅ (own) | ❌ |
| | Delete | ✅ | ❌ | ❌ |
| **Diagnostic Sessions** | List | ✅ | ✅ | ❌ |
| | Create (assign mechanic) | ✅ | ✅ | ❌ |
| | Start / Close | ✅ | ✅ (own) | ❌ |
| | Add findings + cost | ✅ | ✅ (own) | ❌ |
| | View detail | ✅ | ✅ | ❌ |
| **Maintenance** | List | ✅ | ✅ | ✅ |
| | Create | ✅ | ❌ | ❌ |
| | Update | ✅ | ✅ | ❌ |
| | Delete | ✅ | ❌ | ❌ |
| **Notifications** | Receive push | ✅ | ✅ | ✅ |
| | Register device token | ✅ | ✅ | ✅ |
| | View history | Own | Own | Own |
| **Users** | List | ✅ | ❌ | ❌ |
| | Create | ✅ | ❌ | ❌ |
| | Update role | ✅ | ❌ | ❌ |
| | Delete | ✅ | ❌ | ❌ |

---

## Implementation Notes

- Role is stored on the `users.role` column (ENUM: `MANAGER`, `EMPLOYEE`, `USER`).
- JWT access token payload includes `{ sub: user_id, role: "MANAGER" }`.
- The RBAC middleware reads the `role` claim from the JWT and compares it against the endpoint's required roles.
- Device API key (`X-Device-Api-Key` header) bypasses JWT auth for the `/telemetry/bulk` endpoint only.
- "Own vehicle only" for `USER` role is enforced at the service layer.
- Diagnostic sessions: an EMPLOYEE may only close sessions they are assigned to as mechanic (`mechanic_id = user.id`).
