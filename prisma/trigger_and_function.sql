CREATE OR REPLACE FUNCTION handle_vehicle_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle Appointments linked to this vehicle
    UPDATE "Appointment"
    SET "vehicleId" = NULL
    WHERE "vehicleId" = OLD."vid";

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER after_vehicle_delete
AFTER DELETE ON "Vehicle"
FOR EACH ROW
EXECUTE FUNCTION handle_vehicle_delete();


-- Admin Role
CREATE ROLE admin_role WITH LOGIN PASSWORD 'admin_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON "ServiceCenter" TO admin_role;

-- Employee Role
CREATE ROLE employee_role WITH LOGIN PASSWORD 'employee_password';
GRANT SELECT ON "ServiceCenter" TO employee_role;