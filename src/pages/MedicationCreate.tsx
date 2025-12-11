import { AppLayout } from "@/components/layout/AppLayout";
import { MedicationForm } from "@/components/medications/MedicationForm";

export default function MedicationCreate() {
  return (
    <AppLayout requireAuth requireWatch>
      <MedicationForm />
    </AppLayout>
  );
}
