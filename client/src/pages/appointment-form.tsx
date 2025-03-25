import * as React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ExternalLink, Server, Lock } from "lucide-react";

export default function AppointmentForm() {
  const [baseUrl, setBaseUrl] = React.useState("");

  React.useEffect(() => {
    // Get the base URL of the current page for demonstration
    const url = window.location.origin;
    setBaseUrl(url);
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Medical Data Receiver System</h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          This system receives and organizes patient appointment requests from external websites via links
          and provides a secure portal for medical professionals to view the organized data.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader className="bg-primary text-white">
            <CardTitle>Receiving Data via Links</CardTitle>
            <CardDescription className="text-blue-100">
              How to submit patient data from external websites
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p>
                External websites can send patient data by creating links with query parameters for these six required fields:
              </p>

              <div className="bg-neutral-50 p-4 rounded-md border text-sm">
                <code className="text-primary break-all">
                  {baseUrl}/receive-data?name=John%20Doe&email=john@example.com&phone=1234567890&date=2025-04-01&time=9:00%20AM&symptoms=Headache%20and%20fever
                </code>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Required parameters:</p>
                <ul className="ml-6 space-y-1 list-disc text-neutral-700">
                  <li><strong>name</strong>: Patient's full name</li>
                  <li><strong>email</strong>: Patient's email address</li>
                  <li><strong>phone</strong>: Patient's phone number</li>
                  <li><strong>date</strong>: Preferred appointment date (YYYY-MM-DD format)</li>
                  <li><strong>time</strong>: Preferred appointment time</li>
                  <li><strong>symptoms</strong>: Description of symptoms or reason for visit</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <p className="flex items-start text-amber-700">
                  <ExternalLink className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    When a patient clicks this link, their data will be securely stored in the system, and they will receive a confirmation message.
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t">
            <p className="text-sm text-neutral-600">
              Use URL encoding for special characters in parameter values
            </p>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-neutral-800 text-white">
            <CardTitle>Admin Portal Access</CardTitle>
            <CardDescription className="text-gray-300">
              For medical professionals only
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <Server className="h-5 w-5 mr-2 text-neutral-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">View Organized Patient Data</p>
                  <p className="text-neutral-600 text-sm">
                    Doctors and authorized staff can securely view all appointment requests in an organized dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Lock className="h-5 w-5 mr-2 text-neutral-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Secure Authentication</p>
                  <p className="text-neutral-600 text-sm">
                    Login with admin credentials to access the secure portal. Only authorized personnel can view patient data.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-neutral-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Manage Appointments</p>
                  <p className="text-neutral-600 text-sm">
                    Review, approve, or cancel appointment requests. Filter and search through appointment data.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
                <p className="text-neutral-700">
                  Default admin credentials:
                </p>
                <ul className="ml-6 mt-2 space-y-1 list-disc text-neutral-700">
                  <li>Username: <code className="bg-blue-100 px-1 rounded">admin</code></li>
                  <li>Password: <code className="bg-blue-100 px-1 rounded">admin123</code></li>
                </ul>
                <p className="mt-2 text-sm text-neutral-600">
                  You can create additional admin accounts on the registration page.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 flex justify-center">
            <Link href="/auth" className="w-full">
              <Button className="w-full bg-neutral-800 hover:bg-neutral-700">
                Go to Admin Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-primary mb-3">Testing the System</h2>
        <p className="mb-4">
          To test the system, click on the example link below, which contains sample appointment data:
        </p>
        <div className="bg-white p-4 rounded-md border mb-4">
          <a 
            href={`${baseUrl}/receive-data?name=Test%20Patient&email=test@example.com&phone=1234567890&date=2025-04-01&time=9:00%20AM&symptoms=This%20is%20a%20test%20appointment%20request%20for%20demonstration%20purposes`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all flex items-center"
          >
            <span>{baseUrl}/receive-data?name=Test%20Patient&email=test@example.com&phone=1234567890&date=2025-04-01&time=9:00%20AM&symptoms=This%20is%20a%20test%20appointment...</span>
            <ExternalLink className="h-4 w-4 ml-1 flex-shrink-0" />
          </a>
        </div>
        <p className="text-sm text-neutral-600">
          After submitting test data, log in to the admin portal to view the submitted information.
        </p>
      </div>
    </div>
  );
}
