.PHONY: stopall
stopall:
	docker compose stop

.PHONY: devup
devup: stopall
	docker compose -f compose.dev.yaml up -d

.PHONY: devbuildup
devbuildup: stopall
	docker compose -f compose.dev.yaml up -d --build

.PHONY: produp
produp: stopall
	docker compose up -d

.PHONY: prodbuildup
prodbuildup: stopall
	docker compose up -d --build

.PHONY: logsapp
logsapp:
	docker compose logs app -f

.PHONY: status
status:
	docker compose ps

