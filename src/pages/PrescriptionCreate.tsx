import { AppLayout } from "@/components/layout/AppLayout";
import { PrescriptionForm } from "@/components/prescriptions/PrescriptionForm";

export default function PrescriptionCreate() {
  return (
    <AppLayout requireAuth requireWatch>
      <PrescriptionForm />
    </AppLayout>
  );
}
