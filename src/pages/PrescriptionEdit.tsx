import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PrescriptionForm } from "@/components/prescriptions/PrescriptionForm";

export default function PrescriptionEdit() {
  const { id } = useParams();

  return (
    <AppLayout requireAuth requireWatch>
      <PrescriptionForm prescriptionId={id} isEdit />
    </AppLayout>
  );
}
