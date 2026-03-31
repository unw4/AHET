.PHONY: dev test build migrate-up migrate-down lint clean firmware

# ─── Root: spin up all services ───────────────────────────────
dev:
	docker-compose up -d
	@echo "Services running. Backend: http://localhost:8080 | Web: http://localhost:5173"

down:
	docker-compose down

# ─── Backend ──────────────────────────────────────────────────
backend-build:
	cd backend && go build -o bin/server ./cmd/server

backend-test:
	cd backend && go test ./... -v

backend-lint:
	cd backend && golangci-lint run ./...

migrate-up:
	cd backend && go run ./cmd/server migrate up

migrate-down:
	cd backend && go run ./cmd/server migrate down

# ─── Web Panel ────────────────────────────────────────────────
web-install:
	cd web && npm install

web-dev:
	cd web && npm run dev

web-build:
	cd web && npm run build

web-test:
	cd web && npm run test

# ─── Mobile ───────────────────────────────────────────────────
mobile-install:
	cd mobile && npm install

mobile-ios:
	cd mobile && npx react-native run-ios

mobile-android:
	cd mobile && npx react-native run-android

# ─── Firmware ─────────────────────────────────────────────────
firmware-build:
	cd hardware && pio run

firmware-upload:
	cd hardware && pio run --target upload

firmware-monitor:
	cd hardware && pio device monitor --baud 115200

firmware-test:
	cd hardware && pio test

# ─── Scripts ──────────────────────────────────────────────────
seed:
	bash scripts/seed-db.sh

simulate-esp32:
	bash scripts/simulate-esp32-payload.sh

# ─── Cleanup ──────────────────────────────────────────────────
clean:
	cd backend && rm -rf bin/
	cd web && rm -rf dist/ node_modules/
	cd hardware && pio run --target clean
