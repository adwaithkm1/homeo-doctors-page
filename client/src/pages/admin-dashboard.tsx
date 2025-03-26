import * as React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Appointment } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import googleDriveClient from '../googleDriveClient';

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [deletedData, setDeletedData] = React.useState<Appointment[]>([]);

  React.useEffect(() => {
    handleIncomingData();
  }, []);

  // ✅ Fetch appointments
  const { data: appointments, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    enabled: !!user?.isAdmin,
    staleTime: 5000,
    retry: 1,
  });

  const safeAppointments = appointments ?? [];

  // ✅ Handle incoming appointment data
  function handleIncomingData() {
    const params = new URLSearchParams(window.location.search);
    const newAppointment: Appointment = {
      id: Date.now(),
      name: params.get("name") || "Unknown",
      email: params.get("email") || "No Email",
      phone: params.get("phone") || "No Phone",
      preferredDate: params.get("date") || "No Date",
      preferredTime: params.get("time") || "No Time",
      symptoms: params.get("symptoms") || "No Symptoms",
      status: "Pending",
    };

    if (params.has("name") && params.has("email")) {
     uploadFile(newAppointment);
      toast({ title: "New Appointment", description: "Data saved to Google Drive." });
    }
  }

  // ✅ Save appointment data to Google Drive
  async function uploadfile(appointment: Appointment) {
    try {
      const response = await googleDriveStorage.uploadJSON(
        appointment-${appointment.id}.json,
        appointment
      );
      console.log("✅ Saved to Drive:", response);
    } catch (error) {
      console.error("❌ Google Drive save error:", error);
      toast({ title: "Google Drive Error", description: "Failed to save data.", variant: "destructive" });
    }
  }

  // ✅ Mutation to delete appointment (backs up before deleting)
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const getRes = await apiRequest("GET", /api/appointments/${id});
      const appointment = await getRes.json();
      await saveDataToDrive(appointment); // Backup before deleting
      const deleteRes = await apiRequest("DELETE", /api/appointments/${id});
      return deleteRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "Appointment deleted", description: "Backup saved to Google Drive." });
    },
  });

  // ✅ Restore deleted data from Google Drive
  const handleRestore = async () => {
    try {
      const data = await googleDriveStorage.fetchBackupData();
      setDeletedData(data ?? []);
      toast({ title: "Deleted data loaded", description: "Available for restoration." });
    } catch (error) {
      toast({ title: "Restore error", description: "Failed to load backup.", variant: "destructive" });
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <button onClick={handleRestore} className="px-4 py-2 bg-blue-600 text-white rounded">
        Load Backup
      </button>

      {/* ✅ Main Appointments Table */}
      <DataTable 
        data={safeAppointments} 
        isLoading={isLoading} 
        error={error as Error} 
        columns={[
          { header: "Name", accessorKey: "name", sortable: true },
          { header: "Email", accessorKey: "email", sortable: true },
          { header: "Phone", accessorKey: "phone", sortable: true },
          { header: "Date", accessorKey: "preferredDate", sortable: true },
          { header: "Time", accessorKey: "preferredTime", sortable: true },
          { header: "Symptoms", accessorKey: "symptoms", sortable: false },
        ]}
      />
    </div>
  );
}  
