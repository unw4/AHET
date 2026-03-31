# RBAC Role-Permission Matrix

**Project:** AH@
**Authors:** MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

---

## Roles

| Role | Description |
|------|-------------|
| **MANAGER** | Full administrative access. Can manage vehicles, create tasks, approve tests, create maintenance records, manage users. |
| **EMPLOYEE** | Operational access. Can view vehicles and DTCs, update task status, view/update maintenance. Cannot create or delete high-level resources. |
| **USER** | Read-only access. Can view their assigned vehicle's status, receive push notifications, and view maintenance schedules. |

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
| **Gas Tests** | List | ✅ | ✅ (view) | ❌ |
| | Trigger/Approve | ✅ | ❌ | ❌ |
| | View result | ✅ | ✅ | ❌ |
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
- "Own vehicle only" for `USER` role is enforced at the service layer by joining `vehicles` with a user-vehicle assignment table (or using the `vehicle_id` embedded in the user profile).
