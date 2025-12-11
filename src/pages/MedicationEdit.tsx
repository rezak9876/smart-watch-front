import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { MedicationForm } from "@/components/medications/MedicationForm";

export default function MedicationEdit() {
  const { id } = useParams();

  return (
    <AppLayout requireAuth requireWatch>
      <MedicationForm medicationId={id} isEdit />
    </AppLayout>
  );
}
