# Tattoo Task Tracker API

Solo project

API with CRUD operations for tattoos, clients, and events endpoints

Technologies: Node, Express, PostgreSQL

https://tattoo-planner-app.now.sh/

## Clients
GET all clients: /api/clients/  
POST new client: /api/clients/   
  Body: full_name(required), phone, email, client_rating  
GET by client id: /api/clients/:id  

DELETE by client id: /api/clients/:id  

## Events
GET all events: /api/events/  
POST new event: /api/events/  
  Body:   
      title (required),  
      description,  
      eventdate (required),  
      start_time,  
      end_time,  
      in_person(required),  
      curr_status(required),  
      all_day(required),  
      tattoo(required)  
GET event by id: /api/events/:id  
DELETE by id: /api/events/:id  

## Tattoos
GET all tattoos: /api/tattoos/  
POST new tattoo: /api/tattoos/  
  Body:   
      title (required),  
      position,  
      info,  
      curr_status(required),  
      tattoo_rating,  
      client(required)  
GET tattoo by id: /api/tattoos/:id  
DELETE tattoo by id: /api/tattoos/:id  

![alt text](https://raw.githubusercontent.com/lzylstra/tattoo-planner-app/master/src/img/cover-img.png)
