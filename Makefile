ifeq ($(RUNTIME_ENVIRONMENT), production)
	COMPOSE = sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml
else
	COMPOSE = docker-compose -f docker-compose.yml -f docker-compose.dev.yml
endif

SERVICE = api

build:
	npm run build && $(COMPOSE) build

up:
	npm run build && $(COMPOSE) up

up-d:
	npm run build && $(COMPOSE) up --build

down:
	$(COMPOSE) down
exec:
	$(COMPOSE) exec $(SERVICE) bash

