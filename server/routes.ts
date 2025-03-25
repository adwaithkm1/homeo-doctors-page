import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertAppointmentSchema, updateAppointmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // External data receiver endpoint
  app.get("/receive-data", async (req, res, next) => {
    try {
      // Extract data from URL query parameters
      const { name, email, phone, date, time, symptoms } = req.query;
      
      // Validate and format the data
      const appointmentData = {
        name: String(name || ''),
        email: String(email || ''),
        phone: String(phone || ''),
        preferredDate: String(date || ''),
        preferredTime: String(time || ''),
        symptoms: String(symptoms || '')
      };

      // Validate using the schema
      const validatedData = insertAppointmentSchema.parse(appointmentData);
      
      // Store the appointment
      const appointment = await storage.createAppointment(validatedData);
      
      // Return custom confirmation HTML page (no Vite/React)
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Appointment Received</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 40px;
                background-color: #f5f5f5;
                margin: 0;
                line-height: 1.6;
              }
              .container {
                background-color: white;
                border-radius: 8px;
                padding: 30px 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                max-width: 500px;
                margin: 0 auto;
              }
              h1 {
                color: #1e3a8a;
                margin-top: 0;
              }
              .success-icon {
                color: #22c55e;
                font-size: 64px;
                margin-bottom: 20px;
                display: block;
              }
              .details {
                background-color: #f0f9ff;
                border: 1px solid #bae6fd;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                text-align: left;
              }
              .details p {
                margin: 5px 0;
              }
              .details strong {
                display: inline-block;
                width: 120px;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #64748b;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <span class="success-icon">✓</span>
              <h1>Appointment Information Received</h1>
              <p>Thank you! Your appointment request has been successfully submitted.</p>
              
              <div class="details">
                <p><strong>Name:</strong> ${appointment.name}</p>
                <p><strong>Email:</strong> ${appointment.email}</p>
                <p><strong>Phone:</strong> ${appointment.phone}</p>
                <p><strong>Date:</strong> ${appointment.preferredDate}</p>
                <p><strong>Time:</strong> ${appointment.preferredTime}</p>
              </div>
              
              <p>You can come on the time selected.</p>
              
              <div class="footer">
                Reference ID: ${appointment.id}
              </div>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Return custom error HTML page (no Vite/React)
        res.setHeader('Content-Type', 'text/html');
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Error in Appointment Data</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                  padding: 40px;
                  background-color: #f5f5f5;
                  margin: 0;
                  line-height: 1.6;
                }
                .container {
                  background-color: white;
                  border-radius: 8px;
                  padding: 30px 20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  max-width: 500px;
                  margin: 0 auto;
                }
                h1 {
                  color: #b91c1c;
                  margin-top: 0;
                }
                .error-icon {
                  color: #ef4444;
                  font-size: 64px;
                  margin-bottom: 20px;
                  display: block;
                }
                .error-list {
                  background-color: #fee2e2;
                  border: 1px solid #fecaca;
                  border-radius: 6px;
                  padding: 15px 15px 15px 35px;
                  margin: 20px 0;
                  text-align: left;
                }
                .error-list ul {
                  margin: 0;
                  padding: 0 0 0 20px;
                }
                .error-list li {
                  margin-bottom: 5px;
                }
                .back-link {
                  display: inline-block;
                  margin-top: 20px;
                  color: #3b82f6;
                  text-decoration: none;
                }
                .back-link:hover {
                  text-decoration: underline;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <span class="error-icon">✗</span>
                <h1>Error in Appointment Data</h1>
                <p>There were errors with the provided information:</p>
                <div class="error-list">
                  <ul>
                    ${error.errors.map(err => `<li><strong>${err.path.join('.')}:</strong> ${err.message}</li>`).join('')}
                  </ul>
                </div>
                <p>Please correct the information and try again.</p>
                <a href="javascript:history.back()" class="back-link">Go Back</a>
              </div>
            </body>
          </html>
        `);
      }
      next(error);
    }
  });

  // Appointment routes
  app.post("/api/appointments", async (req, res, next) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });

  app.get("/api/appointments", async (req, res, next) => {
    // Only authenticated admin users can access appointments
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/appointments/:id", async (req, res, next) => {
    // Only authenticated admin users can access appointments
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid appointment ID" });
      }
      
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/appointments/:id", async (req, res, next) => {
    // Only authenticated admin users can update appointments
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid appointment ID" });
      }
      
      const validatedData = updateAppointmentSchema.parse(req.body);
      const updatedAppointment = await storage.updateAppointment(id, validatedData);
      
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
