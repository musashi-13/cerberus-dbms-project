-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "phone_no" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "vid" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT,
    "type" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("vid")
);

-- CreateTable
CREATE TABLE "Service" (
    "service_id" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "est_end_date" TIMESTAMP(3) NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "serviceCenterId" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "Part" (
    "part_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "qty_in_stock" INTEGER NOT NULL,
    "qty_limit" INTEGER NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("part_id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "supplier_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_info" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "invoice_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_status" TEXT NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "payment_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_mode" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "appt_id" TEXT NOT NULL,
    "appt_date" TIMESTAMP(3) NOT NULL,
    "est_finish_date" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "service_comments" TEXT,
    "vehicleId" TEXT,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("appt_id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "feedback_id" TEXT NOT NULL,
    "comments" TEXT,
    "rating" INTEGER NOT NULL,
    "feedback_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appointmentId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedback_id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employee_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "serviceCenterId" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "ServiceCenter" (
    "service_center_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "ServiceCenter_pkey" PRIMARY KEY ("service_center_id")
);

-- CreateTable
CREATE TABLE "_PartToSupplier" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PartToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EmployeeToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_registrationNo_key" ON "Vehicle"("registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceCenterId_key" ON "Service"("serviceCenterId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_appointmentId_key" ON "Feedback"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "_PartToSupplier_AB_unique" ON "_PartToSupplier"("A", "B");

-- CreateIndex
CREATE INDEX "_PartToSupplier_B_index" ON "_PartToSupplier"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PartToService_AB_unique" ON "_PartToService"("A", "B");

-- CreateIndex
CREATE INDEX "_PartToService_B_index" ON "_PartToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToService_AB_unique" ON "_EmployeeToService"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToService_B_index" ON "_EmployeeToService"("B");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("vid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES "ServiceCenter"("service_center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("invoice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("vid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("appt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES "ServiceCenter"("service_center_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartToSupplier" ADD CONSTRAINT "_PartToSupplier_A_fkey" FOREIGN KEY ("A") REFERENCES "Part"("part_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartToSupplier" ADD CONSTRAINT "_PartToSupplier_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplier"("supplier_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartToService" ADD CONSTRAINT "_PartToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Part"("part_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartToService" ADD CONSTRAINT "_PartToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToService" ADD CONSTRAINT "_EmployeeToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToService" ADD CONSTRAINT "_EmployeeToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

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